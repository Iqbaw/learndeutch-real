"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CourseSection } from "@/types/course";

export interface UnitProgress {
  completed: CourseSection[];
  answers: Record<string, number>;
  writingStatus?: "correct" | "needs-work" | "ungraded";
  speakingStatus?: "correct" | "needs-work" | "ungraded";
  reviewDueAt?: string;
  reviewedAt?: string;
  reviewStatus?: "correct" | "needs-work" | "ungraded";
}

interface CourseState {
  units: Record<string, UnitProgress>;
  answer: (unitId: string, questionId: string, value: number) => void;
  complete: (unitId: string, section: CourseSection, status?: UnitProgress["writingStatus"]) => void;
  recordReview: (unitId: string, status: UnitProgress["reviewStatus"]) => void;
}

const empty = (): UnitProgress => ({ completed: [], answers: {} });

export const useCourseStore = create<CourseState>()(persist((set) => ({
  units: {},
  answer: (unitId, questionId, value) => set((state) => ({
    units: {
      ...state.units,
      [unitId]: {
        ...(state.units[unitId] ?? empty()),
        answers: { ...(state.units[unitId]?.answers ?? {}), [questionId]: value },
      },
    },
  })),
  complete: (unitId, section, status) => set((state) => {
    const prior = state.units[unitId] ?? empty();
    const completed = prior.completed.includes(section) ? prior.completed : [...prior.completed, section];
    const bothProduced = completed.includes("writing") && completed.includes("speaking");
    return { units: { ...state.units, [unitId]: {
      ...prior,
      completed,
      ...(section === "writing" ? { writingStatus: status } : {}),
      ...(section === "speaking" ? { speakingStatus: status } : {}),
      reviewDueAt: prior.reviewDueAt ?? (bothProduced ? new Date(Date.now() + 86400000).toISOString() : undefined),
    } } };
  }),
  recordReview: (unitId, status) => set((state) => {
    const prior = state.units[unitId] ?? empty();
    return { units: { ...state.units, [unitId]: {
      ...prior,
      reviewedAt: new Date().toISOString(),
      reviewStatus: status,
      reviewDueAt: new Date(Date.now() + (status === "correct" ? 3 : 1) * 86400000).toISOString(),
      completed: prior.completed.includes("review") ? prior.completed : [...prior.completed, "review"],
    } } };
  }),
}), { name: "deutsch30-course-v1", storage: createJSONStorage(() => localStorage) }));
