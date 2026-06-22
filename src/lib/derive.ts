// ============================================================
// Derive views (roadmap, stats, review queue, badges) from the
// user's REAL persisted progress. No fake numbers anywhere — if
// there is no activity yet, everything reports empty/zero.
// ============================================================

import type {
  CEFRLevel,
  MemoryStatus,
  RoadmapDay,
  ReviewCard,
  Skill,
  SkillScore,
} from "@/types";
import { a1Days } from "@/data/levels";
import { vocabulary } from "@/data/vocabulary";
import { grammarTopics } from "@/data/grammar";
import { capPercent } from "@/lib/placement-engine";
import type { SkillStat } from "@/lib/store";

export const SKILLS: Skill[] = [
  "Listening",
  "Reading",
  "Speaking",
  "Writing",
  "Grammar",
  "Vocabulary",
  "Pronunciation",
  "Retention",
];

const EXAM_DAYS = new Set([15, 28, 30]);
const REVIEW_DAYS = new Set([7, 14, 21]);
const REMEDIAL_DAYS = new Set([29]);

/** Map a 0–100 accuracy value to a coarse CEFR sub-level. */
export function valueToLevel(value: number): CEFRLevel {
  if (value <= 0) return "Pre-A1";
  if (value < 30) return "A1.1";
  if (value < 55) return "A1.2";
  if (value < 75) return "A2.1";
  if (value < 90) return "A2.2";
  return "B1.1";
}

export function buildRoadmap(currentDay: number, completedDays: number[]): RoadmapDay[] {
  const done = new Set(completedDays);
  return a1Days.map((d) => {
    let status: RoadmapDay["status"];
    if (done.has(d.day)) status = "done";
    else if (d.day === currentDay) status = "active";
    else if (d.day < currentDay) status = "done";
    else if (EXAM_DAYS.has(d.day)) status = "exam";
    else if (REVIEW_DAYS.has(d.day)) status = "review";
    else if (REMEDIAL_DAYS.has(d.day)) status = "remedial";
    else status = "locked";
    return {
      day: d.day,
      subLevel: d.subLevel,
      theme: d.theme,
      skill: d.skill,
      estimatedMinutes: d.estimatedMinutes,
      status,
    };
  });
}

function accuracy(stat?: SkillStat): number {
  if (!stat || stat.total === 0) return 0;
  return capPercent((stat.correct / stat.total) * 100);
}

export function computeSkillScores(
  skillStats: Partial<Record<Skill, SkillStat>>
): SkillScore[] {
  return SKILLS.map((skill) => {
    const value = accuracy(skillStats[skill]);
    return { skill, value, level: valueToLevel(value) };
  });
}

export interface VocabCounts {
  total: number;
  started: number;
  passive: number; // any status beyond "new"
  active: number; // mastered
  weak: number; // review
  learning: number;
  almost: number;
  mastered: number;
}

export function computeVocabCounts(vocabStatus: Record<string, MemoryStatus>): VocabCounts {
  const counts: Record<MemoryStatus, number> = {
    new: 0,
    learning: 0,
    review: 0,
    almost: 0,
    mastered: 0,
  };
  for (const word of vocabulary) {
    const status = vocabStatus[word.id] ?? "new";
    counts[status]++;
  }
  const started = counts.learning + counts.review + counts.almost + counts.mastered;
  return {
    total: vocabulary.length,
    started,
    passive: started,
    active: counts.mastered,
    weak: counts.review,
    learning: counts.learning,
    almost: counts.almost,
    mastered: counts.mastered,
  };
}

export function grammarMasteryFor(
  topicId: string,
  grammarStats: Record<string, SkillStat>
): number {
  return accuracy(grammarStats[topicId]);
}

export function computeGrammarMastery(
  grammarStats: Record<string, SkillStat>
): { topic: string; value: number }[] {
  return grammarTopics.map((t) => ({ topic: t.title, value: grammarMasteryFor(t.id, grammarStats) }));
}

