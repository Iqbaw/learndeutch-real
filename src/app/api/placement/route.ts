import { NextResponse } from "next/server";
import { chatJSON, isAIEnabled, DeepSeekError } from "@/lib/deepseek";
import {
  pickFallbackQuestion,
  type PlacementItem,
} from "@/data/placement-bank";
import {
  PLACEMENT_BANDS,
  PLACEMENT_SKILLS,
  SKILL_LABEL,
  type PlacementBand,
  type PlacementSkill,
} from "@/lib/placement-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface QuestionResponse extends PlacementItem {
  band: PlacementBand;
  skill: PlacementSkill;
  source: "ai" | "fallback";
}

/** Reject prompts that promise a sentence to complete but don't actually contain one. */
function promptLooksComplete(prompt: string): boolean {
  const p = prompt.trim();
  if (p.length < 8) return false;
  // ends with a colon → the sentence/material is missing
  if (/[:：]\s*$/.test(p)) return false;
  const wantsGap = /(lengkapi|melengkapi|isilah|isi titik|rumpang|kalimat berikut|lengkapilah|sisipkan)/i.test(p);
  if (wantsGap && !p.includes("___") && !p.includes("…") && !p.includes("...")) return false;
  return true;
}

function isValidItem(x: unknown): x is PlacementItem {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (
    typeof o.prompt !== "string" ||
    o.prompt.trim().length === 0 ||
    !promptLooksComplete(o.prompt) ||
    !Array.isArray(o.options) ||
    o.options.length !== 4 ||
    !o.options.every((opt) => typeof opt === "string" && opt.trim().length > 0) ||
    typeof o.correctIndex !== "number" ||
    o.correctIndex < 0 ||
    o.correctIndex > 3 ||
    typeof o.explanation !== "string"
  ) {
    return false;
  }
  // Reject duplicate options — a frequent cause of "all answers look correct".
  const normalized = (o.options as string[]).map((s) => s.trim().toLowerCase());
  if (new Set(normalized).size !== normalized.length) return false;
  return true;
}

const SKILL_GUIDANCE: Record<PlacementSkill, string> = {
  grammar: "tata bahasa Jerman (struktur kalimat, konjugasi, kasus, artikel, urutan kata)",
  vocabulary: "kosakata Jerman (arti kata, kata yang tepat dalam konteks)",
  reading: "pemahaman membaca (memahami makna kalimat/teks pendek Jerman)",
  communication: "komunikasi praktis (ungkapan, fungsi bahasa, kalimat yang sesuai situasi)",
};

async function generateQuestion(
  band: PlacementBand,
  skill: PlacementSkill,
  recentPrompts: string[]
): Promise<QuestionResponse> {
  const fallback = (): QuestionResponse => ({
    ...pickFallbackQuestion(band, skill, recentPrompts.length),
    band,
    skill,
    source: "fallback",
  });

  if (!isAIEnabled()) return fallback();

  const avoid = recentPrompts.slice(-6).map((p) => `- ${p}`).join("\n");

  const system =
    "Kamu adalah penyusun soal ujian penempatan bahasa Jerman yang ahli dan teliti, " +
    "mengikuti standar CEFR. Kamu membuat soal pilihan ganda yang akurat untuk pelajar " +
    "Indonesia. Instruksi dan penjelasan ditulis dalam bahasa Indonesia; materi soal dalam " +
    "bahasa Jerman. Selalu balas HANYA dengan satu objek JSON valid.";

  const user = `Buat SATU soal pilihan ganda bahasa Jerman.
- Tingkat CEFR: ${band}
- Keterampilan yang diuji: ${SKILL_LABEL[skill]} — ${SKILL_GUIDANCE[skill]}
- Soal HARUS pas untuk tingkat ${band}: untuk A1/A2 buat soal sederhana dan praktis,
  jangan terlalu sulit. Gunakan kosakata & situasi sehari-hari yang umum.
- DILARANG membuat soal fonetik/pelafalan/transkripsi IPA atau soal "bunyi mana yang benar".
  Fokus ke arti, tata bahasa, dan pemahaman — bukan pengucapan.
- WAJIB: jika soal meminta melengkapi/mengisi kalimat, tulis KALIMAT JERMAN LENGKAP di dalam
  "prompt" dengan bagian yang kosong ditandai "___". JANGAN menulis instruksi saja
  (mis. "Lengkapi kalimat berikut:") tanpa kalimatnya. Untuk jenis soal lain (arti kata,
  pilih yang benar), materi Jerman yang diuji juga HARUS ada di dalam "prompt".
- Aturan jawaban (PENTING): tepat 4 opsi dengan HANYA 1 yang benar. 3 opsi lain harus
  JELAS SALAH secara tata bahasa/arti (mewakili kesalahan umum), BUKAN jawaban yang juga
  bisa dianggap benar. Jangan pernah membuat lebih dari satu opsi yang benar.
- Hindari soal yang mirip dengan yang sudah pernah muncul:
${avoid || "- (belum ada)"}

Format JSON yang WAJIB:
{
  "prompt": "instruksi singkat dalam bahasa Indonesia + materi Jerman",
  "options": ["opsi1", "opsi2", "opsi3", "opsi4"],
  "correctIndex": 0,
  "explanation": "penjelasan singkat dalam bahasa Indonesia mengapa jawaban itu benar dan kenapa opsi lain salah"
}`;

  try {
    const result = await chatJSON<PlacementItem>(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { temperature: 0.7, maxTokens: 700, timeoutMs: 20_000 }
    );
    if (isValidItem(result)) {
      return { ...result, band, skill, source: "ai" };
    }
    return fallback();
  } catch (err) {
    if (!(err instanceof DeepSeekError)) console.error("placement question error", err);
    return fallback();
  }
}

