"use client";

import type { ErrorItem } from "@/types";

// ============================================================
// Client helper for the dynamic AI mistake-review endpoint.
// The DeepSeek key stays on the server. Returns null on failure so
// the UI can fall back gracefully.
// ============================================================

export interface AIReviewItem {
  errorId: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tip: string;
}

export interface ReviewProfile {
  name?: string;
  goal?: string;
  estimatedLevel?: string;
}

export async function fetchAIReview(
  errors: ErrorItem[],
  profile: ReviewProfile
): Promise<AIReviewItem[] | null> {
  try {
    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        errors: errors.map((e) => ({
          id: e.id,
          category: e.category,
          userAnswer: e.userAnswer,
          correctAnswer: e.correctAnswer,
          explanation: e.explanation,
        })),
        profile,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { items?: AIReviewItem[] };
    if (Array.isArray(data.items) && data.items.length > 0) return data.items;
    return null;
  } catch {
    return null;
  }
}