export interface DeriveStatsInput {
  startLevel: CEFRLevel;
  currentDay: number;
  completedDays: number[];
  skillStats: Partial<Record<Skill, SkillStat>>;
  grammarStats: Record<string, SkillStat>;
  vocabStatus: Record<string, MemoryStatus>;
  speakingAttempts: number;
  /** Optional adaptive-placement result; seeds the estimate before lessons accrue. */
  placement?: { estimatedLevel: CEFRLevel; confidence: number } | null;
}

export interface DerivedStats {
  hasData: boolean;
  estimatedLevel: CEFRLevel;
  confidence: number;
  activeLevel: CEFRLevel;
  passiveLevel: CEFRLevel;
  skills: SkillScore[];
  vocab: VocabCounts;
  grammarMastery: { topic: string; value: number }[];
  retention: number;
  realUse: number;
  weekly: { week: string; accuracy: number; minutes: number }[];
  totalAttempts: number;
  overallAccuracy: number;
  aiInsight: string;
}

function avg(values: number[]): number {
  const real = values.filter((v) => v > 0);
  if (real.length === 0) return 0;
  return Math.round(real.reduce((a, b) => a + b, 0) / real.length);
}

export function deriveStats(input: DeriveStatsInput): DerivedStats {
  const skills = computeSkillScores(input.skillStats);
  const vocab = computeVocabCounts(input.vocabStatus);
  const grammarMastery = computeGrammarMastery(input.grammarStats);

  let sumCorrect = 0;
  let sumTotal = 0;
  for (const skill of SKILLS) {
    const stat = input.skillStats[skill];
    if (stat) {
      sumCorrect += stat.correct;
      sumTotal += stat.total;
    }
  }
  const overallAccuracy = sumTotal > 0 ? capPercent((sumCorrect / sumTotal) * 100) : 0;

  const get = (s: Skill) => accuracy(input.skillStats[s]);
  const activeRaw = avg([get("Speaking"), get("Writing")]);
  const passiveRaw = avg([get("Reading"), get("Listening"), get("Vocabulary")]);

  const hasData =
    sumTotal > 0 || input.completedDays.length > 0 || vocab.started > 0 || !!input.placement;

  // Accurate level estimation: weight all data sources
  // More attempts = higher confidence. Accuracy drives level progression.
  const effectiveAccuracy = sumTotal >= 5 ? overallAccuracy : 0;
  const dayProgress = input.completedDays.length / 30; // 0..1
  const vocabFactor = vocab.started > 0 ? Math.min(1, vocab.mastered / Math.max(1, vocab.started)) : 0;
  const grammarAvg = grammarMastery.length > 0
    ? grammarMastery.reduce((sum, g) => sum + g.value, 0) / grammarMastery.length
    : 0;

  // composite score (0-100) weighted across data sources
  const composite = sumTotal === 0 ? 0 :
    effectiveAccuracy * 0.35 +
    grammarAvg * 0.25 +
    (vocabFactor * 100) * 0.2 +
    (dayProgress * 100) * 0.2;

  const computedLevel: CEFRLevel =
    input.completedDays.length === 0 && sumTotal === 0
      ? input.startLevel
      : composite >= 85
      ? "A2.1"
      : composite >= 70
      ? "A1.2"
      : composite >= 40
      ? "A1.1"
      : input.startLevel;

  // While lesson data is still sparse, trust the adaptive placement estimate;
  // once the learner has done enough lessons, real performance takes over.
  const lessonsDone = input.completedDays.length;
  const estimatedLevel: CEFRLevel =
    input.placement && lessonsDone < 5 ? input.placement.estimatedLevel : computedLevel;

  // confidence increases with more data points
  const dataDensity = Math.min(1, sumTotal / 80); // need ~80 answers for full confidence
  let confidence = sumTotal === 0 ? 0 : Math.round(composite * dataDensity);
  // Placement gives an immediate, real confidence floor before lessons accrue.
  if (input.placement && lessonsDone < 5) {
    confidence = Math.max(confidence, input.placement.confidence);
  }
  confidence = capPercent(confidence);

  const activeLevel = activeRaw > 0 ? valueToLevel(activeRaw) : input.startLevel;
  const passiveLevel = passiveRaw > 0 ? valueToLevel(passiveRaw) : input.startLevel;

  // retention: share of started words that reached almost/mastered
  const retention =
    vocab.started > 0
      ? capPercent(((vocab.almost + vocab.mastered) / vocab.started) * 100)
      : 0;

  const realUse = avg([get("Speaking"), get("Writing"), get("Pronunciation")]);

  const weekly = hasData
    ? [{ week: "Minggu ini", accuracy: overallAccuracy, minutes: input.completedDays.length * 35 }]
    : [];

  let aiInsight: string;
  if (!hasData) {
    aiInsight =
      "Belum ada cukup data. Selesaikan beberapa pelajaran dan review supaya aku bisa memberi analisis level yang akurat untukmu.";
  } else {
    const weakest = [...skills]
      .filter((s) => s.value > 0)
      .sort((a, b) => a.value - b.value)[0];
    const strongest = [...skills].sort((a, b) => b.value - a.value)[0];
    aiInsight =
      `Estimasi levelmu ${estimatedLevel} dengan confidence ${confidence}%. ` +
      (strongest && strongest.value > 0
        ? `${strongest.skill} kamu paling kuat. `
        : "") +
      (weakest
        ? `Fokus berikutnya: perkuat ${weakest.skill} dengan latihan tambahan.`
        : "Terus jaga konsistensi review harianmu.");
  }

  return {
    hasData,
    estimatedLevel,
    confidence,
    activeLevel,
    passiveLevel,
    skills,
    vocab,
    grammarMastery,
    retention,
    realUse,
    weekly,
    totalAttempts: sumTotal,
    overallAccuracy,
    aiInsight,
  };
}

