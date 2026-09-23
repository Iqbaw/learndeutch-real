import type { CourseLevel, CourseQuestion } from "@/types/course";
import type { DailyCourseExtension } from "./from-daily";

type Check = [prompt: string, options: [string, string, string], correctIndex: number, explanation: string];
export interface FocusedCase {
  words: [german: string, indonesian: string, example: string][];
  reading: [title: string, text: string, checks: Check[]];
  listening: [title: string, audioText: string, checks: Check[]];
  writing: [prompt: string, modelAnswer: string, specificCriterion: string];
  speaking: [prompt: string, modelAnswer: string, followUps: string[], specificCriterion: string];
  review: [prompt: string, modelAnswer: string, specificCriterion: string];
}

export function focusedExtension(level: CourseLevel, order: number, data: FocusedCase): DailyCourseExtension {
  const questions = (section: string, checks: Check[]): CourseQuestion[] => checks.map(([prompt, options, correctIndex, explanation], index) => {
    const shift = (order + index + (section === "l" ? 1 : 0)) % options.length;
    return {
      id: `${level.toLowerCase()}-course-${order}-${section}-${index + 1}`,
      prompt,
      options: [...options.slice(shift), ...options.slice(0, shift)],
      correctIndex: (correctIndex - shift + options.length) % options.length,
      explanation,
    };
  });
  return {
    vocabulary: data.words.map(([german, indonesian, example]) => ({ german, indonesian, example })),
    reading: { title: data.reading[0], text: data.reading[1], questions: questions("r", data.reading[2]) },
    listening: { title: data.listening[0], audioText: data.listening[1], questions: questions("l", data.listening[2]) },
    writing: { prompt: data.writing[0], minWords: level === "C2" ? 80 : 70, maxWords: level === "C2" ? 180 : 140,
      modelAnswer: data.writing[1], criteria: [data.writing[2], "Alasan dan contoh saling mendukung", "Register sesuai penerima", "Simpulan tidak melampaui bukti"], guidance: ["Buat kerangka singkat sebelum menulis.", "Periksa kohesi, bentuk verba, dan kecocokan register."] },
    speaking: { prompt: data.speaking[0], preparationSeconds: 90, targetSeconds: level === "C2" ? 240 : 180,
      followUps: data.speaking[2], modelAnswer: data.speaking[1], criteria: [data.speaking[3], "Alur argumen dapat diikuti", "Pertanyaan ditanggapi langsung", "Isi transkrip tidak menilai pelafalan atau kelancaran audio"] },
    review: { prompt: data.review[0], modelAnswer: data.review[1], criteria: [data.review[2], "Situasi baru dipakai tanpa menyalin contoh", "Makna dan struktur dapat dipahami"] },
  };
}
