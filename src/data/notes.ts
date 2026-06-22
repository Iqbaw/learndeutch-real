import type { MajorLevel } from "@/types";

// ============================================================
// Cornell-style study notes per major level.
//
// Layout intent (rendered in /notes):
//   - left  "cue" column  → keyword / recall question
//   - right "notes" column → the actual explanation (bullets)
//   - bottom "summary" bar → the big-picture recap
// Plus a "tips & trik" block. Colors make each topic easy to scan,
// like a well-organized student notebook.
//
// Notes support **bold** inline (rendered via FormattedText).
// ============================================================

export type NoteColor = "primary" | "secondary" | "success" | "warning" | "danger";

export interface CornellSection {
  id: string;
  color: NoteColor;
  cue: string; // left column: keyword / recall question
  notes: string[]; // right column: explanation bullets (supports **bold**)
  example?: { de: string; id: string };
}

export interface LevelNotes {
  level: MajorLevel;
  title: string;
  subtitle: string;
  sections: CornellSection[];
  tips: string[];
  summary: string;
}

const a1Notes: LevelNotes = {
  level: "A1",
  title: "Catatan Lengkap A1",
  subtitle: "Fondasi: perkenalan, sein & haben, artikel, present tense, negasi, dan W-Fragen.",
  sections: [
    {
      id: "greet",
      color: "primary",
      cue: "Menyapa & memperkenalkan diri",
      notes: [
        "Sapaan: **Hallo** (santai), **Guten Morgen/Tag/Abend** (sopan).",
        "Nama: **Ich heiße ...** atau **Ich bin ...**",
        "Asal: **Ich komme aus ...** (negara/kota).",
        "Tinggal: **Ich wohne in ...**",
      ],
      example: { de: "Hallo! Ich heiße Budi. Ich komme aus Indonesien.", id: "Halo! Nama saya Budi. Saya dari Indonesia." },
    },
    {
      id: "sein",
      color: "secondary",
      cue: "Verb sein (adalah/ada)",
      notes: [
        "**ich bin**, **du bist**, **er/sie/es ist**",
        "**wir sind**, **ihr seid**, **sie/Sie sind**",
        "Dipakai untuk identitas, sifat, dan keadaan.",
      ],
      example: { de: "Ich bin müde. Sie ist Lehrerin.", id: "Saya lelah. Dia (pr) seorang guru." },
    },
    {
      id: "haben",
      color: "success",
      cue: "Verb haben (punya)",
      notes: [
        "**ich habe**, **du hast**, **er/sie/es hat**",
        "**wir haben**, **ihr habt**, **sie/Sie haben**",
        "Untuk kepemilikan dan umur: **Ich habe 20 Jahre**? ❌ → pakai **Ich bin 20 Jahre alt**. ✅",
      ],
      example: { de: "Ich habe einen Bruder.", id: "Saya punya satu saudara laki-laki." },
    },
    {
      id: "artikel",
      color: "warning",
      cue: "Artikel: der / die / das",
      notes: [
        "**der** = maskulin (warna biru), **die** = feminin (ungu), **das** = netral (hijau).",
        "Jamak selalu **die**.",
        "Trik: **selalu hafalkan kata benda bersama artikelnya** (bukan 'Tisch' tapi 'der Tisch').",
      ],
      example: { de: "der Mann, die Frau, das Kind", id: "pria itu, wanita itu, anak itu" },
    },
    {
      id: "verb",
      color: "primary",
      cue: "Konjugasi verb (present)",
      notes: [
        "Akhiran: ich **-e**, du **-st**, er/sie/es **-t**, wir **-en**, ihr **-t**, sie **-en**.",
        "**Verb selalu di posisi ke-2** dalam kalimat berita.",
      ],
      example: { de: "Ich lerne Deutsch. Heute lerne ich Deutsch.", id: "Saya belajar bahasa Jerman. Hari ini saya belajar bahasa Jerman." },
    },
    {
      id: "negasi",
      color: "danger",
      cue: "Negasi: nicht vs kein",
      notes: [
        "**nicht** menyangkal verba/sifat/keterangan.",
        "**kein-** menyangkal kata benda (dengan artikel tak tentu/tanpa artikel).",
      ],
      example: { de: "Ich bin nicht müde. Ich habe kein Auto.", id: "Saya tidak lelah. Saya tidak punya mobil." },
    },
    {
      id: "wfragen",
      color: "secondary",
      cue: "W-Fragen (kata tanya)",
      notes: [
        "**Wer** (siapa), **Was** (apa), **Wo** (di mana), **Woher** (dari mana), **Wohin** (ke mana).",
        "**Wann** (kapan), **Wie** (bagaimana), **Warum** (kenapa).",
        "Di pertanyaan-W, verba tetap di posisi ke-2.",
      ],
      example: { de: "Woher kommst du? Wie heißt du?", id: "Dari mana asalmu? Siapa namamu?" },
    },
  ],
  tips: [
    "Warnai artikel: der = biru, die = ungu, das = hijau. Otak lebih cepat ingat lewat warna.",
    "Verba = kursi nomor 2. Kalau ada keterangan di depan, subjek pindah ke belakang verba.",
    "Hafalkan kata benda + artikel + bentuk jamak sekaligus sejak hari pertama.",
    "Latih angka 1–100 dengan menyebut nomor HP & harga belanja.",
  ],
  summary:
    "A1 = bisa memperkenalkan diri dan bertahan di situasi harian. Kuasai sein & haben, artikel der/die/das, konjugasi present (verb di posisi 2), negasi nicht/kein, dan W-Fragen — itu 80% pondasinya.",
};

