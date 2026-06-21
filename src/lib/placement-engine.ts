// ============================================================
// Adaptive placement engine (Computerized Adaptive Testing, CAT).
//
// This is pure, deterministic TypeScript with NO secrets and NO
// network calls, so it can run on the client to drive the test
// flow and also on the server. DeepSeek is used only to generate
// the *content* of each question at the difficulty this engine
// asks for — the adaptive policy itself lives here.
//
// Method: an ELO / 1-parameter-IRT style ability estimate in
// "ladder index" space. After every answer the learner's ability
// moves toward or away from the item difficulty, and the
// uncertainty shrinks. We keep asking items right at the current
// ability estimate (maximum information) until the estimate is
// stable or we hit the question cap.
// ============================================================

import type { CEFRLevel } from "@/types";

export type PlacementBand =
  | "A1.1"
  | "A1.2"
  | "A2.1"
  | "A2.2"
  | "B1.1"
  | "B1.2"
  | "B2.1"
  | "B2.2"
  | "C1.1";

export type PlacementSkill = "grammar" | "vocabulary" | "reading" | "communication";

export const PLACEMENT_BANDS: PlacementBand[] = [
  "A1.1",
  "A1.2",
  "A2.1",
  "A2.2",
  "B1.1",
  "B1.2",
  "B2.1",
  "B2.2",
  "C1.1",
];

export const PLACEMENT_SKILLS: PlacementSkill[] = [
  "grammar",
  "vocabulary",
  "reading",
  "communication",
];

export const SKILL_LABEL: Record<PlacementSkill, string> = {
  grammar: "Tata bahasa",
  vocabulary: "Kosakata",
  reading: "Membaca",
  communication: "Komunikasi",
};

export const MIN_QUESTIONS = 7;
export const MAX_QUESTIONS = 12;

const INITIAL_UNCERTAINTY = 2.0;
const MIN_UNCERTAINTY = 0.45;
const STOP_UNCERTAINTY = 0.7;
const SPREAD = 1.2; // logistic spread in ladder units

export interface AnswerRecord {
  band: PlacementBand;
  bandIndex: number;
  skill: PlacementSkill;
  correct: boolean;
}

export interface PlacementState {
  ability: number; // current estimate in ladder-index space
  uncertainty: number;
  history: AnswerRecord[];
}

function clampIndex(i: number): number {
  return Math.max(0, Math.min(PLACEMENT_BANDS.length - 1, i));
}

/** Map the self-reported level from onboarding into a starting ability. */
export function initialState(selfLevel?: string): PlacementState {
  let ability: number;
  let uncertainty = INITIAL_UNCERTAINTY;
  switch (selfLevel) {
    case "Nol total":
      ability = 0; // A1.1
      uncertainty = 1.3; // we mostly trust this
      break;
    case "Sedikit":
      ability = 0.6;
      break;
    case "A1":
      ability = 1.6; // around A1.2 / A2.1 boundary
      break;
    case "A2":
      ability = 3.0; // around A2.2
      break;
    default:
      ability = 1.0; // A1.2, very unsure
      uncertainty = INITIAL_UNCERTAINTY;
  }
  return { ability, uncertainty, history: [] };
}

/** Probability a learner of `ability` answers an item of `difficulty` correctly. */
function expectedCorrect(ability: number, difficulty: number): number {
  return 1 / (1 + Math.pow(10, (difficulty - ability) / SPREAD));
}

/** Update the ability estimate after one answer. */
export function applyAnswer(state: PlacementState, record: AnswerRecord): PlacementState {
  const p = expectedCorrect(state.ability, record.bandIndex);
  // Larger steps while uncertain, smaller as the estimate settles.
  const learnRate = 0.5 + 0.55 * (state.uncertainty / INITIAL_UNCERTAINTY);
  const delta = learnRate * ((record.correct ? 1 : 0) - p);
  const ability = clampIndex(state.ability + delta);
  const uncertainty = Math.max(MIN_UNCERTAINTY, state.uncertainty - 0.22);
  return { ability, uncertainty, history: [...state.history, record] };
}

/** Choose the band (difficulty) for the next question — right at the estimate. */
export function nextBand(state: PlacementState): PlacementBand {
  return PLACEMENT_BANDS[clampIndex(Math.round(state.ability))];
}

/**
 * Choose which skill to test next. We rotate through all four skills for
 * coverage, lightly biasing toward the learner's self-reported weak skill so
 * the estimate reflects real-world ability across competencies.
 */
export function nextSkill(state: PlacementState, weakSkill?: string): PlacementSkill {
  const counts: Record<PlacementSkill, number> = {
    grammar: 0,
    vocabulary: 0,
    reading: 0,
    communication: 0,
  };
  for (const r of state.history) counts[r.skill]++;

  const weak = mapWeakSkill(weakSkill);
  let best: PlacementSkill = "grammar";
  let bestScore = Infinity;
  for (const skill of PLACEMENT_SKILLS) {
    // fewer-asked skills score lower (preferred); weak skill gets a small bonus
    const score = counts[skill] - (skill === weak ? 0.5 : 0);
    if (score < bestScore) {
      bestScore = score;
      best = skill;
    }
  }
  return best;
}

