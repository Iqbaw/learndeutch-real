import type { Lesson, LessonStep, LessonStepType, ColoredToken, CEFRLevel } from "@/types";

const STEP_TYPES: LessonStepType[] = [
  "story",
  "pattern",
  "example",
  "drill",
  "listening",
  "speaking",
  "writing",
  "mistake",
  "victory",
];

const TOKEN_ROLES: ColoredToken["role"][] = [
  "subject",
  "verb",
  "info",
  "object",
  "time",
  "plain",
];

export interface GenerateLessonInput {
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

export function str(x: unknown): string | undefined {
  return typeof x === "string" && x.trim() ? x.trim() : undefined;
}

/** Reject a prompt that asks to complete a sentence but contains no actual sentence/gap. */
function promptLooksComplete(prompt: string): boolean {
  const p = prompt.trim();
  if (p.length < 6) return false;
  if (/[:：]\s*$/.test(p)) return false;
  const wantsGap = /(lengkapi|melengkapi|isilah|isi titik|rumpang|kalimat berikut|lengkapilah|sisipkan)/i.test(p);
  if (wantsGap && !p.includes("___") && !p.includes("…") && !p.includes("...")) return false;
  return true;
}

/** Sanitize one AI step into a renderer-safe LessonStep, or null if unusable. */
export function coerceStep(raw: unknown): LessonStep | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const type = STEP_TYPES.includes(o.type as LessonStepType)
    ? (o.type as LessonStepType)
    : null;
  if (!type) return null;
  const title = str(o.title) ?? defaultTitle(type);

  const step: LessonStep = { type, title };

  if (str(o.body)) step.body = str(o.body);
  if (str(o.formula)) step.formula = str(o.formula);
  if (str(o.german)) step.german = str(o.german);
  if (str(o.indonesian)) step.indonesian = str(o.indonesian);
  if (str(o.prompt)) step.prompt = str(o.prompt);
  if (str(o.expected)) step.expected = str(o.expected);
  if (str(o.wrong)) step.wrong = str(o.wrong);
  if (str(o.correct)) step.correct = str(o.correct);

  if (Array.isArray(o.keywords)) {
    const kws = o.keywords.filter((k): k is string => typeof k === "string");
    if (kws.length) step.keywords = kws;
  }

  if (Array.isArray(o.achievements)) {
    const a = o.achievements.filter((x): x is string => typeof x === "string");
    if (a.length) step.achievements = a;
  }

  if (Array.isArray(o.tokens)) {
    const tokens = o.tokens
      .map((t): ColoredToken | null => {
        if (!t || typeof t !== "object") return null;
        const to = t as Record<string, unknown>;
        const text = str(to.text);
        if (!text) return null;
        const role = TOKEN_ROLES.includes(to.role as ColoredToken["role"])
          ? (to.role as ColoredToken["role"])
          : "plain";
        return { text, role };
      })
      .filter((t): t is ColoredToken => t !== null);
    if (tokens.length) step.tokens = tokens;
  }

  if (o.exercise && typeof o.exercise === "object") {
    const e = o.exercise as Record<string, unknown>;
    const prompt = str(e.prompt);
    // Reject malformed/duplicate choices rather than shifting the answer index.
    if (!Array.isArray(e.options) || e.options.some((x) => typeof x !== "string" || !x.trim())) return null;
    const options = (e.options as string[]).map((x) => x.trim());
    if (new Set(options.map((x) => x.toLowerCase())).size !== options.length) return null;
    const correctIndex = typeof e.correctIndex === "number" ? e.correctIndex : -1;
    if (prompt && promptLooksComplete(prompt) && options.length >= 2 && options.length <= 5 && Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < options.length && str(e.explanation)) {
      const audioText = str(e.audioText);
      if (type === "listening" && (!audioText || prompt.toLowerCase().includes(audioText.toLowerCase()) || /audio\s*:/i.test(prompt))) return null;
      step.exercise = {
        prompt,
        options,
        correctIndex,
        explanation: str(e.explanation) ?? "",
        ...(audioText ? { audioText } : {}),
      };
    } else if (type === "drill" || type === "listening") {
      // a drill/listening step without a valid exercise is not renderable
      return null;
    }
  } else if (type === "drill" || type === "listening") {
    return null;
  }

  if (type === "speaking" || type === "writing") {
    if (!step.prompt || !step.expected) return null;
    step.assessment = o.assessment === "closed" ? "closed" : "open";
    if (Array.isArray(o.acceptedAnswers)) step.acceptedAnswers = o.acceptedAnswers.filter((s): s is string => typeof s === "string" && s.length < 2000).slice(0, 8);
    step.criteria = Array.isArray(o.criteria) ? o.criteria.filter((s): s is string => typeof s === "string" && s.length > 3 && s.length <= 300).slice(0, 6) : [];
    if (step.assessment === "open" && !step.criteria.length) return null;
  }
  // mistake needs wrong+correct
  if (type === "mistake" && (!step.wrong || !step.correct)) return null;
  // victory needs achievements
  if (type === "victory" && !step.achievements) {
    step.achievements = ["Kamu menyelesaikan pelajaran hari ini!"];
  }

  return step;
}

function defaultTitle(type: LessonStepType): string {
  const map: Record<LessonStepType, string> = {
    story: "Cerita",
    pattern: "Pola & rumus",
    example: "Contoh",
    drill: "Latihan",
    listening: "Dengarkan",
    speaking: "Ucapkan",
    writing: "Tulis jawaban",
    mistake: "Kesalahan umum",
    victory: "Ringkasan",
  };
  return map[type];
}

export function coerceLesson(raw: unknown, input: GenerateLessonInput): Lesson | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;

  const stepsRaw = Array.isArray(o.steps) ? o.steps : [];
  const steps = stepsRaw
    .map(coerceStep)
    .filter((s): s is LessonStep => s !== null);

  // Do not silently publish a lesson that lost an invalid task or core stage.
  if (steps.length !== stepsRaw.length || steps.length < 8 || steps.length > 18) return null;
  if (!["story", "pattern", "example", "drill", "listening", "writing", "speaking"].every((type) => steps.some((s) => s.type === type))) return null;

  // Guarantee a closing victory step.
  if (!steps.some((s) => s.type === "victory")) {
    steps.push({
      type: "victory",
      title: "Mini Victory!",
      body: "Hebat! Kamu menyelesaikan pelajaran hari ini.",
      achievements: ["Pelajaran selesai.", "Latihan tercatat di progresmu."],
    });
  }

  const goal = Array.isArray(o.goal)
    ? o.goal.filter((g): g is string => typeof g === "string").slice(0, 4)
    : input.goal;

  return {
    day: input.day,
    subLevel: input.subLevel,
    title: str(o.title) ?? input.theme,
    goal: goal.length ? goal : input.goal,
    estimatedMinutes: typeof o.estimatedMinutes === "number" && Number.isFinite(o.estimatedMinutes) ? Math.min(60, Math.max(10, o.estimatedMinutes)) : 35,
    steps,
  };
}
