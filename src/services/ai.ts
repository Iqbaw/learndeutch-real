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

/** Speaking feedback — specific, never just "good job" (PRD section 13.6). */
export const speakingFeedbackService = {
  async evaluate(transcript: string): Promise<SpeakingFeedback> {
    await wait(700);
    const hasIch = /ich/i.test(transcript);
    return {
      pronunciation: 74,
      fluency: 61,
      grammar: 80,
      feedback: hasIch
        ? "Pengucapan 'ich' kamu masih terdengar seperti 'ik'. Coba suara 'ch' lebih lembut, seperti hembusan kecil dari mulut depan."
        : "Bagus, kalimatmu jelas. Coba bicara sedikit lebih lambat agar setiap kata terdengar penuh.",
      betterAnswer: transcript || "Ich komme aus Indonesien und wohne in Jakarta.",
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