function mapWeakSkill(weakSkill?: string): PlacementSkill | null {
  switch (weakSkill) {
    case "Grammar":
      return "grammar";
    case "Vocabulary":
      return "vocabulary";
    case "Listening":
    case "Reading":
      return "reading";
    case "Speaking":
    case "Writing":
      return "communication";
    default:
      return null;
  }
}

/** Decide whether the test has enough information to stop. */
export function shouldStop(state: PlacementState): boolean {
  const asked = state.history.length;
  if (asked >= MAX_QUESTIONS) return true;
  if (asked >= MIN_QUESTIONS && state.uncertainty <= STOP_UNCERTAINTY) return true;
  return false;
}

export interface PerSkillResult {
  skill: PlacementSkill;
  label: string;
  correct: number;
  total: number;
  accuracy: number; // 0-100
}

export interface PlacementResult {
  estimatedLevel: CEFRLevel; // the learner's true estimated band
  startLevel: CEFRLevel; // where they start in the (A1) course
  recommendedDay: number; // 1 or 16
  canSkip: boolean;
  confidence: number; // 0-100
  scorePct: number; // 0-100
  correctCount: number;
  totalQuestions: number;
  abilityIndex: number;
  perSkill: PerSkillResult[];
  summary: string; // filled by AI when available, else a sensible default
}

/** Highest day/level the bundled course currently supports (A1.2 starts day 16). */
function courseStart(bandIndex: number): { startLevel: CEFRLevel; day: number; canSkip: boolean } {
  if (bandIndex <= 0) return { startLevel: "A1.1", day: 1, canSkip: false };
  // Anyone at A1.2 or above starts at the most advanced bundled lesson (A1.2 / day 16).
  return { startLevel: "A1.2", day: 16, canSkip: true };
}

/** Produce the final assessment from the engine state. */
export function finalizeResult(state: PlacementState, selfLevel?: string): PlacementResult {
  const finalIndex = clampIndex(Math.round(state.ability));
  const estimatedBand = PLACEMENT_BANDS[finalIndex];
  const estimatedLevel = estimatedBand as CEFRLevel;

  const correctCount = state.history.filter((r) => r.correct).length;
  const totalQuestions = state.history.length;
  const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Confidence: high when uncertainty is low and answers are internally consistent.
  const uncertaintyConf = 1 - (state.uncertainty - MIN_UNCERTAINTY) / (INITIAL_UNCERTAINTY - MIN_UNCERTAINTY);
  const consistency = answerConsistency(state);
  const confidence = totalQuestions === 0
    ? 35
    : Math.round(clamp(45, 97, 55 + uncertaintyConf * 30 + consistency * 12));

  const perSkill = PLACEMENT_SKILLS.map<PerSkillResult>((skill) => {
    const items = state.history.filter((r) => r.skill === skill);
    const c = items.filter((r) => r.correct).length;
    return {
      skill,
      label: SKILL_LABEL[skill],
      correct: c,
      total: items.length,
      accuracy: items.length > 0 ? Math.round((c / items.length) * 100) : 0,
    };
  });

  // "Nol total" honesty guard: never push an absolute beginner past the basics.
  let resolvedIndex = finalIndex;
  if (selfLevel === "Nol total" && finalIndex <= 1) resolvedIndex = 0;

  const { startLevel, day, canSkip } = courseStart(resolvedIndex);

  return {
    estimatedLevel: (selfLevel === "Nol total" && resolvedIndex === 0 ? "A1.1" : estimatedLevel) as CEFRLevel,
    startLevel,
    recommendedDay: day,
    canSkip,
    confidence,
    scorePct,
    correctCount,
    totalQuestions,
    abilityIndex: finalIndex,
    perSkill,
    summary: defaultSummary(estimatedBand, startLevel, scorePct),
  };
}

function clamp(min: number, max: number, v: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Consistency 0..1: how well answers follow the expected pattern (easy items
 * correct, hard items wrong). Erratic patterns (guessing) lower confidence.
 */
function answerConsistency(state: PlacementState): number {
  if (state.history.length === 0) return 0;
  let agree = 0;
  for (const r of state.history) {
    const p = expectedCorrect(state.ability, r.bandIndex);
    const predictedCorrect = p >= 0.5;
    if (predictedCorrect === r.correct) agree++;
  }
  return agree / state.history.length;
}

function defaultSummary(estimated: PlacementBand, startLevel: CEFRLevel, scorePct: number): string {
  if (estimated === "A1.1") {
    return "Kita mulai dari A1.1 untuk membangun fondasi yang kokoh. Setiap hari kamu akan terasa makin percaya diri.";
  }
  if (startLevel === "A1.2" && (estimated === "A1.2")) {
    return `Kamu sudah menguasai dasar A1.1 (skor ${scorePct}%). Kamu bisa langsung lompat ke A1.2, atau mengulang fondasi dari Hari 1.`;
  }
  return `Estimasi kemampuanmu di sekitar ${estimated} (skor ${scorePct}%). Materi di atas A1 sedang disiapkan — sementara itu kita perkuat A1.2 agar fondasimu benar-benar solid.`;
}
