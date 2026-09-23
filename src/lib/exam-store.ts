"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ExamAttempt, ExamPractice } from "@/types/exam";
import { scoreClosedPractice } from "./exam-scoring";

interface ExamState {
  attempts: ExamAttempt[];
  start: (practice: ExamPractice, timed: boolean) => string;
  answer: (attemptId: string, questionId: string, answerIndex: number) => void;
  saveResponse: (attemptId: string, response: string) => void;
  submit: (attemptId: string, practice: ExamPractice) => void;
  feedback: (attemptId: string, status: "correct" | "needs-work" | "ungraded", feedback: string) => void;
}

export const useExamStore = create<ExamState>()(persist((set, get) => ({
  attempts: [],
  start: (practice, timed) => {
    const id = `${practice.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date();
    const attempt: ExamAttempt = { id, practiceId: practice.id, startedAt: now.toISOString(),
      deadlineAt: timed ? new Date(now.getTime() + practice.practiceMinutes * 60000).toISOString() : undefined,
      answers: {}, response: "" };
    set((state) => ({ attempts: [...state.attempts, attempt] }));
    return id;
  },
  answer: (attemptId, questionId, answerIndex) => set((state) => ({ attempts: state.attempts.map((attempt) => attempt.id === attemptId && !attempt.submittedAt && (!attempt.deadlineAt || Date.now() < new Date(attempt.deadlineAt).getTime()) ? { ...attempt, answers: { ...attempt.answers, [questionId]: answerIndex } } : attempt) })),
  saveResponse: (attemptId, response) => set((state) => ({ attempts: state.attempts.map((attempt) => attempt.id === attemptId && !attempt.submittedAt && (!attempt.deadlineAt || Date.now() < new Date(attempt.deadlineAt).getTime()) ? { ...attempt, response } : attempt) })),
  submit: (attemptId, practice) => {
    const attempt = get().attempts.find((item) => item.id === attemptId);
    if (!attempt || attempt.submittedAt || attempt.practiceId !== practice.id) return;
    const score = practice.questions ? scoreClosedPractice(practice.questions, attempt.answers) : null;
    set((state) => ({ attempts: state.attempts.map((item) => item.id === attemptId ? { ...item,
      submittedAt: new Date().toISOString(), correctCount: score?.correct, totalCount: score?.total,
    } : item) }));
  },
  feedback: (attemptId, status, feedback) => set((state) => ({ attempts: state.attempts.map((attempt) => attempt.id === attemptId && attempt.submittedAt ? { ...attempt, aiFeedback: { status, feedback } } : attempt) })),
}), { name: "deutsch30-exam-practice-v1", storage: createJSONStorage(() => localStorage) }));
