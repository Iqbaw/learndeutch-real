// ============================================================
// AI service abstractions (PRD section 17 + 18)
// For MVP these return verified dummy data, but the shape is
// ready to be swapped for a real LLM / speech backend later.
// ============================================================

import { normalizeAnswer } from "@/lib/assessment";
import type { ErrorCategory } from "@/types";

export interface CorrectionResult {
  corrected: string;
  explanation: string;
  category: ErrorCategory;
  miniPractice: string[];
}

export interface SpeakingFeedback {
  transcriptMatch: number;
  wordOrder: number;
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
        "Pemeriksa pola terbatas ini belum menemukan koreksi. Itu belum membuktikan kalimat benar; gunakan tugas menulis dengan kriteria atau minta tinjauan pengajar.",
      category: "Grammar",
      miniPractice: ["Coba buat satu kalimat lagi dengan pola yang sama."],
    };
  },
};

export interface SpeechScore {
  transcriptMatch: number;
  wordOrder: number;
  matchedWords: number;
  totalWords: number;
  feedback: string;
}

/** Ordered transcript alignment for imitation practice. Never acoustic scoring. */
export function scoreSpeech(transcript: string, expected: string): SpeechScore {
  const said = normalizeAnswer(transcript).split(" ").filter(Boolean);
  const target = normalizeAnswer(expected).split(" ").filter(Boolean);
  const dp = Array.from({ length: said.length + 1 }, () => Array(target.length + 1).fill(0));
  for (let i = 1; i <= said.length; i++) for (let j = 1; j <= target.length; j++) {
    dp[i][j] = said[i - 1] === target[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  }
  const matchedWords = dp[said.length][target.length];
  const score = Math.round(100 * matchedWords / Math.max(1, said.length, target.length));
  return { transcriptMatch: score, wordOrder: score, matchedWords, totalWords: target.length,
    feedback: score === 100 ? "Transkrip cocok dengan contoh. Ini menunjukkan kecocokan kata dan urutan, bukan nilai pelafalan atau kelancaran."
      : said.length ? "Transkrip belum sama dengan contoh. Bandingkan kata dan urutannya. Pengenalan suara juga bisa keliru; ungkapan lain yang sah perlu dinilai sebagai jawaban bebas."
      : "Belum ada transkrip yang tertangkap. Coba lagi atau lanjutkan melalui latihan tertulis.",
  };
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
        transcriptMatch: 0,
        wordOrder: 0,
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
      transcriptMatch: score.transcriptMatch,
      wordOrder: score.wordOrder,
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
