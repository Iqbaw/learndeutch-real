import { NextResponse } from "next/server";
import { chatJSON, isAIEnabled, DeepSeekError } from "@/lib/deepseek";
import type {
  Lesson,
  LessonStep,
  LessonStepType,
  ColoredToken,
  CEFRLevel,
} from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STEP_TYPES: LessonStepType[] = [
  "story",
  "pattern",
  "example",
  "drill",
  "listening",
  "speaking",
  "writing",
  "mistake",
  "victory",
];

const TOKEN_ROLES: ColoredToken["role"][] = [
  "subject",
  "verb",
  "info",
  "object",
  "time",
  "plain",
];

interface GenerateLessonInput {
  day: number;
  subLevel: CEFRLevel;
  theme: string;
  goal: string[];
  profile: {
    name?: string;
    goal?: string;
    weakSkill?: string;
    learningStyle?: string;
    estimatedLevel?: string;
  };
  recentErrorCategories: string[];
  focusAreas: string[];
}

function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() ? x.trim() : undefined;
}

/** Reject a prompt that asks to complete a sentence but contains no actual sentence/gap. */
function promptLooksComplete(prompt: string): boolean {
  const p = prompt.trim();
  if (p.length < 6) return false;
  if (/[:：]\s*$/.test(p)) return false;
  const wantsGap = /(lengkapi|melengkapi|isilah|isi titik|rumpang|kalimat berikut|lengkapilah|sisipkan)/i.test(p);
  if (wantsGap && !p.includes("___") && !p.includes("…") && !p.includes("...")) return false;
  return true;
}

/** Sanitize one AI step into a renderer-safe LessonStep, or null if unusable. */
function coerceStep(raw: unknown): LessonStep | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const type = STEP_TYPES.includes(o.type as LessonStepType)
    ? (o.type as LessonStepType)
    : null;
  if (!type) return null;
  const title = str(o.title) ?? defaultTitle(type);

  const step: LessonStep = { type, title };

  if (str(o.body)) step.body = str(o.body);
  if (str(o.formula)) step.formula = str(o.formula);
  if (str(o.german)) step.german = str(o.german);
  if (str(o.indonesian)) step.indonesian = str(o.indonesian);
  if (str(o.prompt)) step.prompt = str(o.prompt);
  if (str(o.expected)) step.expected = str(o.expected);
  if (str(o.wrong)) step.wrong = str(o.wrong);
  if (str(o.correct)) step.correct = str(o.correct);

  if (Array.isArray(o.keywords)) {
    const kws = o.keywords.filter((k): k is string => typeof k === "string");
    if (kws.length) step.keywords = kws;
  }

  if (Array.isArray(o.achievements)) {
    const a = o.achievements.filter((x): x is string => typeof x === "string");
    if (a.length) step.achievements = a;
  }

  if (Array.isArray(o.tokens)) {
    const tokens = o.tokens
      .map((t): ColoredToken | null => {
        if (!t || typeof t !== "object") return null;
        const to = t as Record<string, unknown>;
        const text = str(to.text);
        if (!text) return null;
        const role = TOKEN_ROLES.includes(to.role as ColoredToken["role"])
          ? (to.role as ColoredToken["role"])
          : "plain";
        return { text, role };
      })
      .filter((t): t is ColoredToken => t !== null);
    if (tokens.length) step.tokens = tokens;
  }

  if (o.exercise && typeof o.exercise === "object") {
    const e = o.exercise as Record<string, unknown>;
    const prompt = str(e.prompt);
    let options = Array.isArray(e.options)
      ? e.options.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
      : [];
    // Drop duplicate options — avoids the "every answer looks correct" problem.
    const seen = new Set<string>();
    options = options.filter((opt) => {
      const k = opt.trim().toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    const correctIndex = typeof e.correctIndex === "number" ? e.correctIndex : -1;
    if (prompt && promptLooksComplete(prompt) && options.length >= 2 && correctIndex >= 0 && correctIndex < options.length) {
      const audioText = str(e.audioText);
      step.exercise = {
        prompt,
        options,
        correctIndex,
        explanation: str(e.explanation) ?? "",
        ...(audioText ? { audioText } : {}),
      };
    } else if (type === "drill" || type === "listening") {
      // a drill/listening step without a valid exercise is not renderable
      return null;
    }
  } else if (type === "drill" || type === "listening") {
    return null;
  }

  // speaking/writing need a prompt to be useful
  if ((type === "speaking" || type === "writing") && !step.prompt) return null;
  // mistake needs wrong+correct
  if (type === "mistake" && (!step.wrong || !step.correct)) return null;
  // victory needs achievements
  if (type === "victory" && !step.achievements) {
    step.achievements = ["Kamu menyelesaikan pelajaran hari ini!"];
  }

  return step;
}

function defaultTitle(type: LessonStepType): string {
  const map: Record<LessonStepType, string> = {
    story: "Cerita",
    pattern: "Pola & rumus",
    example: "Contoh",
    drill: "Latihan",
    listening: "Dengarkan",
    speaking: "Ucapkan",
    writing: "Tulis jawaban",
    mistake: "Kesalahan umum",
    victory: "Ringkasan",
  };
  return map[type];
}

function coerceLesson(raw: unknown, input: GenerateLessonInput): Lesson | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  const stepsRaw = Array.isArray(o.steps) ? o.steps : [];
  const steps = stepsRaw
    .map(coerceStep)
    .filter((s): s is LessonStep => s !== null);

  // Need a meaningful lesson: at least a few steps and at least one exercise.
  const hasExercise = steps.some((s) => s.exercise || s.type === "speaking" || s.type === "writing");
  if (steps.length < 4 || !hasExercise) return null;

  // Guarantee a closing victory step.
  if (!steps.some((s) => s.type === "victory")) {
    steps.push({
      type: "victory",
      title: "Mini Victory!",
      body: "Hebat! Kamu menyelesaikan pelajaran hari ini.",
      achievements: ["Pelajaran selesai.", "Latihan tercatat di progresmu."],
    });
  }

  const goal = Array.isArray(o.goal)
    ? o.goal.filter((g): g is string => typeof g === "string").slice(0, 4)
    : input.goal;

  return {
    day: input.day,
    subLevel: input.subLevel,
    title: str(o.title) ?? input.theme,
    goal: goal.length ? goal : input.goal,
    estimatedMinutes: typeof o.estimatedMinutes === "number" ? o.estimatedMinutes : 35,
    steps,
  };
}

