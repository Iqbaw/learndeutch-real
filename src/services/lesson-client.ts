"use client";

import type { CEFRLevel, Lesson } from "@/types";

// ============================================================
// Client helper for the personalized-lesson endpoint. Returns the
// AI lesson on success, or null so callers fall back to the
// bundled static lesson. The DeepSeek key stays on the server.
// ============================================================

export interface LessonRequest {
  day: number;
  subLevel: CEFRLevel;
  theme: string;
  goal: string[];
  profile: {
    name?: string;
    goal?: string;
    weakSkill?: string;
    learningStyle?: string;
    estimatedLevel?: string;
  };
  recentErrorCategories: string[];
  focusAreas: string[];
}

export async function fetchAIEnabled(): Promise<boolean> {
  try {
    const res = await fetch("/api/lesson", { method: "GET" });
    if (!res.ok) return false;
    const data = (await res.json()) as { aiEnabled?: boolean };
    return Boolean(data.aiEnabled);
  } catch {
    return false;
  }
}

export async function fetchPersonalizedLesson(req: LessonRequest): Promise<Lesson | null> {
  try {
    const res = await fetch("/api/lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { lesson?: Lesson | null };
    return data.lesson ?? null;
  } catch {
    return null;
  }
}