const a2Notes: LevelNotes = {
  level: "A2",
  title: "Catatan Lengkap A2",
  subtitle: "Bercerita masa lampau (Perfekt), Dativ, separable verbs, konjungsi, dan modal verbs.",
  sections: [
    {
      id: "perfekt",
      color: "primary",
      cue: "Perfekt — cerita masa lampau",
      notes: [
        "Rumus: **haben/sein + Partizip II** (verba ke-2 di akhir).",
        "Mayoritas verba pakai **haben**.",
        "Verba **gerak/perubahan keadaan** pakai **sein** (gehen, fahren, kommen, aufstehen).",
      ],
      example: { de: "Ich habe gegessen. Ich bin nach Berlin gefahren.", id: "Saya sudah makan. Saya pergi ke Berlin." },
    },
    {
      id: "partizip",
      color: "secondary",
      cue: "Bentuk Partizip II",
      notes: [
        "Beraturan: **ge- + stamm + -t** → machen → **gemacht**.",
        "Tak beraturan: **ge- + ... + -en** → essen → **gegessen**.",
        "Verba -ieren tanpa ge-: studieren → **studiert**.",
        "Trennbar: aufstehen → **aufgestanden** (ge- di tengah).",
      ],
    },
    {
      id: "trennbar",
      color: "success",
      cue: "Trennbare Verben (verb terpisah)",
      notes: [
        "Prefix berpisah dan **lompat ke akhir kalimat** di present.",
        "Contoh prefix: auf-, ein-, an-, mit-, zu-.",
      ],
      example: { de: "Ich stehe um 7 Uhr auf.", id: "Saya bangun jam 7." },
    },
    {
      id: "dativ",
      color: "warning",
      cue: "Kasus Dativ (kepada/untuk)",
      notes: [
        "Artikel Dativ: **dem / der / dem / den (+n di jamak)**.",
        "Kata ganti: **mir, dir, ihm, ihr, uns, euch, ihnen**.",
        "Verba wajib Dativ: **helfen, danken, gefallen, gehören**.",
      ],
      example: { de: "Ich helfe meinem Freund. Das gefällt mir.", id: "Saya membantu teman saya. Itu saya suka." },
    },
    {
      id: "wechsel",
      color: "danger",
      cue: "Wechselpräpositionen (Akk vs Dativ)",
      notes: [
        "Preposisi: in, an, auf, über, unter, vor, hinter, neben, zwischen.",
        "**Wohin? (ada gerak)** → Akkusativ. **Wo? (diam)** → Dativ.",
      ],
      example: { de: "Ich gehe in die Schule (Akk). Ich bin in der Schule (Dativ).", id: "Saya pergi ke sekolah. Saya berada di sekolah." },
    },
    {
      id: "konjunktion",
      color: "primary",
      cue: "Konjungsi: weil / dass / wenn",
      notes: [
        "Ketiganya membuat anak kalimat → **verba pindah ke paling akhir**.",
        "**weil** = karena, **dass** = bahwa, **wenn** = jika/ketika.",
      ],
      example: { de: "Ich bleibe zu Hause, weil ich krank bin.", id: "Saya di rumah karena saya sakit." },
    },
    {
      id: "vergleich",
      color: "secondary",
      cue: "Komparatif & Superlatif",
      notes: [
        "Komparatif: **adjektiv + -er + als** → größer als.",
        "Superlatif: **am + adjektiv + -sten** → am größten.",
        "Tak beraturan: gut → **besser** → **am besten**; viel → mehr → am meisten.",
      ],
      example: { de: "Anna ist größer als Tom. Sie ist am größten.", id: "Anna lebih tinggi dari Tom. Dia paling tinggi." },
    },
    {
      id: "modal",
      color: "success",
      cue: "Modalverben",
      notes: [
        "**können** (bisa), **müssen** (harus), **dürfen** (boleh), **wollen/möchten** (ingin), **sollen** (sebaiknya).",
        "Modal di posisi 2, **verba utama infinitiv di akhir**.",
        "Lampau (Präteritum): **konnte, wollte, musste, durfte**.",
      ],
      example: { de: "Ich kann gut schwimmen. Ich musste arbeiten.", id: "Saya bisa berenang dengan baik. Saya harus bekerja." },
    },
  ],
  tips: [
    "Aturan emas Perfekt: pakai haben, KECUALI verba gerak/perubahan → sein.",
    "Begitu dengar weil/dass/wenn, langsung siapkan verba untuk ditaruh di akhir.",
    "Untuk Wechselpräposition, tanyakan dulu: ada gerakan (wohin → Akk) atau diam (wo → Dativ)?",
    "Bikin mini-diary harian dalam Perfekt 3 kalimat/hari — paling cepat melekat.",
  ],
  summary:
    "A2 = bisa bercerita pengalaman & menjelaskan rencana. Kuncinya: Perfekt (haben/sein + Partizip II), Dativ & Wechselpräpositionen, separable verbs, konjungsi weil/dass/wenn (verba ke akhir), perbandingan, dan modal verbs.",
};