interface SummaryInput {
  estimatedLevel: string;
  startLevel: string;
  scorePct: number;
  confidence: number;
  perSkill: { label: string; accuracy: number; total: number }[];
  profile: {
    name?: string;
    goal?: string;
    weakSkill?: string;
    dailyTime?: string;
  };
}

async function generateSummary(
  input: SummaryInput
): Promise<{ summary: string; focusAreas: string[] }> {
  const weakest = [...input.perSkill]
    .filter((s) => s.total > 0)
    .sort((a, b) => a.accuracy - b.accuracy)[0];

  const fallback = {
    summary:
      input.estimatedLevel === "A1.1"
        ? "Kita mulai dari A1.1 untuk membangun fondasi yang kokoh. Setiap hari kamu akan terasa makin percaya diri."
        : `Estimasi kemampuanmu sekitar ${input.estimatedLevel} (skor ${input.scorePct}%). Kita rancang jalur belajar yang pas untukmu.`,
    focusAreas: weakest ? [weakest.label] : [],
  };

  if (!isAIEnabled()) return fallback;

  const skillLines = input.perSkill
    .map((s) => `- ${s.label}: ${s.total > 0 ? `${s.accuracy}% benar` : "belum diuji"}`)
    .join("\n");

  const system =
    "Kamu mentor bahasa Jerman yang hangat dan memotivasi untuk pelajar Indonesia. " +
    "Balas HANYA dengan satu objek JSON valid.";

  const user = `Buat ringkasan hasil tes penempatan yang personal dan memotivasi (bahasa Indonesia).
Data pelajar:
- Nama: ${input.profile.name || "Pelajar"}
- Tujuan belajar: ${input.profile.goal || "tidak disebutkan"}
- Skill yang dirasa lemah: ${input.profile.weakSkill || "tidak disebutkan"}
- Waktu belajar/hari: ${input.profile.dailyTime || "30"} menit
Hasil tes:
- Estimasi level: ${input.estimatedLevel}
- Titik mulai di kursus: ${input.startLevel}
- Skor: ${input.scorePct}% (confidence ${input.confidence}%)
- Rincian per keterampilan:
${skillLines}

Format JSON:
{
  "summary": "2-3 kalimat hangat, menjelaskan level & langkah berikutnya, menyebut nama bila ada",
  "focusAreas": ["1-3 area fokus konkret berdasarkan keterampilan terlemah"]
}`;

  try {
    const result = await chatJSON<{ summary?: unknown; focusAreas?: unknown }>(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { temperature: 0.6, maxTokens: 500, timeoutMs: 20_000 }
    );
    const summary = typeof result.summary === "string" && result.summary.trim() ? result.summary.trim() : fallback.summary;
    const focusAreas = Array.isArray(result.focusAreas)
      ? result.focusAreas.filter((f): f is string => typeof f === "string").slice(0, 3)
      : fallback.focusAreas;
    return { summary, focusAreas };
  } catch (err) {
    if (!(err instanceof DeepSeekError)) console.error("placement summary error", err);
    return fallback;
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const action = body.action;

  if (action === "question") {
    const band = PLACEMENT_BANDS.includes(body.band as PlacementBand)
      ? (body.band as PlacementBand)
      : "A1.2";
    const skill = PLACEMENT_SKILLS.includes(body.skill as PlacementSkill)
      ? (body.skill as PlacementSkill)
      : "grammar";
    const recentPrompts = Array.isArray(body.recentPrompts)
      ? (body.recentPrompts.filter((p) => typeof p === "string") as string[])
      : [];
    const question = await generateQuestion(band, skill, recentPrompts);
    return NextResponse.json({ question });
  }

  if (action === "summary") {
    const input = body as unknown as SummaryInput;
    const result = await generateSummary({
      estimatedLevel: String(input.estimatedLevel ?? "A1.1"),
      startLevel: String(input.startLevel ?? "A1.1"),
      scorePct: Number(input.scorePct ?? 0),
      confidence: Number(input.confidence ?? 0),
      perSkill: Array.isArray(input.perSkill) ? input.perSkill : [],
      profile: input.profile ?? {},
    });
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function GET() {
  return NextResponse.json({ aiEnabled: isAIEnabled() });
}
