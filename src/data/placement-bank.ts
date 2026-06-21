import type { PlacementBand, PlacementSkill } from "@/lib/placement-engine";
import { PLACEMENT_BANDS } from "@/lib/placement-engine";

// ============================================================
// Static fallback question bank for the adaptive placement test.
//
// When DeepSeek is configured these are replaced by fresh,
// AI-generated items at the exact band + skill the engine asks
// for. When AI is unavailable (no key / network error) we serve
// from this bank instead, so the test always works.
//
// Every item: a single multiple-choice question with 4 options,
// the correct index, and an Indonesian explanation.
// ============================================================

export interface PlacementItem {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

type Bank = Partial<Record<PlacementBand, Partial<Record<PlacementSkill, PlacementItem[]>>>>;

export const placementBank: Bank = {
  "A1.1": {
    grammar: [
      {
        prompt: "Lengkapi: „Ich ___ Max.“ (Nama saya Max)",
        options: ["bin", "heiße", "habe", "ist"],
        correctIndex: 1,
        explanation: "Untuk menyebut nama, gunakan kata kerja 'heißen': Ich heiße Max.",
      },
      {
        prompt: "Lengkapi: „Du ___ müde.“ (Kamu lelah)",
        options: ["bin", "bist", "ist", "sind"],
        correctIndex: 1,
        explanation: "Untuk subjek 'du', kata kerja 'sein' menjadi 'bist'.",
      },
    ],
    vocabulary: [
      {
        prompt: "Apa arti „danke“?",
        options: ["Halo", "Maaf", "Terima kasih", "Selamat tinggal"],
        correctIndex: 2,
        explanation: "„danke“ berarti terima kasih.",
      },
    ],
    communication: [
      {
        prompt: "Bagaimana cara bertanya „Dari mana asalmu?“",
        options: ["Wie alt bist du?", "Woher kommst du?", "Was machst du?", "Wer bist du?"],
        correctIndex: 1,
        explanation: "„Woher“ = dari mana. „Woher kommst du?“ menanyakan asal.",
      },
    ],
    reading: [
      {
        prompt: "„Hallo, ich heiße Anna.“ — Apa yang sedang dilakukan Anna?",
        options: ["Berpamitan", "Memperkenalkan diri", "Memesan makanan", "Bertanya umur"],
        correctIndex: 1,
        explanation: "„Ich heiße ...“ dipakai untuk memperkenalkan diri.",
      },
    ],
  },

  "A1.2": {
    grammar: [
      {
        prompt: "Pilih artikel yang benar: „___ Buch“ (buku)",
        options: ["der", "die", "das", "den"],
        correctIndex: 2,
        explanation: "„Buch“ bersifat netral, jadi artikelnya „das“.",
      },
      {
        prompt: "Lengkapi: „Ich möchte Deutsch ___.“",
        options: ["lerne", "lernst", "lernen", "gelernt"],
        correctIndex: 2,
        explanation: "Setelah verb modal (möchte), verb kedua memakai bentuk infinitiv di akhir.",
      },
    ],
    vocabulary: [
      {
        prompt: "Apa arti „die Familie“?",
        options: ["Teman", "Keluarga", "Rumah", "Pekerjaan"],
        correctIndex: 1,
        explanation: "„die Familie“ berarti keluarga.",
      },
    ],
    communication: [
      {
        prompt: "Bagaimana mengatakan „Saya tidak punya waktu“?",
        options: ["Ich habe keine Zeit.", "Ich bin Zeit.", "Ich nicht Zeit.", "Ich kein Zeit habe."],
        correctIndex: 0,
        explanation: "Negasi kata benda memakai „kein-“: „Ich habe keine Zeit.“",
      },
    ],
    reading: [
      {
        prompt: "„Ich wohne in Berlin.“ — Informasi apa ini?",
        options: ["Asal negara", "Tempat tinggal sekarang", "Pekerjaan", "Umur"],
        correctIndex: 1,
        explanation: "„wohnen in“ menyatakan tempat tinggal sekarang.",
      },
    ],
  },

  "A2.1": {
    grammar: [
      {
        prompt: "Bentuk lampau (Perfekt): „Gestern ___ ich ins Kino gegangen.“",
        options: ["bin", "habe", "war", "hatte"],
        correctIndex: 0,
        explanation: "Verb gerak (gehen) memakai 'sein' di Perfekt: „bin ... gegangen“.",
      },
      {
        prompt: "Lengkapi: „Ich fahre ___ dem Bus zur Arbeit.“",
        options: ["mit", "für", "ohne", "um"],
        correctIndex: 0,
        explanation: "Untuk alat transportasi pakai 'mit' (+ Dativ): mit dem Bus.",
      },
    ],
    vocabulary: [
      {
        prompt: "Apa arti „der Termin“?",
        options: ["Janji/jadwal", "Stasiun", "Makanan", "Cuaca"],
        correctIndex: 0,
        explanation: "„der Termin“ berarti janji temu atau jadwal.",
      },
    ],
    communication: [
      {
        prompt: "Bagaimana menanyakan jam dengan sopan?",
        options: ["Wie viel kostet das?", "Wie spät ist es?", "Wo ist das?", "Wer ist das?"],
        correctIndex: 1,
        explanation: "„Wie spät ist es?“ = Jam berapa sekarang?",
      },
    ],
    reading: [
      {
        prompt: "„Ich habe gestern einen Brief geschrieben.“ — Kapan kejadiannya?",
        options: ["Sekarang", "Besok", "Kemarin", "Minggu depan"],
        correctIndex: 2,
        explanation: "„gestern“ = kemarin, dan Perfekt menandakan kejadian lampau.",
      },
    ],
  },

  "A2.2": {
    grammar: [
      {
        prompt: "Dativ: „Ich gebe ___ Mann das Buch.“ (kepada pria itu)",
        options: ["der", "den", "dem", "des"],
        correctIndex: 2,
        explanation: "Objek tidak langsung memakai Dativ: „dem Mann“.",
      },
      {
        prompt: "Komparatif: „Anna ist ___ als Tom.“ (lebih tinggi)",
        options: ["groß", "größer", "am größten", "die größte"],
        correctIndex: 1,
        explanation: "Komparatif „größer“ + „als“ untuk membandingkan dua hal.",
      },
    ],
    vocabulary: [
      {
        prompt: "Apa arti „die Erfahrung“?",
        options: ["Pengalaman", "Perjalanan", "Pertanyaan", "Perubahan"],
        correctIndex: 0,
        explanation: "„die Erfahrung“ berarti pengalaman.",
      },
    ],
    communication: [
      {
        prompt: "Menyatakan alasan: „Ich bleibe zu Hause, ___ ich krank bin.“",
        options: ["und", "weil", "oder", "aber"],
        correctIndex: 1,
        explanation: "„weil“ = karena, dan verb pindah ke akhir anak kalimat.",
      },
    ],
    reading: [
      {
        prompt: "„Wenn das Wetter schön ist, gehen wir spazieren.“ — Maknanya?",
        options: [
          "Kami selalu jalan-jalan",
          "Jika cuaca bagus, kami jalan-jalan",
          "Kami tidak suka jalan-jalan",
          "Cuaca selalu bagus",
        ],
        correctIndex: 1,
        explanation: "„Wenn“ memperkenalkan syarat: jika cuaca bagus, maka ...",
      },
    ],
  },

  "B1.1": {
    grammar: [
      {
        prompt: "Konnektor: „Ich lerne Deutsch, ___ ich in Deutschland studieren möchte.“",
        options: ["weil", "obwohl", "trotzdem", "deshalb"],
        correctIndex: 0,
        explanation: "„weil“ memberi alasan; cocok dengan keinginan studi di Jerman.",
      },
      {
        prompt: "Präteritum: „Als Kind ___ ich oft im Park.“ (bermain)",
        options: ["spiele", "gespielt", "spielte", "spielen"],
        correctIndex: 2,
        explanation: "Untuk cerita masa lalu (tertulis), Präteritum: „spielte“.",
      },
    ],
    vocabulary: [
      {
        prompt: "Apa arti „die Umwelt“?",
        options: ["Lingkungan", "Masyarakat", "Pemerintah", "Ekonomi"],
        correctIndex: 0,
        explanation: "„die Umwelt“ berarti lingkungan (alam).",
      },
    ],
    communication: [
      {
        prompt: "Menyatakan pendapat: „Meiner ___ nach ist das richtig.“",
        options: ["Meinung", "Idee", "Frage", "Antwort"],
        correctIndex: 0,
        explanation: "„Meiner Meinung nach“ = menurut pendapat saya.",
      },
    ],
    reading: [
      {
        prompt: "„Obwohl es regnete, gingen wir spazieren.“ — Apa maknanya?",
        options: [
          "Kami tidak jalan karena hujan",
          "Meskipun hujan, kami tetap jalan-jalan",
          "Hujan membuat kami senang",
          "Kami menunggu hujan reda",
        ],
        correctIndex: 1,
        explanation: "„Obwohl“ = meskipun (pertentangan).",
      },
    ],
  },

  "B1.2": {
    grammar: [
      {
        prompt: "Relativsatz: „Das ist der Mann, ___ mir geholfen hat.“",
        options: ["der", "den", "dem", "dessen"],
        correctIndex: 0,
        explanation: "Subjek anak kalimat (Nominativ, maskulin) → pronomina relatif „der“.",
      },
      {
        prompt: "Passiv: „Das Haus ___ 1990 gebaut.“",
        options: ["hat", "wurde", "war", "ist"],
        correctIndex: 1,
        explanation: "Passiv lampau (Präteritum): „wurde ... gebaut“.",
      },
    ],
    vocabulary: [
      {
        prompt: "Apa arti „die Voraussetzung“?",
        options: ["Syarat/prasyarat", "Keputusan", "Kesimpulan", "Penjelasan"],
        correctIndex: 0,
        explanation: "„die Voraussetzung“ berarti prasyarat/persyaratan.",
      },
    ],
    communication: [
      {
        prompt: "Mengusulkan: „___ wir heute Abend ins Kino gehen?“",
        options: ["Sollen", "Müssen", "Dürfen", "Können"],
        correctIndex: 0,
        explanation: "„Sollen wir ...?“ dipakai untuk mengusulkan sesuatu.",
      },
    ],
    reading: [
      {
        prompt: "„Je mehr ich übe, desto besser werde ich.“ — Maknanya?",
        options: [
          "Latihan tidak penting",
          "Makin banyak berlatih, makin baik",
          "Saya berhenti berlatih",
          "Saya sudah sempurna",
        ],
        correctIndex: 1,
        explanation: "Pola „je ... desto ...“ = makin ... makin ...",
      },
    ],
  },

  "B2.1": {
    grammar: [
      {
        prompt: "Konjunktiv II: „Wenn ich Zeit ___, würde ich reisen.“",
        options: ["habe", "hätte", "hatte", "haben"],
        correctIndex: 1,
        explanation: "Pengandaian tidak nyata memakai „hätte“.",
      },
    ],
    vocabulary: [
      {
        prompt: "Apa arti „nachhaltig“?",
        options: ["Berkelanjutan", "Sementara", "Mahal", "Rumit"],
        correctIndex: 0,
        explanation: "„nachhaltig“ berarti berkelanjutan/sustainable.",
      },
    ],
    communication: [
      {
        prompt: "Argumen formal: „Einerseits ist es teuer, ___ ist es sehr nützlich.“",
        options: ["andererseits", "deshalb", "trotzdem", "außerdem"],
        correctIndex: 0,
        explanation: "Pasangan „einerseits ... andererseits ...“ = di satu sisi ... di sisi lain.",
      },
    ],
    reading: [
      {
        prompt: "„Der Bericht setzt voraus, dass die Daten korrekt sind.“ — „voraussetzen“ berarti?",
        options: ["mengandaikan/menganggap", "menolak", "mengubah", "menunda"],
        correctIndex: 0,
        explanation: "„voraussetzen“ = mengandaikan/menjadikan syarat.",
      },
    ],
  },

  "B2.2": {
    grammar: [
      {
        prompt: "Nominalisierung: „Das ___ der Sprache braucht Zeit.“ (belajar)",
        options: ["lernen", "Lernen", "gelernt", "lernt"],
        correctIndex: 1,
        explanation: "Verb yang dinominalkan ditulis kapital: „das Lernen“.",
      },
    ],
    vocabulary: [
      {
        prompt: "Apa arti „die Auswirkung“?",
        options: ["Dampak", "Tujuan", "Sumber", "Kelebihan"],
        correctIndex: 0,
        explanation: "„die Auswirkung“ berarti dampak/akibat.",
      },
    ],
    communication: [
      {
        prompt: "Menyimpulkan: „___ lässt sich sagen, dass das Projekt erfolgreich war.“",
        options: ["Zusammenfassend", "Plötzlich", "Vielleicht", "Endlich"],
        correctIndex: 0,
        explanation: "„Zusammenfassend lässt sich sagen ...“ = sebagai kesimpulan ...",
      },
    ],
    reading: [
      {
        prompt: "„Die Maßnahme stieß auf erheblichen Widerstand.“ — Maknanya?",
        options: [
          "Kebijakan itu diterima dengan mudah",
          "Kebijakan itu mendapat banyak penolakan",
          "Kebijakan itu dibatalkan",
          "Kebijakan itu murah",
        ],
        correctIndex: 1,
        explanation: "„auf Widerstand stoßen“ = menghadapi penolakan.",
      },
    ],
  },

  "C1.1": {
    grammar: [
      {
        prompt: "Konjunktiv I (indirekte Rede): „Er sagte, er ___ keine Zeit.“",
        options: ["hat", "habe", "hätte", "haben"],
        correctIndex: 1,
        explanation: "Kalimat tidak langsung formal memakai Konjunktiv I: „habe“.",
      },
    ],
    vocabulary: [
      {
        prompt: "Apa arti idiom „die Nase voll haben“?",
        options: ["Sedang pilek", "Sudah muak/bosan", "Sangat lapar", "Penasaran"],
        correctIndex: 1,
        explanation: "Idiom „die Nase voll haben“ = sudah muak/bosan dengan sesuatu.",
      },
    ],
    communication: [
      {
        prompt: "Register formal untuk „Saya ingin menanyakan ...“:",
        options: [
          "Ich will fragen ...",
          "Ich würde gerne erfahren ...",
          "Sag mal ...",
          "Was ist los ...",
        ],
        correctIndex: 1,
        explanation: "„Ich würde gerne erfahren ...“ adalah ungkapan yang lebih formal/sopan.",
      },
    ],
    reading: [
      {
        prompt: "„Der Autor übt scharfe Kritik an der Politik.“ — Sikap penulis?",
        options: ["Mendukung penuh", "Mengkritik tajam", "Netral", "Tidak peduli"],
        correctIndex: 1,
        explanation: "„scharfe Kritik üben“ = melontarkan kritik tajam.",
      },
    ],
  },
};

/**
 * Pick a fallback question for the given band + skill. Falls back to nearby
 * bands and other skills so any (band, skill) request always resolves.
 */
export function pickFallbackQuestion(
  band: PlacementBand,
  skill: PlacementSkill,
  seed = 0
): PlacementItem {
  const bandIndex = PLACEMENT_BANDS.indexOf(band);

  // Search outward from the requested band for an entry in the requested skill.
  for (let radius = 0; radius < PLACEMENT_BANDS.length; radius++) {
    for (const idx of [bandIndex - radius, bandIndex + radius]) {
      if (idx < 0 || idx >= PLACEMENT_BANDS.length) continue;
      const b = PLACEMENT_BANDS[idx];
      const items = placementBank[b]?.[skill];
      if (items && items.length > 0) return items[seed % items.length];
    }
  }

  // Last resort: any item from the requested band, then any band at all.
  const sameBand = placementBank[band];
  if (sameBand) {
    for (const list of Object.values(sameBand)) {
      if (list && list.length) return list[seed % list.length];
    }
  }
  for (const b of PLACEMENT_BANDS) {
    const entry = placementBank[b];
    if (!entry) continue;
    for (const list of Object.values(entry)) {
      if (list && list.length) return list[seed % list.length];
    }
  }

  // Should never reach here given the bank above, but keep TS happy.
  return {
    prompt: "Lengkapi: „Ich ___ Deutsch.“ (belajar)",
    options: ["lerne", "lernst", "lernt", "lernen"],
    correctIndex: 0,
    explanation: "Untuk subjek 'ich', verb 'lernen' menjadi 'lerne'.",
  };
}
