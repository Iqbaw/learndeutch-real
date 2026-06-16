import type { Lesson } from "@/types";
import { lessonsWeek2 } from "./lessons-a1-week2";
import { lessonsWeek3 } from "./lessons-a1-week3";
import { lessonsWeek4 } from "./lessons-a1-week4";

// Daily lessons — first 7 days fully fleshed out (PRD section 11.2 + 28)
export const lessonsWeek1: Lesson[] = [
  {
    day: 1,
    subLevel: "A1.1",
    title: "Bunyi Bahasa Jerman Tidak Seseram Itu",
    estimatedMinutes: 35,
    goal: [
      "Mengenal alfabet Jerman dan huruf ä, ö, ü, ß.",
      "Bisa membaca kata sederhana.",
      "Bisa mengucapkan ich, ja, nein, danke.",
    ],
    steps: [
      {
        type: "story",
        title: "Hari pertama di kelas",
        body: "Raka baru saja masuk kelas bahasa Jerman. Dia melihat banyak huruf aneh seperti ä, ö, ü, ß. Tenang — hari ini kita buktikan bunyinya tidak semenakutkan kelihatannya.",
      },
      {
        type: "pattern",
        title: "Empat huruf spesial",
        body: "Bahasa Jerman punya empat huruf tambahan. Anggap saja huruf biasa yang memakai 'topi'.",
        formula: "ä ≈ e · ö ≈ eu (bibir bulat) · ü ≈ i (bibir bulat) · ß = ss",
      },
      {
        type: "example",
        title: "Dengar dan rasakan",
        german: "danke",
        indonesian: "terima kasih",
        body: "Huruf 'a' dibaca jelas seperti 'a' pada 'apa'. Mudah, kan?",
      },
      {
        type: "drill",
        title: "Pilih bunyi yang benar",
        exercise: {
          prompt: "Huruf 'ß' dibaca seperti bunyi apa?",
          options: ["ss (seperti pada 'pas')", "z (seperti 'zebra')", "sy (seperti 'syukur')"],
          correctIndex: 0,
          explanation: "Huruf ß selalu dibaca seperti 'ss' yang tegas.",
        },
      },
      {
        type: "listening",
        title: "Dengarkan dan pilih arti",
        exercise: {
          prompt: "Audio mengucapkan: 'Danke'. Apa artinya?",
          options: ["Halo", "Terima kasih", "Maaf"],
          correctIndex: 1,
          explanation: "'Danke' berarti terima kasih.",
        },
      },
      {
        type: "speaking",
        title: "Ucapkan dengan lantang",
        prompt: "Ucapkan: 'Ich lerne Deutsch.'",
        expected: "Ich lerne Deutsch.",
        body: "Bunyi 'ich' lembut seperti hembusan kecil, bukan 'ik' yang keras.",
      },
      {
        type: "writing",
        title: "Ketik ulang",
        prompt: "Ketik kata Jerman untuk 'terima kasih'.",
        expected: "Danke",
        body: "Perhatikan huruf besar di awal — kata benda dan sapaan sering diawali huruf kapital.",
      },
      {
        type: "mistake",
        title: "Kesalahan yang umum",
        wrong: "ich (dibaca 'ik')",
        correct: "ich (dibaca lembut, 'iħ')",
        body: "Banyak pemula Indonesia mengucapkan 'ich' seperti 'ik'. Coba keluarkan udara lembut dari mulut depan.",
      },
      {
        type: "victory",
        title: "Mini Victory!",
        achievements: [
          "Kamu mengenal 4 huruf spesial Jerman.",
          "Kamu bisa membaca dan mengucapkan kata dasar.",
          "Kosakata baru: ja, nein, danke, bitte, hallo, tschüss.",
        ],
        body: "Hari ini kamu sudah bisa membaca beberapa bunyi dasar bahasa Jerman. Tidak seseram yang kamu kira, kan?",
      },
    ],
  },
  {
    day: 2,
    subLevel: "A1.1",
    title: "Salam dan Perkenalan",
    estimatedMinutes: 36,
    goal: ["Menyapa orang lain.", "Memperkenalkan diri secara singkat.", "Berpamitan dengan sopan."],
    steps: [
      { type: "story", title: "Bertemu teman baru", body: "Di kelas, Raka bertemu Anna. Mereka saling menyapa. Mari pelajari kalimat sapaan paling penting." },
      { type: "pattern", title: "Rumus kenalan", body: "Cara termudah memperkenalkan diri.", formula: "Ich heiße + nama." },
      {
        type: "example",
        title: "Contoh berwarna",
        tokens: [
          { text: "Ich", role: "subject" },
          { text: "heiße", role: "verb" },
          { text: "Anna", role: "info" },
        ],
        german: "Ich heiße Anna.",
        indonesian: "Nama saya Anna.",
      },
      {
        type: "drill",
        title: "Susun kalimat",
        exercise: {
          prompt: "Pilih urutan yang benar untuk 'Nama saya Max.'",
          options: ["Heiße ich Max.", "Ich heiße Max.", "Ich Max heiße."],
          correctIndex: 1,
          explanation: "Subjek (Ich) lalu kata kerja (heiße) di posisi kedua, baru nama.",
        },
      },
      {
        type: "speaking",
        title: "Perkenalkan dirimu",
        prompt: "Ucapkan: 'Hallo, ich heiße ...' (sebut namamu).",
        expected: "Hallo, ich heiße Max.",
      },
      {
        type: "mistake",
        title: "Salam berpamitan",
        wrong: "Hallo (saat pergi)",
        correct: "Tschüss (saat pergi)",
        body: "'Hallo' untuk menyapa, 'Tschüss' untuk berpamitan santai.",
      },
      {
        type: "victory",
        title: "Mini Victory!",
        achievements: ["Bisa menyapa dan berpamitan.", "Bisa memperkenalkan diri."],
        body: "Sekarang kamu bisa membuka percakapan seperti orang Jerman.",
      },
    ],
  },
  {
    day: 3,
    subLevel: "A1.1",
    title: "Ich bin, du bist — Kata Kerja Sein",
    estimatedMinutes: 38,
    goal: ["Memahami kata kerja sein.", "Menyatakan identitas dan perasaan."],
    steps: [
      { type: "story", title: "Siapa kamu?", body: "Anna bertanya kepada Raka, 'Bist du Student?' Untuk menjawab, Raka butuh kata kerja sein." },
      { type: "pattern", title: "Rumus sein", formula: "ich bin · du bist · er/sie/es ist", body: "Sein berubah mengikuti subjek." },
      {
        type: "example",
        title: "Contoh berwarna",
        tokens: [
          { text: "Ich", role: "subject" },
          { text: "bin", role: "verb" },
          { text: "Student", role: "info" },
        ],
        german: "Ich bin Student.",
        indonesian: "Saya seorang mahasiswa.",
      },
      {
        type: "drill",
        title: "Pilih bentuk yang benar",
        exercise: {
          prompt: "Lengkapi: 'Du ___ müde.' (Kamu lelah.)",
          options: ["bin", "bist", "ist"],
          correctIndex: 1,
          explanation: "Untuk subjek 'du', sein berbentuk 'bist'.",
        },
      },
      {
        type: "writing",
        title: "Tulis tentang dirimu",
        prompt: "Tulis 'Saya lelah.' dalam bahasa Jerman.",
        expected: "Ich bin müde.",
      },
      {
        type: "mistake",
        title: "Umur memakai 'alt'",
        wrong: "Ich bin 23 Jahre.",
        correct: "Ich bin 23 Jahre alt.",
        body: "Dalam bahasa Jerman, untuk umur biasanya ditambah 'Jahre alt'.",
      },
      { type: "victory", title: "Mini Victory!", achievements: ["Menguasai 3 bentuk utama sein.", "Bisa menyatakan identitas."], body: "Sekarang kamu bisa mengatakan siapa dirimu." },
    ],
  },
  {
    day: 4,
    subLevel: "A1.1",
    title: "Kenalan seperti Orang Jerman — Asal & Tempat Tinggal",
    estimatedMinutes: 45,
    goal: [
      "Bisa bilang asal (kommen aus).",
      "Bisa tanya asal orang lain (Woher ...?).",
      "Bisa membedakan kommen dan wohnen.",
    ],
    steps: [
      {
        type: "story",
        title: "Dari mana asalmu?",
        body: "Anna penasaran dari mana Raka berasal dan di mana dia tinggal sekarang. Dua hal ini terdengar mirip, tapi memakai kata kerja berbeda: kommen (berasal) dan wohnen (tinggal).",
      },
      {
        type: "pattern",
        title: "Dua rumus penting",
        body: "Bedakan asal dan tempat tinggal sekarang.",
        formula: "kommen aus + negara · wohnen in + kota",
      },
      {
        type: "example",
        title: "Contoh berwarna",
        tokens: [
          { text: "Ich", role: "subject" },
          { text: "komme", role: "verb" },
          { text: "aus Indonesien", role: "info" },
        ],
        german: "Ich komme aus Indonesien.",
        indonesian: "Saya berasal dari Indonesia.",
      },
      {
        type: "example",
        title: "Tempat tinggal sekarang",
        tokens: [
          { text: "Ich", role: "subject" },
          { text: "wohne", role: "verb" },
          { text: "in Jakarta", role: "info" },
        ],
        german: "Ich wohne in Jakarta.",
        indonesian: "Saya tinggal di Jakarta.",
      },
      {
        type: "drill",
        title: "Pilih kata kerja yang tepat",
        exercise: {
          prompt: "'Saya berasal dari Indonesia.' → Ich ___ aus Indonesien.",
          options: ["wohne", "komme", "heiße"],
          correctIndex: 1,
          explanation: "Untuk asal/negara gunakan 'kommen aus'.",
        },
      },
      {
        type: "drill",
        title: "Bertanya asal orang",
        exercise: {
          prompt: "Bagaimana menanyakan 'Dari mana asalmu?'",
          options: ["Woher kommst du?", "Wo wohnst du?", "Wer bist du?"],
          correctIndex: 0,
          explanation: "'Woher' = dari mana. 'Woher kommst du?' menanyakan asal.",
        },
      },
      {
        type: "listening",
        title: "Dengarkan dan pilih",
        exercise: {
          prompt: "Audio: 'Ich wohne in Berlin.' Apa yang sedang dijelaskan?",
          options: ["Asal negara", "Tempat tinggal sekarang", "Pekerjaan"],
          correctIndex: 1,
          explanation: "'wohnen in' menyatakan tempat tinggal sekarang.",
        },
      },
      {
        type: "speaking",
        title: "Ceritakan dirimu",
        prompt: "Ucapkan: 'Ich komme aus Indonesien und ich wohne in Jakarta.'",
        expected: "Ich komme aus Indonesien und ich wohne in Jakarta.",
        body: "Sambungkan dua kalimat dengan 'und' (dan).",
      },
      {
        type: "writing",
        title: "Tulis jawabanmu",
        prompt: "Tulis jawaban untuk 'Woher kommst du?' (dari Indonesia).",
        expected: "Ich komme aus Indonesien.",
      },
      {
        type: "mistake",
        title: "Verb tetap di posisi 2",
        wrong: "Heute ich wohne in Jakarta.",
        correct: "Heute wohne ich in Jakarta.",
        body: "Walaupun diawali 'Heute', kata kerja tetap di posisi kedua. Ini pola Verb Position 2.",
      },
      {
        type: "victory",
        title: "Mini Victory!",
        achievements: [
          "Bisa menyatakan asal dengan kommen aus.",
          "Bisa menyatakan tempat tinggal dengan wohnen in.",
          "Bisa bertanya 'Woher kommst du?'",
        ],
        body: "Hebat! Sekarang kamu bisa kenalan lebih dalam: nama, asal, dan tempat tinggal — persis seperti orang Jerman.",
      },
    ],
  },
  {
    day: 5,
    subLevel: "A1.1",
    title: "Angka 0–100",
    estimatedMinutes: 40,
    goal: ["Mengenal angka 0–100.", "Memahami pola angka belasan dan puluhan."],
    steps: [
      { type: "story", title: "Berapa harganya?", body: "Di toko, Raka harus paham angka untuk tahu harga. Angka Jerman punya pola unik: satuan disebut dulu baru puluhan." },
      { type: "pattern", title: "Pola angka unik", formula: "21 = einundzwanzig (satu-dan-dua puluh)", body: "Untuk 21–99, sebut satuan dulu, lalu 'und', lalu puluhan." },
      { type: "example", title: "Contoh", german: "dreiundvierzig", indonesian: "43 (tiga-dan-empat puluh)" },
      {
        type: "drill",
        title: "Pilih angka yang benar",
        exercise: { prompt: "Berapakah 'siebenundzwanzig'?", options: ["72", "27", "17"], correctIndex: 1, explanation: "sieben (7) und zwanzig (20) = 27." },
      },
      { type: "listening", title: "Dengarkan angka", exercise: { prompt: "Audio: 'zwölf'. Berapa itu?", options: ["2", "12", "20"], correctIndex: 1, explanation: "zwölf = 12." } },
      { type: "victory", title: "Mini Victory!", achievements: ["Paham pola angka Jerman.", "Bisa membaca angka sampai 100."], body: "Sekarang kamu siap memahami harga dan nomor." },
    ],
  },
  {
    day: 6,
    subLevel: "A1.1",
    title: "Umur dan Profesi",
    estimatedMinutes: 41,
    goal: ["Menyebut umur dengan benar.", "Menyebut profesi."],
    steps: [
      { type: "story", title: "Kenalan lebih lengkap", body: "Anna ingin tahu umur dan pekerjaan Raka. Mari rangkai kalimat identitas lengkap." },
      { type: "pattern", title: "Rumus umur & profesi", formula: "Ich bin + angka + Jahre alt. · Ich bin + profesi." },
      { type: "example", title: "Contoh", german: "Ich bin 23 Jahre alt. Ich bin Student.", indonesian: "Saya 23 tahun. Saya mahasiswa." },
      {
        type: "drill",
        title: "Lengkapi kalimat",
        exercise: { prompt: "'Saya 20 tahun.' → Ich bin 20 Jahre ___.", options: ["alt", "Jahr", "Zeit"], correctIndex: 0, explanation: "Untuk umur, lengkapi dengan 'alt'." },
      },
      { type: "writing", title: "Tulis profil singkat", prompt: "Tulis: 'Saya mahasiswa.'", expected: "Ich bin Student." },
      { type: "victory", title: "Mini Victory!", achievements: ["Bisa menyebut umur dan profesi."], body: "Profil perkenalanmu makin lengkap." },
    ],
  },
  {
    day: 7,
    subLevel: "A1.1",
    title: "Review Minggu 1 — Mini Test",
    estimatedMinutes: 30,
    goal: ["Mengulang materi hari 1–6.", "Mengukur pemahaman dengan mini test."],
    steps: [
      { type: "story", title: "Boss Test minggu pertama", body: "Saatnya membuktikan apa yang sudah kamu pelajari minggu ini. Santai saja, ini latihan untuk memperkuat ingatan." },
      {
        type: "drill",
        title: "Soal 1 — Perkenalan",
        exercise: { prompt: "'Nama saya Max.'", options: ["Ich heiße Max.", "Ich bin heiße Max.", "Heiße Max ich."], correctIndex: 0, explanation: "Ich + heiße + nama." },
      },
      {
        type: "drill",
        title: "Soal 2 — Sein",
        exercise: { prompt: "'Du ___ Student.'", options: ["bin", "bist", "ist"], correctIndex: 1, explanation: "du → bist." },
      },
      {
        type: "drill",
        title: "Soal 3 — Asal",
        exercise: { prompt: "'Dari mana asalmu?'", options: ["Wo wohnst du?", "Woher kommst du?", "Wer bist du?"], correctIndex: 1, explanation: "Woher kommst du? menanyakan asal." },
      },
      {
        type: "mistake",
        title: "Periksa kembali",
        wrong: "Heute ich lerne Deutsch.",
        correct: "Heute lerne ich Deutsch.",
        body: "Ingat Verb Position 2: kata kerja di kursi kedua.",
      },
      { type: "victory", title: "Minggu 1 Selesai!", achievements: ["Menyelesaikan review minggu pertama.", "Siap lanjut ke materi keluarga & benda."], body: "Konsistensimu luar biasa. Lanjutkan streak-mu!" },
    ],
  },
];

// Combine all weeks
export const lessons: Lesson[] = [
  ...lessonsWeek1,
  ...lessonsWeek2,
  ...lessonsWeek3,
  ...lessonsWeek4,
];

export function getLessonByDay(day: number): Lesson | undefined {
  return lessons.find((l) => l.day === day);
}
