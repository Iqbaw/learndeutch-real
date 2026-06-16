"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OnboardingAnswers {
  goal?: string;
  level?: string;
  dailyTime?: string;
  weakSkill?: string;
  learningStyle?: string;
}

interface AppState {
  onboarding: OnboardingAnswers;
  onboardingComplete: boolean;
  setOnboardingAnswer: (key: keyof OnboardingAnswers, value: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // simple progress tracking for demo
  completedDays: number[];
  markDayComplete: (day: number) => void;

  dailyTargetMinutes: number;
  setDailyTarget: (minutes: number) => void;
  audioSpeed: number;
  setAudioSpeed: (speed: number) => void;
  explanationLang: string;
  setExplanationLang: (lang: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      onboarding: {},
      onboardingComplete: false,
      setOnboardingAnswer: (key, value) =>
        set((s) => ({ onboarding: { ...s.onboarding, [key]: value } })),
      completeOnboarding: () => set({ onboardingComplete: true }),
      resetOnboarding: () => set({ onboarding: {}, onboardingComplete: false }),

      completedDays: [1, 2, 3],
      markDayComplete: (day) =>
        set((s) =>
          s.completedDays.includes(day)
            ? s
            : { completedDays: [...s.completedDays, day] }
        ),

      dailyTargetMinutes: 45,
      setDailyTarget: (minutes) => set({ dailyTargetMinutes: minutes }),
      audioSpeed: 1,
      setAudioSpeed: (speed) => set({ audioSpeed: speed }),
      explanationLang: "Indonesia",
      setExplanationLang: (lang) => set({ explanationLang: lang }),
    }),
    { name: "deutsch30-store" }
  )
);
