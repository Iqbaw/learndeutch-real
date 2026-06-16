"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  CEFRLevel,
  ErrorCategory,
  ErrorItem,
  MemoryStatus,
  Skill,
} from "@/types";
import { vocabulary } from "@/data/vocabulary";

// ============================================================
// Single source of truth for REAL user data.
// Nothing here is pre-seeded — everything starts empty and is
// filled in by the user's onboarding answers and actual usage,
// then persisted to localStorage.
// ============================================================

export interface OnboardingAnswers {
  name?: string;
  goal?: string;
  level?: string;
  dailyTime?: string;
  weakSkill?: string;
  learningStyle?: string;
}

export interface Profile {
  name: string;
  goal: string;
  startLevel: CEFRLevel;
  weakSkill: string;
  learningStyle: string;
  createdAt: string;
}

export interface SkillStat {
  correct: number;
  total: number;
}

export interface MockResult {
  id: string;
  level: string;
  score: number;
  date: string;
  perSkill: { skill: string; value: number }[];
}

interface AppState {
  // hydration guard for persisted state (avoids SSR mismatch)
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  // --- onboarding & profile ---
  onboarding: OnboardingAnswers;
  profile: Profile | null;
  setOnboardingAnswer: (key: keyof OnboardingAnswers, value: string) => void;
  completeOnboarding: (profile: Profile) => void;

  // --- progress ---
  currentDay: number;
  completedDays: number[];
  streak: number;
  lastStudyDate: string | null;
  lastReviewDate: string | null;
  xp: number;

  vocabStatus: Record<string, MemoryStatus>;
  errors: ErrorItem[];
  skillStats: Partial<Record<Skill, SkillStat>>;
  grammarStats: Record<string, SkillStat>;
  mockResults: MockResult[];
  speakingAttempts: number;

  // --- settings ---
  dailyTargetMinutes: number;
  audioSpeed: number;
  explanationLang: string;
  soundEnabled: boolean;
  setDailyTarget: (minutes: number) => void;
  setAudioSpeed: (speed: number) => void;
  setExplanationLang: (lang: string) => void;
  setSoundEnabled: (value: boolean) => void;

