import type { CourseBlueprint, CourseLevel, CourseUnit } from "@/types/course";
import { b1CourseUnits } from "./b1";
import { b2CourseUnits } from "./b2";
import { c1CourseUnits } from "./c1";
import { c2CourseUnits } from "./c2";

export const courseLevels: CourseLevel[] = ["B1", "B2", "C1", "C2"];

export const courseBlueprints: Record<CourseLevel, CourseBlueprint> = {
  B1: { level: "B1", title: "Mandiri dalam situasi sehari-hari", description: "Memahami informasi utama, menjelaskan alasan, dan menulis atau berbicara dengan tujuan jelas.", prerequisite: "Fondasi A1–A2", outcomes: ["Memahami teks dan pengumuman dengan rincian penting", "Menulis pesan, pendapat, dan pengalaman terstruktur", "Menyampaikan alasan dan merespons pertanyaan"], sources: [{ label: "Goethe-Zertifikat B1", url: "https://www.goethe.de/en/spr/prf/ueb/pb1.html" }] },
  B2: { level: "B2", title: "Argumen dan komunikasi lebih kompleks", description: "Membandingkan pandangan, membatasi klaim, dan menulis formal dengan kohesi yang baik.", prerequisite: "Kemampuan B1 yang stabil", outcomes: ["Menganalisis sudut pandang dan bukti", "Menulis argumen dengan alasan dan pembatasan", "Berdiskusi dan menanggapi sanggahan"], sources: [{ label: "Goethe-Zertifikat B2", url: "https://www.goethe.de/ins/de/de/prf/prf/gzb2/ue9.html" }] },
  C1: { level: "C1", title: "Presisi akademik dan profesional", description: "Menyintesis sumber, menguji kekuatan argumen, serta menyesuaikan register dan struktur.", prerequisite: "Kemampuan B2 yang stabil", outcomes: ["Menafsirkan teks panjang secara kritis", "Menyusun pendapat bernuansa dari beberapa sumber", "Mempresentasikan dan mempertahankan posisi"], sources: [{ label: "Goethe-Zertifikat C1", url: "https://www.goethe.de/ins/de/de/prf/prf/gzc1/u24.html" }] },
  C2: { level: "C2", title: "Ketepatan makna dan gaya", description: "Mengolah nuansa, implikasi, dan register dalam komunikasi yang sangat kompleks.", prerequisite: "Kemampuan C1 yang stabil", outcomes: ["Memahami makna tersirat dan gaya", "Menulis argumentasi presisi tinggi", "Berbicara fleksibel dan merespons keberatan"], sources: [{ label: "Goethe-Zertifikat C2", url: "https://www.goethe.de/ins/de/en/m/prf/prf/gzc2/ueb.html" }] },
};

// Answer keys are persisted per unit. Normalize authored short IDs so one
// question can never accidentally share an identity with another unit.
export const courseUnits: CourseUnit[] = [...b1CourseUnits, ...b2CourseUnits, ...c1CourseUnits, ...c2CourseUnits].map((unit) => ({
  ...unit,
  grammar: { ...unit.grammar, questions: unit.grammar.questions.map((question) => ({ ...question, id: `${unit.id}-grammar-${question.id}` })) },
  reading: { ...unit.reading, questions: unit.reading.questions.map((question) => ({ ...question, id: `${unit.id}-reading-${question.id}` })) },
  listening: { ...unit.listening, questions: unit.listening.questions.map((question) => ({ ...question, id: `${unit.id}-listening-${question.id}` })) },
}));
export function unitsForLevel(level: CourseLevel) { return courseUnits.filter((unit) => unit.level === level).sort((a, b) => a.order - b.order); }
export function getCourseUnit(id: string) { return courseUnits.find((unit) => unit.id === id); }
