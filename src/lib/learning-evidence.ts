"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AssessmentResult } from "./assessment";
import type { MajorLevel } from "@/types";

export function missionLevelFromId(id: string): MajorLevel {
  const prefix = id.split("-")[0].toUpperCase();
  return ["A2", "B1", "B2", "C1", "C2"].includes(prefix) ? prefix as MajorLevel : "A1";
}

export interface MissionEvidence {
  id: string;
  day: number;
  goal: string;
  answer: string;
  status: AssessmentResult["status"];
  source: AssessmentResult["source"];
  feedback: string;
  attemptedAt: string;
  dueAt: string;
  delayedPasses: number;
  lastDelayedPassAt?: string;
}

export function nextEvidence(previous: MissionEvidence | undefined, input: Omit<MissionEvidence, "dueAt" | "delayedPasses" | "lastDelayedPassAt">, review: boolean): MissionEvidence {
  const now = new Date(input.attemptedAt).getTime();
  const delayed = review && previous && now >= new Date(previous.dueAt).getTime();
  const passed = delayed && input.status === "correct";
  const delayedPasses = input.status === "needs-work" ? 0 : (previous?.delayedPasses ?? 0) + (passed ? 1 : 0);
  const interval = input.status !== "correct" ? 1 : [1, 3, 7, 14][Math.min(delayedPasses, 3)];
  return { ...input, delayedPasses,
    lastDelayedPassAt: passed ? input.attemptedAt : previous?.lastDelayedPassAt,
    dueAt: previous && !delayed && input.status === "correct" ? previous.dueAt : new Date(now + interval * 86400000).toISOString(),
  };
}

interface EvidenceState {
  missions: Record<string, MissionEvidence>;
  drafts: Record<string, string>;
  positions: Record<string, number>;
  saveDraft: (id: string, value: string) => void;
  savePosition: (id: string, value: number) => void;
  record: (id: string, day: number, goal: string, answer: string, result: AssessmentResult, review?: boolean) => void;
  clear: () => void;
}

export const useLearningEvidence = create<EvidenceState>()(persist((set) => ({
  missions: {}, drafts: {}, positions: {},
  saveDraft: (id, value) => set((s) => ({ drafts: { ...s.drafts, [id]: value } })),
  savePosition: (id, value) => set((s) => ({ positions: { ...s.positions, [id]: value } })),
  record: (id, day, goal, answer, result, review = false) => set((s) => ({ missions: { ...s.missions,
    [id]: nextEvidence(s.missions[id], { id, day, goal, answer, status: result.status, source: result.source,
      feedback: result.feedback, attemptedAt: new Date().toISOString() }, review),
  } })),
  clear: () => set({ missions: {}, drafts: {}, positions: {} }),
}), { name: "deutsch30-learning-evidence-v1" }));
