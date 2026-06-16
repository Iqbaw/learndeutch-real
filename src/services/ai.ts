// ============================================================
// AI service abstractions (PRD section 17 + 18)
// For MVP these return verified dummy data, but the shape is
// ready to be swapped for a real LLM / speech backend later.
// ============================================================

import type { ErrorCategory } from "@/types";

export interface CorrectionResult {
  corrected: string;
  explanation: string;
  category: ErrorCategory;
  miniPractice: string[];
}

export interface SpeakingFeedback {
  pronunciation: number; // 0-100
  fluency: number;
  grammar: number;
  feedback: string;
  betterAnswer: string;
  transcript: string;
  matchedWords: number;
  totalWords: number;
  noSpeech?: boolean;
}

export interface PlacementResult {
  activeLevel: string;
  passiveLevel: string;
  confidence: number;
  recommendation: string;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** AI tutor — explains grammar in simple Indonesian, bounded by the learner's level. */
export const aiTutorService = {
  async explain(question: string): Promise<string> {
    await wait(500);
    return `Pertanyaan bagus! ${question} \n\nJawaban singkat: dalam bahasa Jerman, polanya konsisten. Coba lihat contoh, tirukan, lalu latih sekali lagi. Kalau masih bingung, minta aku beri contoh lain ya.`;
  },
};

/** Writing / sentence correction. Knows a few common A1 mistakes. */
export const writingCorrectionService = {
  async correct(input: string): Promise<CorrectionResult> {
    await wait(400);
    const normalized = input.trim().toLowerCase();

    if (normalized.startsWith("heute ich")) {
      return {
        corrected: input.replace(/heute ich (\w+)/i, "Heute $1 ich"),
        explanation:
          "Dalam bahasa Jerman, verb harus berada di posisi kedua. Karena kalimat diawali 'Heute', kata kerja pindah ke depan subjek.",
        category: "Word Order",
        miniPractice: [
          "Morgen ___ ich Deutsch. (lernen)",
          "Heute ___ ich Kaffee. (trinken)",
          "Am Montag ___ ich. (arbeiten)",
        ],
      };
    }

    if (normalized.includes("jahre") && !normalized.includes("alt")) {
      return {
        corrected: input.replace(/jahre/i, "Jahre alt"),
        explanation: "Untuk menyatakan umur, tambahkan 'alt': '23 Jahre alt'.",
        category: "Grammar",
        miniPractice: ["Ich bin __ Jahre alt.", "Wie alt bist du?", "Er ist 30 Jahre alt."],
      };
    }

    return {
      corrected: input,
      explanation:
        "Mantap! Polanya sudah benar. Kalau mau lebih natural, coba tambahkan keterangan waktu atau tempat.",
      category: "Grammar",
      miniPractice: ["Coba buat satu kalimat lagi dengan pola yang sama."],
    };
  },
};

/** Normalize German text for comparison: lowercase, strip punctuation, fold umlauts. */
function normalizeForCompare(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"'„“”]/g, "")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, " ")
    .trim();
}

/** Levenshtein distance between two strings (for per-word similarity). */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const prev = new Array<number>(n + 1);
  const curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}

function wordSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const dist = levenshtein(a, b);
  return 1 - dist / Math.max(a.length, b.length);
}

export interface SpeechScore {
  pronunciation: number;
  fluency: number;
  grammar: number;
  matchedWords: number;
  totalWords: number;
  feedback: string;
}

/**
 * Compare what the learner actually said (from the microphone) with the
 * expected German sentence and produce real, transcript-based scores.
 */
