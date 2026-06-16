import type { Level } from "@/types";

// Full CEFR level system — every level is a 30-day sprint (PRD section 8)
export const levels: Level[] = [
  {
    id: "A1",
    title: "Dasar hidup sehari-hari",
    durationDays: 30,
    focus: "Memperkenalkan diri, kalimat dasar, der/die/das, situasi harian.",
    outcome:
      "Bisa memperkenalkan diri, menanyakan asal/umur/pekerjaan, membeli makanan, dan berbicara pendek dalam situasi harian.",
    accent: "primary",
    subLevels: [
      { id: "A1.1", label: "A1.1", dayRange: [1, 15], focus: "Bunyi, perkenalan, sein & haben." },
      { id: "A1.2", label: "A1.2", dayRange: [16, 30], focus: "Aktivitas harian, modal möchte, negasi, W-Fragen." },
    ],
  },
  {
    id: "A2",
    title: "Percakapan sederhana & rutinitas",
    durationDays: 30,
    focus: "Perfekt, dativ dasar, separable verbs, bercerita pengalaman.",
    outcome:
      "Bisa bercerita kegiatan kemarin, menjelaskan rencana, dan menulis email pendek.",
    accent: "secondary",
    subLevels: [
      { id: "A2.1", label: "A2.1", dayRange: [1, 15], focus: "Perfekt dasar, preposisi umum." },
      { id: "A2.2", label: "A2.2", dayRange: [16, 30], focus: "Dativ, comparative, weil." },
    ],
  },
  {
    id: "B1",
    title: "Mandiri dalam situasi umum",
    durationDays: 30,
    focus: "Nebensatz, opini, argumen sederhana, persiapan ujian B1.",
    outcome:
      "Bisa berbicara tentang pekerjaan, pendidikan, rencana, masalah, dan opini.",
    accent: "primary",
    subLevels: [
      { id: "B1.1", label: "B1.1", dayRange: [1, 15], focus: "weil, dass, wenn, Perfekt & Präteritum." },
      { id: "B1.2", label: "B1.2", dayRange: [16, 30], focus: "Relativsatz, Passiv dasar, Meinung." },
    ],
  },
  {
    id: "B2",
    title: "Diskusi kompleks, kerja & studi",
    durationDays: 30,
    focus: "Konjunktiv II, Nominalisierung, argumentasi panjang, esai formal.",
    outcome:
      "Bisa berdiskusi, membuat argumen, memahami teks opini, dan menulis esai formal.",
    accent: "secondary",
    subLevels: [
      { id: "B2.1", label: "B2.1", dayRange: [1, 15], focus: "Konnektor kompleks, Passiv lanjutan." },
      { id: "B2.2", label: "B2.2", dayRange: [16, 30], focus: "Konjunktiv II, struktur esai, presentasi." },
    ],
  },
  {
    id: "C1",
    title: "Akademik & profesional",
    durationDays: 30,
    focus: "Stilistik, register, Indirekte Rede, critical reading.",
    outcome:
      "Bisa memakai bahasa Jerman untuk studi, kerja profesional, dan diskusi serius.",
    accent: "primary",
    subLevels: [
      { id: "C1.1", label: "C1.1", dayRange: [1, 15], focus: "Register, advanced connectors." },
      { id: "C1.2", label: "C1.2", dayRange: [16, 30], focus: "Konjunktiv I, Redewendungen, academic vocab." },
    ],
  },
  {
    id: "C2",
    title: "Mendekati native, presisi & gaya bahasa",
    durationDays: 30,
    focus: "Idiom, nuansa makna, ironi, advanced writing, cultural fluency.",
    outcome:
      "Mampu memahami hampir semua input, berbicara sangat lancar, dan menulis sangat presisi.",
    accent: "secondary",
    subLevels: [
      { id: "C2.1", label: "C2.1", dayRange: [1, 15], focus: "Idiom, subtle tone, implikatur." },
      { id: "C2.2", label: "C2.2", dayRange: [16, 30], focus: "Advanced style, debat tinggi, error polishing." },
    ],
  },
];

