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
    const options = Array.isArray(e.options)
      ? e.options.filter((x): x is string => typeof x === "string" && x.trim().length > 0)
      : [];
    const correctIndex = typeof e.correctIndex === "number" ? e.correctIndex : -1;
    if (prompt && options.length >= 2 && correctIndex >= 0 && correctIndex < options.length) {
      step.exercise = {
        prompt,
        options,
        correctIndex,
        explanation: str(e.explanation) ?? "",
      };
    } else if ((type === "drill" || type === "listening") && !prompt) {
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
    "Kamu adalah guru bahasa Jerman ahli yang membuat pelajaran interaktif untuk pelajar " +
    "Indonesia, mengikuti standar CEFR. Semua instruksi, cerita, dan penjelasan ditulis " +
    "dalam bahasa Indonesia yang hangat dan mudah; materi bahasa Jerman akurat secara " +
    "tata bahasa. Balas HANYA dengan satu objek JSON valid sesuai skema.";

  const user = `Buat SATU pelajaran interaktif bahasa Jerman yang dipersonalisasi.

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

Aturan konten:
- Sesuaikan contoh dengan tujuan & minat pelajar bila relevan.
- Jika skill terlemah diketahui, tambahkan lebih banyak langkah latihan untuk skill itu.
- Buat 7–10 langkah dengan urutan yang masuk akal.
- Wajib ada minimal: 1 "story", 1 "pattern", 1 "example", 2 "drill", 1 langkah produktif ("speaking" atau "writing"), 1 "mistake", diakhiri 1 "victory".
- Setiap "drill" dan "listening" WAJIB punya objek "exercise" dengan 3 opsi.
- Penjelasan jawaban harus jelas dan mendidik.

Skema JSON (ikuti persis nama field):
{
  "title": "judul pelajaran (Indonesia)",
  "goal": ["target 1", "target 2", "target 3"],
  "estimatedMinutes": 35,
  "steps": [
    { "type": "story", "title": "...", "body": "..." },
    { "type": "pattern", "title": "...", "body": "...", "formula": "..." },
    { "type": "example", "title": "...", "german": "...", "indonesian": "...",
      "tokens": [ { "text": "Ich", "role": "subject" }, { "text": "lerne", "role": "verb" } ] },
    { "type": "drill", "title": "...", "exercise": { "prompt": "...", "options": ["a","b","c"], "correctIndex": 0, "explanation": "..." } },
    { "type": "listening", "title": "...", "exercise": { "prompt": "...", "options": ["a","b","c"], "correctIndex": 1, "explanation": "..." } },
    { "type": "speaking", "title": "...", "prompt": "Ucapkan: ...", "expected": "kalimat Jerman", "body": "tips" },
    { "type": "writing", "title": "...", "prompt": "Tulis: ...", "expected": "kalimat Jerman", "keywords": ["kata wajib"] },
    { "type": "mistake", "title": "...", "wrong": "salah", "correct": "benar", "body": "penjelasan" },
    { "type": "victory", "title": "Mini Victory!", "achievements": ["..."], "body": "..." }
  ]
}
Field "role" pada tokens hanya boleh: subject, verb, info, object, time, plain.`;

  try {
    const result = await chatJSON<unknown>(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { temperature: 0.65, maxTokens: 3200, timeoutMs: 45_000 }
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