export function scoreSpeech(transcript: string, expected: string): SpeechScore {
  const said = normalizeForCompare(transcript);
  const target = normalizeForCompare(expected);
  const saidWords = said ? said.split(" ") : [];
  const targetWords = target ? target.split(" ") : [];
  const totalWords = targetWords.length || 1;

  // Greedy word matching: each target word matched to best remaining spoken word.
  const available = [...saidWords];
  let matchedWords = 0;
  let similaritySum = 0;
  for (const tw of targetWords) {
    let bestIdx = -1;
    let bestSim = 0;
    for (let i = 0; i < available.length; i++) {
      const sim = wordSimilarity(tw, available[i]);
      if (sim > bestSim) {
        bestSim = sim;
        bestIdx = i;
      }
    }
    similaritySum += bestSim;
    if (bestSim >= 0.7) {
      matchedWords++;
      if (bestIdx >= 0) available.splice(bestIdx, 1);
    }
  }

  const coverage = matchedWords / totalWords; // how many words got said
  const avgSim = similaritySum / totalWords; // how close the pronunciation was

  const pronunciation = Math.round(Math.min(100, avgSim * 100));
  const grammar = Math.round(Math.min(100, coverage * 100));
  // fluency rewards saying roughly the right number of words without huge extras
  const lengthRatio = saidWords.length / totalWords;
  const lengthPenalty = Math.min(1, Math.abs(1 - lengthRatio));
  const fluency = Math.round(Math.min(100, Math.max(0, (coverage * 0.7 + (1 - lengthPenalty) * 0.3) * 100)));

  let feedback: string;
  if (coverage >= 0.85 && pronunciation >= 80) {
    feedback = "Bagus sekali! Pengucapanmu jelas dan hampir semua kata terdengar tepat.";
  } else if (coverage >= 0.6) {
    const missed = targetWords.filter(
      (tw) => !saidWords.some((sw) => wordSimilarity(tw, sw) >= 0.7)
    );
    feedback = missed.length
      ? `Hampir benar! Beberapa kata belum terdengar jelas: "${missed.slice(0, 3).join(", ")}". Coba ucapkan lebih perlahan.`
      : "Hampir benar! Coba ucapkan setiap kata sedikit lebih jelas.";
  } else if (saidWords.length > 0) {
    feedback = "Belum cukup mirip. Dengarkan contohnya dulu, lalu tirukan kata per kata.";
  } else {
    feedback = "Aku belum menangkap suaramu. Pastikan mikrofon aktif lalu coba lagi.";
  }

  if (/\bik\b/.test(said) && /\bich\b/.test(target)) {
    feedback +=
      ' Tip: "ich" diucapkan lembut seperti hembusan kecil, bukan "ik" yang keras.';
  }

  return { pronunciation, fluency, grammar, matchedWords, totalWords, feedback };
}

/** Speaking feedback — specific, never just "good job" (PRD section 13.6). */
export const speakingFeedbackService = {
  /**
   * Evaluate a spoken transcript against the expected sentence.
   * Scores are derived from the real microphone transcript when available.
   */
  async evaluate(transcript: string, expected?: string): Promise<SpeakingFeedback> {
    await wait(350);
    const target = expected ?? transcript;
    const said = transcript.trim();

    if (!said) {
      return {
        pronunciation: 0,
        fluency: 0,
        grammar: 0,
        feedback: "Aku belum menangkap suaramu. Pastikan mikrofon aktif lalu coba lagi.",
        betterAnswer: target,
        transcript: "",
        matchedWords: 0,
        totalWords: target.split(/\s+/).filter(Boolean).length,
        noSpeech: true,
      };
    }

    const score = scoreSpeech(said, target);
    return {
      pronunciation: score.pronunciation,
      fluency: score.fluency,
      grammar: score.grammar,
      feedback: score.feedback,
      betterAnswer: target,
      transcript: said,
      matchedWords: score.matchedWords,
      totalWords: score.totalWords,
    };
  },
};

/** Placement test scoring — returns active vs passive level (PRD section 13.2). */
export const placementTestService = {
  async score(correctAnswers: number, total: number): Promise<PlacementResult> {
    await wait(500);
    const ratio = total > 0 ? correctAnswers / total : 0;
    const confidence = Math.round(50 + ratio * 45);
    return {
      activeLevel: ratio > 0.7 ? "A1.2" : "A1.1",
      passiveLevel: ratio > 0.7 ? "A2.1" : "A1.2",
      confidence,
      recommendation:
        ratio > 0.7
          ? "Kamu bisa mulai dari A1.1 hari ke-8, tetapi ambil remedial speaking dari hari 1–7."
          : "Mulai dari A1.1 hari 1. Fokus tambahan: speaking dan artikel der/die/das.",
    };
  },
};
