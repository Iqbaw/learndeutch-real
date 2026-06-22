import type { MockTest } from "@/types";

// A1 mock test — exam style: more questions, no teaching material, and feedback
// is revealed only at the end (handled by the mock-test page).
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
        {
          prompt: "Baca: 'Der Zug fährt um neun Uhr.' Kapan keretanya berangkat?",
          options: ["Jam 9", "Jam 5", "Jam 19"],
          correctIndex: 0,
          explanation: "neun = 9, Uhr = jam → jam 9.",
        },
        {
          prompt: "Baca: 'Maria isst gern Äpfel.' Apa yang Maria suka?",
          options: ["Roti", "Apel", "Susu"],
          correctIndex: 1,
          explanation: "Äpfel = apel (jamak dari Apfel); essen gern = suka makan.",
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
        {
          prompt: "Dengarkan. Apa yang dibeli orang itu?",
          audioText: "Ich kaufe Brot und Milch.",
          options: ["Roti dan susu", "Roti dan telur", "Susu dan keju"],
          correctIndex: 0,
          explanation: "Yang terdengar: „Brot und Milch“ — roti dan susu.",
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
        {
          prompt: "Lengkapi: 'Wir ___ aus Indonesien.' (sein)",
          options: ["sind", "seid", "bin"],
          correctIndex: 0,
          explanation: "Subjek wir → sind.",
        },
        {
          prompt: "Lengkapi (Akkusativ): 'Ich kaufe ___ Apfel.' (der Apfel)",
          options: ["den", "der", "dem"],
          correctIndex: 0,
          explanation: "Objek maskulin di Akkusativ: der → den.",
        },
        {
          prompt: "Negasi: 'Ich habe ___ Auto.'",
          options: ["kein", "nicht", "keine"],
          correctIndex: 0,
          explanation: "Auto netral, menolak kata benda → kein.",
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
        {
          prompt: "Apa arti 'der Freund'?",
          options: ["teman", "guru", "tetangga"],
          correctIndex: 0,
          explanation: "der Freund = teman (laki-laki).",
        },
        {
          prompt: "Lawan kata 'groß' adalah ...",
          options: ["klein", "alt", "neu"],
          correctIndex: 0,
          explanation: "groß = besar; lawannya klein = kecil.",
        },
        {
          prompt: "Apa arti 'trinken'?",
          options: ["makan", "minum", "tidur"],
          correctIndex: 1,
          explanation: "trinken = minum.",
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
        {
          prompt: "Mana kalimat yang benar?",
          options: ["Sie heißt Anna.", "Sie heißen Anna.", "Sie heiße Anna."],
          correctIndex: 0,
          explanation: "Subjek sie (dia, pr) → heißt.",
        },
        {
          prompt: "Mana penulisan yang benar untuk 'Saya berumur 20 tahun.'?",
          options: ["Ich bin 20 Jahre alt.", "Ich habe 20 Jahre.", "Ich bin 20 Jahre."],
          correctIndex: 0,
          explanation: "Umur: 'Ich bin ... Jahre alt.'",
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
        {
          prompt: "Respons paling tepat untuk 'Wie geht es dir?'",
          options: ["Mir geht es gut, danke.", "Ich heiße Tom.", "Ich komme aus Berlin."],
          correctIndex: 0,
          explanation: "Menanyakan kabar → 'Mir geht es gut, danke.'",
        },
        {
          prompt: "Cara sopan memesan: 'Saya mau satu teh.'",
          options: ["Ich möchte einen Tee, bitte.", "Ich will Tee jetzt.", "Gib mir Tee."],
          correctIndex: 0,
          explanation: "'Ich möchte ..., bitte' adalah bentuk sopan.",
        },
      ],
    },
  ],
};