const b1Notes: LevelNotes = {
  level: "B1",
  title: "Catatan Inti B1",
  subtitle: "Mandiri dalam situasi umum: opini, alasan kompleks, dan cerita yang lebih kaya.",
  sections: [
    {
      id: "konnektoren",
      color: "primary",
      cue: "Konektor lanjutan",
      notes: [
        "**obwohl** (meskipun), **trotzdem** (meski begitu), **deshalb/deswegen** (karena itu).",
        "**obwohl** → verba ke akhir; **trotzdem/deshalb** → verba tetap posisi 2.",
      ],
      example: { de: "Obwohl es regnet, gehe ich raus.", id: "Meskipun hujan, saya tetap keluar." },
    },
    {
      id: "praeteritum",
      color: "secondary",
      cue: "Präteritum (lampau tertulis)",
      notes: [
        "Dipakai untuk cerita/teks tertulis.",
        "Beraturan: stamm + **-te** (machte). Tak beraturan: berubah vokal (ging, kam, war, hatte).",
      ],
      example: { de: "Als Kind spielte ich oft draußen.", id: "Waktu kecil saya sering bermain di luar." },
    },
    {
      id: "relativsatz",
      color: "success",
      cue: "Relativsatz (kalimat penjelas)",
      notes: [
        "Pronomina relatif mengikuti gender & kasus: **der/die/das/den/dem/dessen ...**",
        "Verba anak kalimat ke akhir.",
      ],
      example: { de: "Das ist der Mann, der mir geholfen hat.", id: "Itu pria yang sudah menolong saya." },
    },
    {
      id: "konjunktiv2",
      color: "warning",
      cue: "Konjunktiv II (würde/könnte)",
      notes: [
        "Permintaan sopan & pengandaian: **würde + infinitiv**, **könnte, hätte, wäre**.",
      ],
      example: { de: "Könnten Sie mir bitte helfen?", id: "Bisakah Anda menolong saya?" },
    },
  ],
  tips: [
    "Bedakan posisi verba: obwohl/weil/dass → akhir; deshalb/trotzdem → posisi 2.",
    "Latih menyatakan opini: Ich finde, dass ... / Meiner Meinung nach ...",
    "Untuk ujian B1, biasakan menulis email formal & informal.",
  ],
  summary:
    "B1 = mandiri di situasi umum. Kuasai konektor obwohl/trotzdem/deshalb, Präteritum untuk cerita, Relativsatz, dan Konjunktiv II untuk kesopanan & pengandaian.",
};

