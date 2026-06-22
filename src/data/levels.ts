import type { CEFRLevel, Level } from "@/types";

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


// ============================================================
// Generic per-day course metadata used by the roadmap & lessons
// for every major level. A1 keeps its detailed hand-authored
// curriculum (a1Days); A2 is fully authored below; B1–C2 are
// generated from each level's sub-level focus so the roadmap and
// AI lessons always have a sensible theme to work from.
// ============================================================

export interface CourseDay {
  day: number;
  subLevel: CEFRLevel;
  theme: string;
  skill: string;
  estimatedMinutes: number;
}

const withMinutes = (d: Omit<CourseDay, "estimatedMinutes">): CourseDay => ({
  ...d,
  estimatedMinutes: 35 + (d.day % 5) * 3,
});

// ---- A2 · 30 hari (dirancang teliti: praktis, bertahap, mudah dipahami) ----
export const a2Days: CourseDay[] = ([
  { day: 1, subLevel: "A2.1", theme: "Pemanasan & jembatan dari A1", skill: "Review aktif" },
  { day: 2, subLevel: "A2.1", theme: "Perfekt: cerita kegiatan kemarin (haben)", skill: "Perfekt dasar" },
  { day: 3, subLevel: "A2.1", theme: "Perfekt dengan sein (gehen, fahren, kommen)", skill: "Perfekt gerak" },
  { day: 4, subLevel: "A2.1", theme: "Partizip II: beraturan vs tidak beraturan", skill: "Bentuk verba" },
  { day: 5, subLevel: "A2.1", theme: "Trennbare Verben (aufstehen, einkaufen)", skill: "Separable verbs" },
  { day: 6, subLevel: "A2.1", theme: "Rutinitas & urutan waktu (zuerst, dann, danach)", skill: "Speaking" },
  { day: 7, subLevel: "A2.1", theme: "Review minggu 1", skill: "Mini test" },
  { day: 8, subLevel: "A2.1", theme: "Preposisi waktu: am, um, im", skill: "Zeitpräpositionen" },
  { day: 9, subLevel: "A2.1", theme: "Preposisi tempat (wo?): in, an, auf + Dativ", skill: "Ortspräpositionen" },
  { day: 10, subLevel: "A2.1", theme: "Dativ: artikel & kata ganti (mir, dir, ihm)", skill: "Dativ" },
  { day: 11, subLevel: "A2.1", theme: "Verba dengan Dativ (helfen, gefallen, gehören)", skill: "Dativ-Verben" },
  { day: 12, subLevel: "A2.1", theme: "Belanja: jumlah, harga, ukuran", skill: "Listening & angka" },
  { day: 13, subLevel: "A2.1", theme: "Di kota: arah & transportasi", skill: "Roleplay" },
  { day: 14, subLevel: "A2.1", theme: "Review minggu 2", skill: "Speaking test" },
  { day: 15, subLevel: "A2.1", theme: "Ujian A2.1", skill: "Reading, listening, speaking" },
  { day: 16, subLevel: "A2.2", theme: "Kata sifat: komparatif (größer als)", skill: "Komparativ" },
  { day: 17, subLevel: "A2.2", theme: "Superlatif (am größten)", skill: "Superlativ" },
  { day: 18, subLevel: "A2.2", theme: "weil — menyatakan alasan", skill: "Nebensatz" },
  { day: 19, subLevel: "A2.2", theme: "dass — menggabungkan kalimat", skill: "Nebensatz" },
  { day: 20, subLevel: "A2.2", theme: "wenn — syarat & waktu", skill: "Nebensatz" },
  { day: 21, subLevel: "A2.2", theme: "Review grammar konjungsi", skill: "Pattern drill" },
  { day: 22, subLevel: "A2.2", theme: "Modalverben sekarang (können, müssen, dürfen)", skill: "Modalverben" },
  { day: 23, subLevel: "A2.2", theme: "Modalverben lampau (wollte, konnte, musste)", skill: "Präteritum modal" },
  { day: 24, subLevel: "A2.2", theme: "Wechselpräpositionen (Akkusativ vs Dativ)", skill: "Case Compass" },
  { day: 25, subLevel: "A2.2", theme: "Kesehatan & tubuh: ke dokter", skill: "Roleplay" },
  { day: 26, subLevel: "A2.2", theme: "Liburan & cuaca: rencana dan cerita", skill: "Speaking & Perfekt" },
  { day: 27, subLevel: "A2.2", theme: "Menulis email/pesan informal", skill: "Writing" },
  { day: 28, subLevel: "A2.2", theme: "Simulasi ujian A2", skill: "Mock test" },
  { day: 29, subLevel: "A2.2", theme: "Remedial otomatis", skill: "Latihan kelemahan" },
  { day: 30, subLevel: "A2.2", theme: "Final A2 Test", skill: "Sertifikat internal" },
] as Omit<CourseDay, "estimatedMinutes">[]).map(withMinutes);

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Build a sensible 30-day plan for levels without a hand-authored curriculum. */
function genericDays(level: Level): CourseDay[] {
  const [s1, s2] = level.subLevels;
  const split = (focus: string) =>
    focus
      .replace(/\.$/, "")
      .split(/[,&]/)
      .map((t) => t.trim())
      .filter(Boolean);
  const topics1 = split(s1.focus);
  const topics2 = split(s2.focus);

  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const sub = day <= 15 ? s1 : s2;
    const topics = day <= 15 ? topics1 : topics2;
    let theme: string;
    let skill: string;
    if (day === 7 || day === 14 || day === 21) {
      theme = "Review & konsolidasi";
      skill = "Mini test";
    } else if (day === 15) {
      theme = `Ujian ${s1.id}`;
      skill = "Reading, listening, speaking";
    } else if (day === 28) {
      theme = `Simulasi ujian ${level.id}`;
      skill = "Mock test";
    } else if (day === 29) {
      theme = "Remedial otomatis";
      skill = "Latihan kelemahan";
    } else if (day === 30) {
      theme = `Final ${level.id} Test`;
      skill = "Sertifikat internal";
    } else {
      const topic = topics.length ? topics[(day - 1) % topics.length] : level.focus;
      theme = capitalize(topic);
      skill = sub.label;
    }
    return withMinutes({ day, subLevel: sub.id, theme, skill });
  });
}

const genericCache: Partial<Record<string, CourseDay[]>> = {};

/** Day-by-day plan for any major level (A1, A2 authored; others generated). */
export function daysForLevel(level: string): CourseDay[] {
  if (level === "A1") return a1Days as CourseDay[];
  if (level === "A2") return a2Days;
  if (genericCache[level]) return genericCache[level]!;
  const lvl = levels.find((l) => l.id === level);
  const days = lvl ? genericDays(lvl) : (a1Days as CourseDay[]);
  genericCache[level] = days;
  return days;
}
