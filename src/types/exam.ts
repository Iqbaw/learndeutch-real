import type { CourseLevel, CourseQuestion, CourseSkill } from "./course";

export interface ExamPractice {
  id: string;
  level: CourseLevel;
  skill: CourseSkill;
  title: string;
  instructions: string;
  practiceMinutes: number;
  sourceTitle?: string;
  sourceText?: string;
  audioText?: string;
  questions?: CourseQuestion[];
  prompt?: string;
  criteria?: string[];
  modelAnswer?: string;
  followUps?: string[];
}

export interface ExamAttempt {
  id: string;
  practiceId: string;
  startedAt: string;
  deadlineAt?: string;
  submittedAt?: string;
  answers: Record<string, number>;
  response: string;
  correctCount?: number;
  totalCount?: number;
  aiFeedback?: { status: "correct" | "needs-work" | "ungraded"; feedback: string };
}