async function generateLesson(input: GenerateLessonInput): Promise<Lesson | null> {
  if (!isAIEnabled()) return null;

  const weak = input.profile.weakSkill && input.profile.weakSkill !== "Belum tahu"
    ? input.profile.weakSkill
    : null;
  const errorNote = input.recentErrorCategories.length
    ? `Beri perhatian ekstra pada kategori kesalahan terakhir pelajar: ${input.recentErrorCategories.join(", ")}.`
    : "";
  const focusNote = input.focusAreas.length
    ? `Area fokus dari tes penempatan: ${input.focusAreas.join(", ")}.`
    : "";

  const system =
    "Kamu adalah guru bahasa Jerman terbaik (seperti penulis buku ajar Goethe) yang membuat " +
    "pelajaran interaktif premium untuk pelajar Indonesia, mengikuti standar CEFR. Materi " +
    "Jerman 100% akurat secara tata bahasa dan ejaan. Penjelasan dalam bahasa Indonesia yang " +
    "hangat, jelas, dan memotivasi; sapa pelajar dengan namanya. Balas HANYA satu objek JSON valid.";

  const user = `Buat SATU pelajaran interaktif bahasa Jerman yang BERKUALITAS TINGGI dan dipersonalisasi.

Profil pelajar:
- Nama: ${input.profile.name || "Pelajar"}
- Tujuan belajar: ${input.profile.goal || "umum"}
- Estimasi level: ${input.profile.estimatedLevel || input.subLevel}
- Gaya belajar yang disukai: ${input.profile.learningStyle || "campuran"}
- Skill terlemah: ${weak || "belum diketahui"}
${errorNote ? `- ${errorNote}` : ""}
${focusNote ? `- ${focusNote}` : ""}

Materi hari ini:
- Hari ke-${input.day}, tingkat ${input.subLevel}
- Tema: ${input.theme}
- Target: ${input.goal.join("; ")}

Standar KUALITAS (penting):
- Sesuaikan kesulitan dengan level ${input.subLevel}. Untuk A1/A2: kalimat pendek, kosakata
  sehari-hari, tidak bertele-tele. Tetap menantang tapi bisa dipahami.
- "story": buka dengan skenario nyata yang relatable & relevan dengan TUJUAN pelajar
  (mis. kuliah/kerja/liburan), sebut nama pelajar, 2–4 kalimat hangat. Bukan definisi kaku.
- "pattern": jelaskan pola dengan analogi sederhana + "formula" yang RAPI. Tulis formula
  memakai " · " untuk memisahkan item (mis. konjugasi) dan " + " untuk pola kalimat
  (mis. "Subjekt + Verb (Pos.2) + Rest"). Pakai "→" untuk transformasi (mis. "der → den").
- "example": WAJIB ada 2 contoh. Setiap contoh punya "german", "indonesian", dan "tokens"
  berwarna (pisahkan TIAP kata jadi token dengan role yang tepat) agar struktur terlihat.
- Personalisasi: kaitkan contoh & kosakata dengan tujuan/minat pelajar bila relevan.
- Jika skill terlemah diketahui, tambah latihan untuk skill itu; jika ada kategori kesalahan
  terakhir, sisipkan satu drill yang menyasar kesalahan itu.
- DILARANG soal fonetik/pelafalan/IPA.

Struktur WAJIB (8–11 langkah, urut natural):
- 1 "story", 1 "pattern", 2 "example", 3 "drill", 1 "listening", 1 langkah produktif
  ("speaking" ATAU "writing"), 1 "mistake" (khas kesalahan orang Indonesia), diakhiri 1 "victory".
- Setiap "drill"/"listening" punya "exercise" dengan 3 opsi BERBEDA, hanya 1 benar; 2 distraktor
  harus MIRIP tapi JELAS SALAH (mewakili kesalahan umum), bukan jawaban yang juga benar.
- "listening" WAJIB punya "audioText" (kalimat/dialog Jerman natural yang DIPUTAR); "prompt"
  listening berisi PERTANYAAN saja (Indonesia), jangan tampilkan teks Jermannya.
- Soal melengkapi kalimat WAJIB memuat kalimat Jerman LENGKAP dengan bagian kosong "___".
- "explanation" tiap soal: jelaskan kenapa benar DAN kenapa opsi lain salah (mendidik, singkat).
- "mistake": tunjukkan "wrong" (kesalahan umum) vs "correct" + "body" penjelasan singkat.
- "victory": 2–3 "achievements" konkret yang BERBEDA (jangan mengulang kalimat yang sama).

Skema JSON (ikuti persis nama field):
{
  "title": "judul pelajaran (Indonesia, menarik)",
  "goal": ["target 1", "target 2", "target 3"],
  "estimatedMinutes": 35,
  "steps": [
    { "type": "story", "title": "...", "body": "..." },
    { "type": "pattern", "title": "...", "body": "...", "formula": "Subjekt + Verb (Pos.2) + Rest" },
    { "type": "example", "title": "...", "german": "...", "indonesian": "...",
      "tokens": [ { "text": "Ich", "role": "subject" }, { "text": "lerne", "role": "verb" }, { "text": "Deutsch", "role": "object" } ] },
    { "type": "example", "title": "...", "german": "...", "indonesian": "...", "tokens": [ ... ] },
    { "type": "drill", "title": "...", "exercise": { "prompt": "...", "options": ["a","b","c"], "correctIndex": 0, "explanation": "..." } },
    { "type": "drill", "title": "...", "exercise": { "prompt": "kalimat dgn ___", "options": ["a","b","c"], "correctIndex": 1, "explanation": "..." } },
    { "type": "drill", "title": "...", "exercise": { "prompt": "...", "options": ["a","b","c"], "correctIndex": 2, "explanation": "..." } },
    { "type": "listening", "title": "...", "exercise": { "prompt": "pertanyaan saja (Indonesia)", "audioText": "kalimat/dialog Jerman", "options": ["a","b","c"], "correctIndex": 1, "explanation": "..." } },
    { "type": "writing", "title": "...", "prompt": "Tulis dalam bahasa Jerman: ...", "expected": "kalimat Jerman", "keywords": ["kata wajib"] },
    { "type": "mistake", "title": "...", "wrong": "salah", "correct": "benar", "body": "penjelasan" },
    { "type": "victory", "title": "Mini Victory!", "achievements": ["...", "..."], "body": "..." }
  ]
}
Field "role" pada tokens hanya boleh: subject, verb, info, object, time, plain.`;

  try {
    const result = await chatJSON<unknown>(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { temperature: 0.6, maxTokens: 4000, timeoutMs: 60_000 }
    );
    return coerceLesson(result, input);
  } catch (err) {
    if (!(err instanceof DeepSeekError)) console.error("lesson generation error", err);
    return null;
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input: GenerateLessonInput = {
    day: typeof body.day === "number" ? body.day : 1,
    subLevel: (str(body.subLevel) as CEFRLevel) ?? "A1.1",
    theme: str(body.theme) ?? "Pelajaran bahasa Jerman",
    goal: Array.isArray(body.goal)
      ? (body.goal.filter((g) => typeof g === "string") as string[])
      : [],
    profile:
      body.profile && typeof body.profile === "object"
        ? (body.profile as GenerateLessonInput["profile"])
        : {},
    recentErrorCategories: Array.isArray(body.recentErrorCategories)
      ? (body.recentErrorCategories.filter((c) => typeof c === "string") as string[])
      : [],
    focusAreas: Array.isArray(body.focusAreas)
      ? (body.focusAreas.filter((c) => typeof c === "string") as string[])
      : [],
  };

  const lesson = await generateLesson(input);
  if (!lesson) {
    return NextResponse.json({ lesson: null, aiEnabled: isAIEnabled() });
  }
  return NextResponse.json({ lesson, aiEnabled: true });
}

export async function GET() {
  return NextResponse.json({ aiEnabled: isAIEnabled() });
}
