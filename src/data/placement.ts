import type { CEFRLevel } from "@/types";

// ============================================================
// Placement test — 8 questions of increasing difficulty
// (A1.1 → A1.2 → A2 → B1) to accurately estimate the user's level.
// ============================================================

export interface PlacementQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  level: "A1.1" | "A1.2" | "A2" | "B1";
  hint: string;
}

export const placementQuestions: PlacementQuestion[] = [
  // --- A1.1 (paling dasar) ---
  {
    id: "p1",
    prompt: "Lengkapi: „Ich ___ Max.“ (Nama saya Max)",
    options: ["bin", "heiße", "habe"],
    correctIndex: 1,
    level: "A1.1",
    hint: "Untuk menyebut nama, gunakan 'heißen'.",
  },
  {
    id: "p2",
    prompt: "Bagaimana cara bertanya „Dari mana asalmu?“",
    options: ["Wie alt bist du?", "Woher kommst du?", "Was machst du?"],
    correctIndex: 1,
    level: "A1.1",
    hint: "Woher = dari mana.",
  },
  // --- A1.2 ---
  {
    id: "p3",
    prompt: "Pilih artikel yang benar: „___ Buch“ (buku)",
    options: ["der", "die", "das"],
    correctIndex: 2,
    level: "A1.2",
    hint: "Buch bersifat netral.",
  },
  {
    id: "p4",
    prompt: "Lengkapi: „Ich möchte Deutsch ___.“",
    options: ["lerne", "lernst", "lernen"],
    correctIndex: 2,
    level: "A1.2",
    hint: "Setelah modal möchte, verb kedua dalam bentuk infinitiv di akhir.",
  },
  // --- A2 ---
  {
    id: "p5",
    prompt: "Bentuk lampau (Perfekt): „Gestern ___ ich ins Kino gegangen.“",
    options: ["bin", "habe", "war"],
    correctIndex: 0,
    level: "A2",
    hint: "Verb gerak (gehen) memakai 'sein' di Perfekt.",
  },
  {
    id: "p6",
    prompt: "Lengkapi: „Ich fahre ___ dem Bus zur Arbeit.“",
    options: ["mit", "für", "ohne"],
    correctIndex: 0,
    level: "A2",
    hint: "Untuk alat transportasi pakai 'mit' (+ Dativ).",
  },
  // --- B1 ---
  {
    id: "p7",
    prompt: "Gabungkan dengan alasan: „Ich bleibe zu Hause, ___ ich krank bin.“",
    options: ["und", "weil", "oder"],
    correctIndex: 1,
    level: "B1",
    hint: "weil = karena (memberi alasan).",
  },
  {
    id: "p8",
    prompt: "Konjunktiv II: „Wenn ich Zeit ___, würde ich reisen.“",
    options: ["habe", "hätte", "hatte"],
    correctIndex: 1,
    level: "B1",
    hint: "Pengandaian memakai 'hätte'.",
  },
];

export interface PlacementOutcome {
  estimatedLevel: CEFRLevel;
  startLevel: CEFRLevel; // stored as profile.startLevel
  recommendedDay: number; // 1 (fondasi) atau 16 (A1.2)
  canSkip: boolean; // boleh lompat ke A1.2
  scorePct: number;
  correctCount: number;
  summary: string;
}

/**
 * Accurate placement: weighs performance per CEFR band + self-reported level.
 * Someone who clearly knows A1 basics is estimated higher and offered a skip.
 */
export function evaluatePlacement(correct: boolean[], selfLevel?: string): PlacementOutcome {
  const a11 = (correct[0] ? 1 : 0) + (correct[1] ? 1 : 0);
  const a12 = (correct[2] ? 1 : 0) + (correct[3] ? 1 : 0);
  const a2 = (correct[4] ? 1 : 0) + (correct[5] ? 1 : 0);
  const b1 = (correct[6] ? 1 : 0) + (correct[7] ? 1 : 0);
  const correctCount = correct.filter(Boolean).length;
  const scorePct = Math.round((correctCount / placementQuestions.length) * 100);

  // Self-reported "nol total" always starts from the foundation.
  if (selfLevel === "Nol total") {
    return {
      estimatedLevel: "A1.1",
      startLevel: "A1.1",
      recommendedDay: 1,
      canSkip: false,
      scorePct,
      correctCount,
      summary: "Kamu mulai dari nol — kita bangun fondasi yang kuat mulai Hari 1.",
    };
  }

  // Clearly above basic A1: strong on A2/B1 items.
  if (a2 >= 1 && b1 >= 1 && correctCount >= 6) {
    return {
      estimatedLevel: "A2.1",
      startLevel: "A1.2",
      recommendedDay: 16,
      canSkip: true,
      scorePct,
      correctCount,
      summary:
        "Kemampuanmu sudah di atas A1 dasar. Materi A2 sedang disiapkan — sementara itu kita perkuat A1.2 agar fondasimu benar-benar solid.",
    };
  }

  // Mastered A1.1 basics, ready for A1.2.
  if (a11 >= 2 && a12 >= 1 && correctCount >= 4) {
    return {
      estimatedLevel: "A1.2",
      startLevel: "A1.2",
      recommendedDay: 16,
      canSkip: true,
      scorePct,
      correctCount,
      summary:
        "Kamu sudah menguasai dasar A1.1. Kamu bisa langsung lompat ke A1.2, atau mengulang fondasi dari Hari 1.",
    };
  }

  // Default — build from the start.
  return {
    estimatedLevel: "A1.1",
    startLevel: "A1.1",
    recommendedDay: 1,
    canSkip: false,
    scorePct,
    correctCount,
    summary:
      "Kita mulai dari A1.1 untuk membangun fondasi yang kokoh. Setiap hari kamu akan terasa makin percaya diri.",
  };
}
