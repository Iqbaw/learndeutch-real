import { NextResponse } from "next/server";
import { chatJSON, isAIEnabled, DeepSeekError } from "@/lib/deepseek";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ============================================================
// Dynamic, AI-powered mistake review.
//
// Given the learner's REAL past mistakes (from the Error Notebook),
// DeepSeek generates a fresh practice question for each one that
// targets the same underlying concept — a variation, not the exact
// item they already saw — plus an explanation that references their
// earlier error and a memory tip. This is what makes review
// adaptive and personal instead of a fixed template.
// ============================================================

interface IncomingError {
  id: string;
  category: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

interface ReviewItem {
  errorId: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tip: string;
}

/** Remove stray markdown emphasis so no literal markers leak into the UI. */
function clean(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.replace(/\*\*/g, "").replace(/`/g, "").trim();
}

function coerceItems(raw: unknown, errors: IncomingError[]): ReviewItem[] {
  const byId = new Map(errors.map((e) => [e.id, e]));
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object" && Array.isArray((raw as { items?: unknown }).items)
    ? (raw as { items: unknown[] }).items
    : [];

  const out: ReviewItem[] = [];
  for (const entry of list) {
    if (!entry || typeof entry !== "object") continue;
    const o = entry as Record<string, unknown>;
    const errorId = typeof o.errorId === "string" ? o.errorId : "";
    const src = byId.get(errorId);
    const options = Array.isArray(o.options)
      ? o.options.map(clean).filter((x) => x.length > 0)
      : [];
    const correctIndex = typeof o.correctIndex === "number" ? o.correctIndex : -1;
    const question = clean(o.question);
    if (
      !question ||
      options.length < 2 ||
      options.length > 4 ||
      correctIndex < 0 ||
      correctIndex >= options.length
    ) {
      continue;
    }
    out.push({
      errorId: src ? errorId : errors[out.length]?.id ?? errorId,
      category: clean(o.category) || src?.category || "Grammar",
      question,
      options,
      correctIndex,
      explanation: clean(o.explanation),
      tip: clean(o.tip),
    });
  }
  return out;
}

async function generateReview(
  errors: IncomingError[],
  profile: { name?: string; goal?: string; estimatedLevel?: string }
): Promise<ReviewItem[]> {
  if (!isAIEnabled() || errors.length === 0) return [];

  const mistakeLines = errors
    .map(
      (e, i) =>
        `${i + 1}. [${e.category}] jawaban salah pelajar: "${e.userAnswer}" — yang benar: "${e.correctAnswer}". Catatan: ${e.explanation}. (errorId: ${e.id})`
    )
    .join("\n");

  const system =
    "Kamu guru bahasa Jerman ahli yang membuat latihan koreksi yang dipersonalisasi untuk " +
    "pelajar Indonesia, mengikuti CEFR. Tujuanmu: membantu pelajar memperbaiki kesalahan " +
    "spesifik mereka agar benar-benar paham dan ingat. Instruksi & penjelasan dalam bahasa " +
    "Indonesia; materi dalam bahasa Jerman. JANGAN gunakan markdown. Balas HANYA satu objek JSON valid.";

  const user = `Pelajar (${profile.name || "Pelajar"}, level ${profile.estimatedLevel || "A1"}${
    profile.goal ? `, tujuan ${profile.goal}` : ""
  }) punya daftar kesalahan berikut:
${mistakeLines}

Untuk SETIAP kesalahan, buat SATU soal latihan BARU (variasi, bukan menyalin soal lama persis)
yang menguji KONSEP yang sama agar pelajar bisa memperbaikinya. Tiap soal:
- 3 opsi, hanya 1 benar, distraktor masuk akal (sertakan jenis kesalahan yang tadi dibuat pelajar).
- "explanation" menjelaskan kenapa benar DAN mengaitkan dengan kesalahan pelajar sebelumnya.
- "tip" = trik singkat agar mudah diingat.
- Sertakan "errorId" persis sesuai yang diberikan agar bisa dilacak.

Format JSON:
{
  "items": [
    {
      "errorId": "id-dari-daftar",
      "category": "kategori",
      "question": "soal (instruksi Indonesia + materi Jerman)",
      "options": ["a", "b", "c"],
      "correctIndex": 0,
      "explanation": "kenapa benar + kaitan dgn kesalahan sebelumnya",
      "tip": "trik mengingat singkat"
    }
  ]
}`;

  try {
    const result = await chatJSON<unknown>(
      [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      { temperature: 0.6, maxTokens: 2600, timeoutMs: 40_000 }
    );
    return coerceItems(result, errors);
  } catch (err) {
    if (!(err instanceof DeepSeekError)) console.error("review generation error", err);
    return [];
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawErrors = Array.isArray(body.errors) ? body.errors : [];
  const errors: IncomingError[] = rawErrors
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
    .map((e) => ({
      id: String(e.id ?? ""),
      category: String(e.category ?? "Grammar"),
      userAnswer: String(e.userAnswer ?? ""),
      correctAnswer: String(e.correctAnswer ?? ""),
      explanation: String(e.explanation ?? ""),
    }))
    .filter((e) => e.id && e.correctAnswer)
    .slice(0, 8);

  const profile =
    body.profile && typeof body.profile === "object"
      ? (body.profile as { name?: string; goal?: string; estimatedLevel?: string })
      : {};

  const items = await generateReview(errors, profile);
  return NextResponse.json({ items, aiEnabled: isAIEnabled() });
}

export async function GET() {
  return NextResponse.json({ aiEnabled: isAIEnabled() });
}
