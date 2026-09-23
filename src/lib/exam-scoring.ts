import type { CourseQuestion } from "@/types/course";

export function scoreClosedPractice(questions: CourseQuestion[], answers: Record<string, number>) {
  const correct = questions.reduce((total, question) => total + (answers[question.id] === question.correctIndex ? 1 : 0), 0);
  return { correct, total: questions.length, percent: questions.length ? Math.round(correct / questions.length * 100) : 0 };
}