  // --- actions ---
  recordAnswer: (skill: Skill, correct: boolean) => void;
  recordError: (e: {
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
    category: ErrorCategory;
  }) => void;
  startLearningVocab: (id: string) => void;
  reviewVocab: (id: string, correct: boolean) => void;
  recordGrammar: (topicId: string, correct: boolean) => void;
  completeLesson: (day: number, opts: { xp: number; subLevel: CEFRLevel }) => void;
  completeReview: () => void;
  recordMock: (result: MockResult) => void;
  recordSpeaking: () => void;
  resetProgress: () => void;
  resetAll: () => void;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

// progression of a single word through memory states
function advanceStatus(current: MemoryStatus | undefined, correct: boolean): MemoryStatus {
  const order: MemoryStatus[] = ["new", "learning", "review", "almost", "mastered"];
  const idx = current ? order.indexOf(current) : 0;
  if (correct) {
    if (current === "review") return "almost";
    return order[Math.min(order.length - 1, Math.max(1, idx + 1))];
  }
  // a wrong answer sends the word back to the review pile
  return current === "new" || current === "learning" ? "learning" : "review";
}

const initialProgress = {
  currentDay: 1,
  completedDays: [] as number[],
  streak: 0,
  lastStudyDate: null as string | null,
  lastReviewDate: null as string | null,
  xp: 0,
  vocabStatus: {} as Record<string, MemoryStatus>,
  errors: [] as ErrorItem[],
  skillStats: {} as Partial<Record<Skill, SkillStat>>,
  grammarStats: {} as Record<string, SkillStat>,
  mockResults: [] as MockResult[],
  speakingAttempts: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      onboarding: {},
      profile: null,
      setOnboardingAnswer: (key, value) =>
        set((s) => ({ onboarding: { ...s.onboarding, [key]: value } })),
      completeOnboarding: (profile) => set({ profile }),

      ...initialProgress,

      dailyTargetMinutes: 30,
      audioSpeed: 1,
      explanationLang: "Indonesia",
      soundEnabled: true,
      setDailyTarget: (minutes) => set({ dailyTargetMinutes: minutes }),
      setAudioSpeed: (speed) => set({ audioSpeed: speed }),
      setExplanationLang: (lang) => set({ explanationLang: lang }),
      setSoundEnabled: (value) => set({ soundEnabled: value }),

      recordAnswer: (skill, correct) =>
        set((s) => {
          const prev = s.skillStats[skill] ?? { correct: 0, total: 0 };
          return {
            skillStats: {
              ...s.skillStats,
              [skill]: { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 },
            },
            xp: s.xp + (correct ? 10 : 2),
          };
        }),

      recordError: (e) =>
        set((s) => {
          const existingIdx = s.errors.findIndex(
            (x) => x.userAnswer === e.userAnswer && x.correctAnswer === e.correctAnswer
          );
          const errors = [...s.errors];
          if (existingIdx >= 0) {
            // same mistake again — mark as relapsed and bump to the top
            const [item] = errors.splice(existingIdx, 1);
            errors.unshift({ ...item, status: "relapsed", date: todayStr() });
          } else {
            errors.unshift({
              id:
                typeof crypto !== "undefined" && "randomUUID" in crypto
                  ? crypto.randomUUID()
                  : `e${Date.now()}${Math.random().toString(16).slice(2)}`,
              userAnswer: e.userAnswer,
              correctAnswer: e.correctAnswer,
              explanation: e.explanation,
              category: e.category,
              date: todayStr(),
              status: "new",
            });
          }
          return { errors: errors.slice(0, 100) };
        }),

      startLearningVocab: (id) =>
        set((s) => {
          const current = s.vocabStatus[id];
          if (current && current !== "new") return s;
          return { vocabStatus: { ...s.vocabStatus, [id]: "learning" } };
        }),

      reviewVocab: (id, correct) =>
        set((s) => ({
          vocabStatus: {
            ...s.vocabStatus,
            [id]: advanceStatus(s.vocabStatus[id], correct),
          },
          xp: s.xp + (correct ? 5 : 1),
        })),

      recordGrammar: (topicId, correct) =>
        set((s) => {
          const prev = s.grammarStats[topicId] ?? { correct: 0, total: 0 };
          return {
            grammarStats: {
              ...s.grammarStats,
              [topicId]: { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 },
            },
          };
        }),

      completeLesson: (day, opts) =>
        set((s) => {
          const today = todayStr();
          // streak: +1 if studied yesterday, reset to 1 otherwise, unchanged if already today
          let streak = s.streak;
          if (s.lastStudyDate !== today) {
            if (s.lastStudyDate && daysBetween(s.lastStudyDate, today) === 1) {
              streak = s.streak + 1;
            } else {
              streak = 1;
            }
          }

          // introduce up to 6 still-new words of this sublevel into the review loop
          const vocabStatus = { ...s.vocabStatus };
          let introduced = 0;
          for (const word of vocabulary) {
            if (introduced >= 6) break;
            if (word.level === opts.subLevel && !vocabStatus[word.id]) {
              vocabStatus[word.id] = "learning";
              introduced++;
            }
          }

          const completedDays = s.completedDays.includes(day)
            ? s.completedDays
            : [...s.completedDays, day].sort((a, b) => a - b);

          return {
            completedDays,
            currentDay: Math.min(30, Math.max(s.currentDay, day + 1)),
            streak,
            lastStudyDate: today,
            xp: s.xp + opts.xp,
            vocabStatus,
          };
        }),

      recordMock: (result) =>
        set((s) => ({ mockResults: [result, ...s.mockResults].slice(0, 50) })),

      completeReview: () => set({ lastReviewDate: todayStr() }),

      recordSpeaking: () => set((s) => ({ speakingAttempts: s.speakingAttempts + 1 })),

      resetProgress: () => set({ ...initialProgress }),

      resetAll: () =>
        set({
          ...initialProgress,
          profile: null,
          onboarding: {},
          dailyTargetMinutes: 30,
          audioSpeed: 1,
          explanationLang: "Indonesia",
          soundEnabled: true,
        }),
    }),
    {
      name: "deutsch30-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (s) => ({
        onboarding: s.onboarding,
        profile: s.profile,
        currentDay: s.currentDay,
        completedDays: s.completedDays,
        streak: s.streak,
        lastStudyDate: s.lastStudyDate,
        xp: s.xp,
        vocabStatus: s.vocabStatus,
        errors: s.errors,
        skillStats: s.skillStats,
        grammarStats: s.grammarStats,
        mockResults: s.mockResults,
        lastReviewDate: s.lastReviewDate,
        speakingAttempts: s.speakingAttempts,
        dailyTargetMinutes: s.dailyTargetMinutes,
        audioSpeed: s.audioSpeed,
        explanationLang: s.explanationLang,
        soundEnabled: s.soundEnabled,
      }),
    }
  )
);

/** True once the persisted store has rehydrated on the client. */
export function useHydrated(): boolean {
  return useAppStore((s) => s.hasHydrated);
}