// Method pillars — German King Method (PRD section 12)
export const methodPillars = [
  {
    title: "Sentence Lego",
    description: "Susun kalimat Jerman seperti Lego: blok subjek, verb, objek, dan waktu yang bisa diganti-ganti.",
    icon: "blocks",
  },
  {
    title: "Verb Position Radar",
    description: "Radar yang memastikan kata kerja selalu duduk di kursi nomor 2 dalam kalimat normal.",
    icon: "radar",
  },
  {
    title: "Der Die Das Memory System",
    description: "Artikel diberi warna: der biru, die ungu, das hijau. Bukan hafalan brutal, tapi pola visual.",
    icon: "palette",
  },
  {
    title: "Case Compass",
    description: "Kompas kasus: Nominatif (pelaku), Akkusativ (kena apa), Dativ (untuk/kepada siapa).",
    icon: "compass",
  },
  {
    title: "Redemittel Bank",
    description: "Bank frasa siap pakai supaya kamu tidak perlu membuat semua kalimat dari nol.",
    icon: "landmark",
  },
  {
    title: "Error Notebook",
    description: "Setiap kesalahan tersimpan otomatis dan muncul lagi sebagai latihan sampai kamu kuasai.",
    icon: "notebook-pen",
  },
];

// A1 30-day curriculum structure (PRD section 9). This is course CONTENT only —
// per-user day statuses are derived from real progress (see lib/derive.ts).
export interface A1Day {
  day: number;
  subLevel: "A1.1" | "A1.2";
  theme: string;
  skill: string;
  estimatedMinutes: number;
}

export const a1Days: A1Day[] = [
  { day: 1, subLevel: "A1.1", theme: "Cara baca huruf Jerman", skill: "Pronunciation dasar" },
  { day: 2, subLevel: "A1.1", theme: "Salam dan perkenalan", skill: "Speaking" },
  { day: 3, subLevel: "A1.1", theme: "Ich bin, du bist", skill: "Sein" },
  { day: 4, subLevel: "A1.1", theme: "Nama, asal, tempat tinggal", skill: "heißen, kommen, wohnen" },
  { day: 5, subLevel: "A1.1", theme: "Angka 0–100", skill: "Listening" },
  { day: 6, subLevel: "A1.1", theme: "Umur dan profesi", skill: "Kalimat identitas" },
  { day: 7, subLevel: "A1.1", theme: "Review minggu 1", skill: "Mini test" },
  { day: 8, subLevel: "A1.1", theme: "Keluarga", skill: "Possessive dasar" },
  { day: 9, subLevel: "A1.1", theme: "Benda sekitar", skill: "Artikel der/die/das" },
  { day: 10, subLevel: "A1.1", theme: "Punya sesuatu", skill: "Haben" },
  { day: 11, subLevel: "A1.1", theme: "Kata sifat mudah", skill: "Adjektiva dasar" },
  { day: 12, subLevel: "A1.1", theme: "Makanan dan minuman", skill: "Ordering" },
  { day: 13, subLevel: "A1.1", theme: "Waktu dan hari", skill: "Time expression" },
  { day: 14, subLevel: "A1.1", theme: "Review minggu 2", skill: "Speaking test" },
  { day: 15, subLevel: "A1.1", theme: "Ujian A1.1", skill: "Reading, listening, speaking" },
  { day: 16, subLevel: "A1.2", theme: "Aktivitas harian", skill: "Verb regular" },
  { day: 17, subLevel: "A1.2", theme: "Pergi ke tempat", skill: "gehen" },
  { day: 18, subLevel: "A1.2", theme: "Belanja sederhana", skill: "Harga dan benda" },
  { day: 19, subLevel: "A1.2", theme: "Modal möchte", skill: "Keinginan" },
  { day: 20, subLevel: "A1.2", theme: "Kalimat negatif", skill: "nicht, kein" },
  { day: 21, subLevel: "A1.2", theme: "Review grammar", skill: "Pattern drill" },
  { day: 22, subLevel: "A1.2", theme: "Pertanyaan dasar", skill: "W-Fragen" },
  { day: 23, subLevel: "A1.2", theme: "Arah dan lokasi", skill: "in, an, auf dasar" },
  { day: 24, subLevel: "A1.2", theme: "Janji dan jadwal", skill: "Uhrzeit" },
  { day: 25, subLevel: "A1.2", theme: "Di restoran", skill: "Roleplay" },
  { day: 26, subLevel: "A1.2", theme: "Di stasiun", skill: "Listening" },
  { day: 27, subLevel: "A1.2", theme: "Menulis pesan pendek", skill: "Writing" },
  { day: 28, subLevel: "A1.2", theme: "Simulasi A1", skill: "Mock test" },
  { day: 29, subLevel: "A1.2", theme: "Remedial otomatis", skill: "Latihan kelemahan" },
  { day: 30, subLevel: "A1.2", theme: "Final A1 Test", skill: "Sertifikat internal" },
].map((d) => ({ ...d, estimatedMinutes: 35 + (d.day % 5) * 3 } as A1Day));
