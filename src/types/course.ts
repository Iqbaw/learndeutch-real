export type CourseLevel = "B1" | "B2" | "C1" | "C2";
export type CourseSkill = "reading" | "listening" | "writing" | "speaking";
export type CourseSection = "material" | "grammar" | "reading" | "listening" | "writing" | "speaking" | "review";

export interface CourseQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseUnit {
  id: string;
  level: CourseLevel;
  order: number;
  title: string;
  topic: string;
  estimatedMinutes: number;
  objectives: string[];
  prerequisites: string[];
  grammar: {
    title: string;
    explanation: string;
    formula: string;
    examples: { german: string; indonesian: string; note: string }[];
    pitfalls: string[];
    questions: CourseQuestion[];
  };
  vocabulary: { german: string; indonesian: string; example: string }[];
  reading: { title: string; text: string; questions: CourseQuestion[] };
  listening: { title: string; audioText: string; questions: CourseQuestion[] };
  writing: { prompt: string; minWords: number; maxWords: number; modelAnswer: string; criteria: string[]; guidance: string[] };
  speaking: { prompt: string; preparationSeconds: number; targetSeconds: number; followUps: string[]; modelAnswer: string; criteria: string[] };
  review: { prompt: string; modelAnswer: string; criteria: string[] };
  examFocus: string[];
}

export interface CourseBlueprint {
  level: CourseLevel;
  title: string;
  description: string;
  prerequisite: string;
  outcomes: string[];
  sources: { label: string; url: string }[];
}
