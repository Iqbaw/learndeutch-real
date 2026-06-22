import type { MockTest } from "@/types";

// A1 mock test (PRD section 9.11 of prompt + 13)
export const a1MockTest: MockTest = {
  id: "mt-a1",
  level: "A1",
  title: "Simulasi Ujian A1",
  sections: [
    {
      id: "reading",
      name: "Lesen (Reading)",
      skill: "Reading",
      questions: [
        {
          prompt: "Baca: 'Anna kommt aus Deutschland und wohnt in Köln.' Dari mana Anna berasal?",
          options: ["Köln", "Deutschland", "Berlin"],
          correctIndex: 1,
          explanation: "'kommt aus' menyatakan asal: Deutschland.",
        },
        {
          prompt: "Apa arti kalimat 'Ich habe einen Bruder.'?",
          options: ["Saya punya seorang saudara laki-laki.", "Saya tidak punya saudara.", "Saya seorang kakak."],
          correctIndex: 0,
          explanation: "haben = punya, Bruder = saudara laki-laki.",
        },
      ],
    },
    {
      id: "listening",
      name: "Hören (Listening)",
      skill: "Listening",
      questions: [
        {
          prompt: "Dengarkan audio, lalu jawab: Jam berapa sekarang?",
          audioText: "Es ist acht Uhr.",
          options: ["Jam 7", "Jam 8", "Jam 18"],
          correctIndex: 1,
          explanation: "Yang terdengar: „Es ist acht Uhr.“ — acht = 8, Uhr = jam.",
        },
        {
          prompt: "Dengarkan dialog di kafe. Berapa kopi yang dipesan?",
          audioText: "Guten Tag! Ich möchte zwei Kaffee, bitte.",
          options: ["1", "2", "3"],
          correctIndex: 1,
          explanation: "Yang terdengar: „... zwei Kaffee, bitte.“ — zwei = dua.",
        },
        {
          prompt: "Dengarkan, lalu jawab: Ke mana dia pergi besok?",
          audioText: "Morgen fahre ich nach Berlin.",
          options: ["Ke München", "Ke Berlin", "Ke Köln"],
          correctIndex: 1,
          explanation: "Yang terdengar: „Morgen fahre ich nach Berlin.“ — tujuannya Berlin.",
        },
      ],
    },
    {
      id: "grammar",
      name: "Grammatik (Grammar)",
      skill: "Grammar",
      questions: [
        {
          prompt: "Lengkapi: 'Morgen ___ ich nach Hause.' (gehen)",
          options: ["gehe", "gehst", "gehen"],
          correctIndex: 0,
          explanation: "Subjek ich → gehe, dan verb tetap di posisi kedua.",
        },
        {
          prompt: "Pilih artikel: ___ Kind spielt.",
          options: ["der", "die", "das"],
          correctIndex: 2,
          explanation: "Kind netral → das Kind.",
        },
      ],
    },
    {
      id: "vocab",
      name: "Wortschatz (Vocabulary)",
      skill: "Vocabulary",
      questions: [
        {
          prompt: "Apa arti 'die Schule'?",
          options: ["rumah", "sekolah", "kantor"],
          correctIndex: 1,
          explanation: "die Schule = sekolah.",
        },
      ],
    },
    {
      id: "writing",
      name: "Schreiben (Writing)",
      skill: "Writing",
      questions: [
        {
          prompt: "Mana penulisan yang benar untuk 'Saya berasal dari Indonesia.'?",
          options: ["Ich komme aus Indonesien.", "Ich kommen aus Indonesien.", "Ich komme von Indonesien."],
          correctIndex: 0,
          explanation: "kommen aus + negara; bentuk ich → komme.",
        },
      ],
    },
    {
      id: "speaking",
      name: "Sprechen (Speaking)",
      skill: "Speaking",
      questions: [
        {
          prompt: "Pilih jawaban lisan terbaik untuk 'Wie heißt du?'",
          options: ["Ich heiße Max.", "Ich bin gut.", "Danke schön."],
          correctIndex: 0,
          explanation: "Pertanyaan menanyakan nama, jawab dengan 'Ich heiße ...'.",
        },
      ],
    },
  ],
};
