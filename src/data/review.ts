import type { ReviewCard } from "@/types";

// Spaced repetition review queue (PRD section 7.4 + 13.3)
export const reviewQueue: ReviewCard[] = [
  {
    id: "rv1",
    type: "meaning",
    question: "Apa arti 'der Bahnhof'?",
    options: ["bandara", "stasiun kereta", "halte bus", "pelabuhan"],
    correctIndex: 1,
    explanation: "der Bahnhof = stasiun kereta. Bahn (kereta) + Hof (area).",
    due: "Hari ini",
  },
  {
    id: "rv2",
    type: "article",
    question: "Pilih artikel yang benar: ___ Tisch (meja)",
    options: ["der", "die", "das"],
    correctIndex: 0,
    explanation: "Tisch maskulin → der Tisch (biru).",
    due: "Hari ini",
  },
  {
    id: "rv3",
    type: "type-meaning",
    question: "Ketik bahasa Jerman untuk 'Saya belajar bahasa Jerman.'",
    answer: "Ich lerne Deutsch.",
    explanation: "Ich + lerne (posisi 2) + Deutsch.",
    due: "Hari ini",
  },
  {
    id: "rv4",
    type: "fix",
    question: "Perbaiki: 'Heute ich lerne Deutsch.'",
    answer: "Heute lerne ich Deutsch.",
    explanation: "Verb harus di posisi kedua.",
    due: "Hari ini",
  },
  {
    id: "rv5",
    type: "article",
    question: "Pilih artikel yang benar: ___ Frau (wanita)",
    options: ["der", "die", "das"],
    correctIndex: 1,
    explanation: "Frau feminin → die Frau (ungu).",
    due: "Hari ini",
  },
  {
    id: "rv6",
    type: "meaning",
    question: "Apa arti 'müde'?",
    options: ["lapar", "lelah", "senang", "marah"],
    correctIndex: 1,
    explanation: "müde = lelah.",
    due: "Hari ini",
  },
  {
    id: "rv7",
    type: "build",
    question: "Susun: aus / Ich / Indonesien / komme",
    answer: "Ich komme aus Indonesien.",
    explanation: "Subjek + verb + keterangan asal.",
    due: "Besok",
  },
  {
    id: "rv8",
    type: "type-meaning",
    question: "Ketik bahasa Jerman untuk 'Saya tinggal di Jakarta.'",
    answer: "Ich wohne in Jakarta.",
    explanation: "wohnen in untuk tempat tinggal.",
    due: "Besok",
  },
];

export const reviewSummary = {
  dueToday: 27,
  vocabularyDue: 18,
  grammarDue: 6,
  mistakeDue: 3,
  retention: 62,
};