const b2Notes: LevelNotes = {
  level: "B2",
  title: "Catatan Inti B2",
  subtitle: "Diskusi & argumentasi: Passiv, Konjunktiv II penuh, dan gaya formal.",
  sections: [
    {
      id: "passiv",
      color: "primary",
      cue: "Passiv (semua waktu)",
      notes: [
        "Present: **werden + Partizip II**. Lampau: **wurde + Partizip II**. Perfekt: **ist ... worden**.",
      ],
      example: { de: "Das Haus wurde 1990 gebaut.", id: "Rumah itu dibangun tahun 1990." },
    },
    {
      id: "konjunktiv2voll",
      color: "secondary",
      cue: "Konjunktiv II penuh",
      notes: [
        "Pengandaian tak nyata: **hätte/wäre + Partizip II**.",
        "Penyesalan & saran: Ich hätte ... sollen.",
      ],
      example: { de: "Wenn ich Zeit hätte, würde ich reisen.", id: "Kalau saya punya waktu, saya akan bepergian." },
    },
    {
      id: "nominalisierung",
      color: "success",
      cue: "Nominalisierung & gaya formal",
      notes: [
        "Verba/adjektiv jadi kata benda: das Lernen, die Entwicklung.",
        "Konektor formal: **einerseits ... andererseits**, **jedoch**, **dennoch**.",
      ],
    },
    {
      id: "partizipadj",
      color: "warning",
      cue: "Partizip sebagai adjektiv",
      notes: [
        "Partizip I (-end) & Partizip II bisa jadi atribut: das **lachende** Kind, die **gekochte** Suppe.",
      ],
    },
  ],
  tips: [
    "Untuk esai, susun: pendahuluan → argumen pro/kontra (einerseits/andererseits) → kesimpulan.",
    "Kuasai Passiv untuk teks berita & laporan.",
    "Variasikan konektor agar tulisan terdengar matang.",
  ],
  summary:
    "B2 = berdiskusi & menulis argumen formal. Inti: Passiv di semua waktu, Konjunktiv II penuh (hätte/wäre), nominalisasi, dan konektor formal.",
};

const c1Notes: LevelNotes = {
  level: "C1",
  title: "Catatan Inti C1",
  subtitle: "Akademik & profesional: register, kalimat tak langsung, dan idiom.",
  sections: [
    {
      id: "konjunktiv1",
      color: "primary",
      cue: "Konjunktiv I (indirekte Rede)",
      notes: [
        "Kalimat tak langsung formal (berita/laporan): er **habe**, er **sei**, er **komme**.",
      ],
      example: { de: "Er sagte, er habe keine Zeit.", id: "Dia berkata bahwa dia tidak punya waktu." },
    },
    {
      id: "register",
      color: "secondary",
      cue: "Register & gaya",
      notes: [
        "Bedakan formal vs informal: Ich würde gerne erfahren ... vs Sag mal ...",
        "Konektor canggih: **infolgedessen, nichtsdestotrotz, hinsichtlich**.",
      ],
    },
    {
      id: "redewendungen",
      color: "success",
      cue: "Redewendungen (idiom)",
      notes: [
        "Pahami makna kiasan: **die Nase voll haben** (muak), **ins Wasser fallen** (batal).",
      ],
    },
  ],
  tips: [
    "Baca artikel opini Jerman & catat konektor + idiom baru.",
    "Latih meringkas teks panjang dengan gaya netral-akademik.",
  ],
  summary:
    "C1 = lancar untuk studi & kerja. Fokus: Konjunktiv I untuk indirekte Rede, penguasaan register, konektor akademik, dan idiom.",
};

const c2Notes: LevelNotes = {
  level: "C2",
  title: "Catatan Inti C2",
  subtitle: "Mendekati native: nuansa, ironi, dan presisi gaya bahasa.",
  sections: [
    {
      id: "nuance",
      color: "primary",
      cue: "Nuansa & implikatur",
      notes: [
        "Pahami makna tersirat, ironi, dan topik abstrak.",
        "Pilih kata berdasarkan konotasi, bukan sekadar arti dasar.",
      ],
    },
    {
      id: "stil",
      color: "secondary",
      cue: "Gaya & retorika",
      notes: [
        "Variasi struktur kalimat untuk efek; gaya tulisan presisi & elegan.",
        "Modalpartikeln (doch, ja, halt, eben) untuk nada alami.",
      ],
    },
    {
      id: "polish",
      color: "success",
      cue: "Polishing kesalahan halus",
      notes: [
        "Perhatikan kolokasi & preposisi yang tepat.",
        "Hilangkan kesalahan kecil yang membedakan dari native.",
      ],
    },
  ],
  tips: [
    "Konsumsi konten asli (sastra, podcast, debat) dan tiru gaya penutur mahir.",
    "Tulis ulang teksmu untuk kepadatan & presisi, bukan sekadar benar.",
  ],
  summary:
    "C2 = nyaris seperti penutur asli. Fokus pada nuansa makna, gaya & retorika, Modalpartikeln, dan memoles kesalahan halus.",
};

export const levelNotes: Record<MajorLevel, LevelNotes> = {
  A1: a1Notes,
  A2: a2Notes,
  B1: b1Notes,
  B2: b2Notes,
  C1: c1Notes,
  C2: c2Notes,
};
