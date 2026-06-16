import type { Stats } from "@/types";

// CEFR skill statistics (PRD section 13.10 + 29)
export const stats: Stats = {
  estimatedLevel: "A1.2",
  confidence: 78,
  activeLevel: "A1.1",
  passiveLevel: "A2.1",
  skills: [
    { skill: "Listening", value: 64, level: "A1.2" },
    { skill: "Reading", value: 72, level: "A2.1" },
    { skill: "Speaking", value: 41, level: "A1.1" },
    { skill: "Writing", value: 48, level: "A1.1" },
    { skill: "Grammar", value: 58, level: "A1.2" },
    { skill: "Vocabulary", value: 75, level: "A2.1" },
    { skill: "Pronunciation", value: 53, level: "A1.1" },
    { skill: "Retention", value: 62, level: "A1.2" },
  ],
  vocabulary: {
    passive: 412,
    active: 176,
    weak: 58,
    forgotten: 23,
  },
  grammarMastery: [
    { topic: "Verb Position", value: 68 },
    { topic: "Konjugasi", value: 61 },
    { topic: "Artikel", value: 52 },
    { topic: "Kasus", value: 33 },
    { topic: "Tenses", value: 28 },
    { topic: "Konnektor", value: 21 },
  ],
  retention14: 62,
  realUse: 49,
  weekly: [
    { week: "Minggu 1", accuracy: 71, minutes: 240 },
    { week: "Minggu 2", accuracy: 76, minutes: 285 },
    { week: "Minggu 3", accuracy: 74, minutes: 210 },
    { week: "Minggu 4", accuracy: 82, minutes: 320 },
  ],
  aiInsight:
    "Kamu berada di A1.2 dengan confidence 78%. Vocabulary kamu sudah A2.1 secara pasif, tetapi speaking kamu masih A1.1. Artinya kamu cukup paham saat membaca, tetapi belum lancar mengeluarkan kalimat sendiri. Fokus 7 hari ke depan: tambahkan 10 menit Speaking Lab setiap hari.",
};
