// ============================================================
// Domain types for Deutsch Lernen in 30 Tagen
// ============================================================

export type CEFRLevel =
  | "Pre-A1"
  | "A1.1"
  | "A1.2"
  | "A2.1"
  | "A2.2"
  | "B1.1"
  | "B1.2"
  | "B2.1"
  | "B2.2"
  | "C1.1"
  | "C1.2"
  | "C2.1"
  | "C2.2";

export type MajorLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface SubLevel {
  id: CEFRLevel;
  label: string;
  dayRange: [number, number];
  focus: string;
}

export interface Level {
  id: MajorLevel;
  title: string;
  durationDays: number;
  focus: string;
  outcome: string;
  subLevels: SubLevel[];
  accent: string; // tailwind color hint
}

export type DayStatus =
  | "done"
  | "active"
  | "locked"
  | "remedial"
  | "exam"
  | "review";

export interface RoadmapDay {
  day: number;
  subLevel: CEFRLevel;
  theme: string;
  skill: string;
  status: DayStatus;
  estimatedMinutes: number;
}

// ---------- Lessons ----------

export type LessonStepType =
  | "story"
  | "pattern"
  | "example"
  | "drill"
  | "listening"
  | "speaking"
  | "writing"
  | "mistake"
  | "victory";

export interface ColoredToken {
  text: string;
  role: "subject" | "verb" | "info" | "object" | "time" | "plain";
}

export interface DrillExercise {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonStep {
  type: LessonStepType;
  title: string;
  // narrative / instruction text (Indonesian)
  body?: string;
  // pattern formula text
  formula?: string;
  // colored example tokens
  tokens?: ColoredToken[];
  // translation pair
  german?: string;
  indonesian?: string;
  // exercise data
  exercise?: DrillExercise;
  // speaking/writing prompt
  prompt?: string;
  expected?: string;
  // mistake explanation
  wrong?: string;
  correct?: string;
  // victory summary bullets
  achievements?: string[];
}

export interface Lesson {
  day: number;
  subLevel: CEFRLevel;
  title: string;
  goal: string[];
  estimatedMinutes: number;
  steps: LessonStep[];
}

// ---------- Vocabulary ----------

export type MemoryStatus =
  | "new"
  | "learning"
  | "review"
  | "almost"
  | "mastered";

export interface VocabularyItem {
  id: string;
  german: string;
  article?: "der" | "die" | "das";
  plural?: string;
  indonesian: string;
  exampleA1: string;
  exampleTranslation: string;
  mnemonic?: string;
  level: CEFRLevel;
  status?: MemoryStatus; // derived per-user from the store, not baked into content
  category: string;
  emoji: string;
}

// ---------- Grammar ----------

export interface GrammarTopic {
  id: string;
  title: string;
  simpleExplanation: string;
  formula: string;
  correct: string;
  wrong: string;
  whyWrong: string;
  realLife: string;
  mnemonic: string;
  mastery?: number; // 0-100, derived per-user from the store
  level: CEFRLevel;
  icon: string;
}

// ---------- Errors ----------

export type ErrorCategory =
  | "Word Order"
  | "Article"
  | "Case"
  | "Vocabulary"
  | "Pronunciation"
  | "Listening"
  | "Spelling"
  | "Grammar";

export type ErrorStatus =
  | "new"
  | "reviewed"
  | "almost"
  | "safe"
  | "relapsed";

export interface ErrorItem {
  id: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  category: ErrorCategory;
  date: string;
  status: ErrorStatus;
}

// ---------- Statistics ----------

export interface SkillScore {
  skill: string;
  value: number; // 0-100
  level: CEFRLevel;
}

export interface Stats {
  estimatedLevel: CEFRLevel;
  confidence: number;
  activeLevel: CEFRLevel;
  passiveLevel: CEFRLevel;
  skills: SkillScore[];
  vocabulary: {
    passive: number;
    active: number;
    weak: number;
    forgotten: number;
  };
  grammarMastery: { topic: string; value: number }[];
  retention14: number;
  realUse: number;
  weekly: { week: string; accuracy: number; minutes: number }[];
  aiInsight: string;
}

// ---------- Speaking ----------

export interface Roleplay {
  id: string;
  title: string;
  scenario: string;
  level: CEFRLevel;
  emoji: string;
  turns: { speaker: "ai" | "user"; text: string; translation?: string }[];
}

// ---------- Mock test ----------

export interface MockTestSection {
  id: string;
  name: string;
  skill: string;
  questions: DrillExercise[];
}

export interface MockTest {
  id: string;
  level: MajorLevel;
  title: string;
  sections: MockTestSection[];
}

// ---------- Review queue ----------

export type ReviewType =
  | "meaning"
  | "type-meaning"
  | "article"
  | "build"
  | "listen"
  | "fix";

export interface ReviewCard {
  id: string;
  type: ReviewType;
  question: string;
  options?: string[];
  correctIndex?: number;
  answer?: string;
  explanation: string;
  due: string;
}

// ---------- User ----------

export type Skill =
  | "Listening"
  | "Reading"
  | "Speaking"
  | "Writing"
  | "Grammar"
  | "Vocabulary"
  | "Pronunciation"
  | "Retention";

export interface UserProfile {
  name: string;
  goal: string;
  startLevel: CEFRLevel;
  weakSkill: string;
  learningStyle: string;
  createdAt: string;
}