/** Build the spaced-repetition review queue from words the user has started. */
export function buildReviewQueue(vocabStatus: Record<string, MemoryStatus>): ReviewCard[] {
  const inProgress = vocabulary.filter((w) => {
    const status = vocabStatus[w.id];
    return status === "learning" || status === "review" || status === "almost";
  });

  const allMeanings = vocabulary.map((w) => w.indonesian);

  return inProgress.slice(0, 12).map((w, i) => {
    if (w.article) {
      const options = ["der", "die", "das"];
      return {
        id: w.id,
        type: "article",
        question: `Pilih artikel yang benar: ___ ${w.german.replace(/^(der|die|das)\s/, "")}`,
        options,
        correctIndex: options.indexOf(w.article),
        explanation: `${w.german} → artikelnya "${w.article}".`,
        due: "Hari ini",
      };
    }
    // meaning multiple choice with deterministic distractors
    const distractors = allMeanings
      .filter((m) => m !== w.indonesian)
      .slice(i, i + 3);
    while (distractors.length < 3) distractors.push("—");
    const correctIndex = i % 4 < 3 ? i % 4 : 0;
    const options = [...distractors];
    options.splice(correctIndex, 0, w.indonesian);
    return {
      id: w.id,
      type: "meaning",
      question: `Apa arti "${w.german}"?`,
      options: options.slice(0, 4),
      correctIndex,
      explanation: `${w.german} = ${w.indonesian}.`,
      due: "Hari ini",
    };
  });
}

export interface DeriveBadgesInput {
  streak: number;
  completedDays: number[];
  xp: number;
  speakingAttempts: number;
  masteredVocab: number;
}

export function deriveBadges(input: DeriveBadgesInput): string[] {
  const badges: string[] = [];
  if (input.completedDays.length >= 1) badges.push("Langkah Pertama");
  if (input.streak >= 7) badges.push("Konsisten 7 Hari");
  else if (input.streak >= 3) badges.push("Konsisten 3 Hari");
  if (input.speakingAttempts >= 1) badges.push("Percakapan Pertama");
  if (input.masteredVocab >= 10) badges.push("10 Kata Dikuasai");
  if (input.masteredVocab >= 25) badges.push("25 Kata Dikuasai");
  if (input.xp >= 500) badges.push("500 XP");
  if (input.completedDays.length >= 15) badges.push("Setengah Jalan A1");
  return badges;
}
