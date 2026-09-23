import { getAdvancedLesson } from "@/data/advanced-lessons";
import type { CourseLevel, CourseQuestion, CourseUnit } from "@/types/course";

export interface DailyCourseExtension {
  vocabulary: CourseUnit["vocabulary"];
  reading: CourseUnit["reading"];
  listening: CourseUnit["listening"];
  writing: CourseUnit["writing"];
  speaking: CourseUnit["speaking"];
  review: CourseUnit["review"];
  grammarQuestions?: CourseQuestion[];
}

const days = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11];

export function extendAdvancedLevel(level: "B2" | "C2", extensions: DailyCourseExtension[]): CourseUnit[] {
  if (extensions.length !== days.length) throw new Error(`${level}: expected ${days.length} course extensions`);
  return days.map((day, index) => {
    const lesson = getAdvancedLesson(level, day);
    if (!lesson) throw new Error(`${level} day ${day} missing`);
    const pattern = lesson.steps.find((step) => step.type === "pattern");
    const example = lesson.steps.find((step) => step.type === "example");
    const mistake = lesson.steps.find((step) => step.type === "mistake");
    const drills = lesson.steps.filter((step) => step.type === "drill" && step.exercise);
    const extra = extensions[index];
    const grammarQuestions: CourseQuestion[] = extra.grammarQuestions ?? drills.map((step, questionIndex) => ({
      id: `${level.toLowerCase()}-${index + 1}-grammar-${questionIndex + 1}`,
      prompt: step.exercise!.prompt,
      options: step.exercise!.options,
      correctIndex: step.exercise!.correctIndex,
      explanation: step.exercise!.explanation,
    }));
    return {
      id: `${level.toLowerCase()}-course-${index + 1}`,
      level,
      order: index + 1,
      title: lesson.title,
      topic: extra.reading.title,
      estimatedMinutes: 90,
      objectives: [
        `Memakai ${lesson.title} secara tepat dalam konteks baru`,
        `Menafsirkan informasi dan sikap dari bacaan “${extra.reading.title}” serta audio terpisah`,
        "Menyusun respons tertulis dan lisan, lalu mentransfernya setelah jeda",
      ],
      prerequisites: index ? [`Unit ${index} ${level}`] : [level === "B2" ? "Argumen, pasif, dan anak kalimat B1" : "Sintesis, register, dan teks kompleks C1"],
      grammar: {
        title: lesson.steps.find((step) => step.type === "pattern")?.title ?? lesson.title,
        explanation: pattern?.body ?? "Tinjau pola inti sebelum memakai dalam tugas baru.",
        formula: pattern?.formula ?? "Pola sesuai konteks",
        examples: [{ german: example?.german ?? "", indonesian: example?.indonesian ?? "", note: "Contoh inti dari pelajaran harian." }, { german: mistake?.correct ?? "", indonesian: "Perhatikan bentuk dan konteksnya.", note: `Bandingkan dengan bentuk yang kurang tepat: ${mistake?.wrong ?? ""}` }],
        pitfalls: [mistake?.body ?? "Periksa konteks sebelum memakai pola.", "Pilih struktur yang sesuai maksud dan register; kalimat lain bisa benar dalam konteks berbeda."],
        questions: grammarQuestions,
      },
      vocabulary: extra.vocabulary,
      reading: extra.reading,
      listening: extra.listening,
      writing: extra.writing,
      speaking: extra.speaking,
      review: extra.review,
      examFocus: ["Lesen: makna dan rincian teks baru", "Hören: maksud, sikap, dan syarat", "Schreiben: tugas dengan isi dan register jelas", "Sprechen: posisi, alasan, dan tanggapan"],
    };
  });
}
