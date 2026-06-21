"use client";

import type { PlacementItem } from "@/data/placement-bank";
import { pickFallbackQuestion } from "@/data/placement-bank";
import type { PlacementBand, PlacementSkill } from "@/lib/placement-engine";

// ============================================================
// Client helpers that talk to /api/placement. These never see the
// DeepSeek key (it lives only on the server). Every call has a
// local fallback so the onboarding flow never breaks.
// ============================================================

export interface PlacementQuestion extends PlacementItem {
  band: PlacementBand;
  skill: PlacementSkill;
  source: "ai" | "fallback";
}

export async function fetchPlacementQuestion(
  band: PlacementBand,
  skill: PlacementSkill,
  recentPrompts: string[]
): Promise<PlacementQuestion> {
  try {
    const res = await fetch("/api/placement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "question", band, skill, recentPrompts }),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as { question?: PlacementQuestion };
    if (data.question && Array.isArray(data.question.options) && data.question.options.length === 4) {
      return data.question;
    }
    throw new Error("bad question payload");
  } catch {
    return {
      ...pickFallbackQuestion(band, skill, recentPrompts.length),
      band,
      skill,
      source: "fallback",
    };
  }
}

export interface SummaryRequest {
  estimatedLevel: string;
  startLevel: string;
  scorePct: number;
  confidence: number;
  perSkill: { label: string; accuracy: number; total: number }[];
  profile: { name?: string; goal?: string; weakSkill?: string; dailyTime?: string };
}

export async function fetchPlacementSummary(
  req: SummaryRequest
): Promise<{ summary: string | null; focusAreas: string[] }> {
  try {
    const res = await fetch("/api/placement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "summary", ...req }),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as { summary?: string; focusAreas?: string[] };
    return {
      summary: typeof data.summary === "string" ? data.summary : null,
      focusAreas: Array.isArray(data.focusAreas) ? data.focusAreas : [],
    };
  } catch {
    return { summary: null, focusAreas: [] };
  }
}
