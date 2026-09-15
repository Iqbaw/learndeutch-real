import type { LessonStep } from "@/types";

export interface AssessmentResult {
  status: "correct" | "needs-work" | "ungraded";
  feedback: string;
  source: "answer-key" | "ai" | "unavailable";
  checks: { criterion: string; met: boolean }[];
}

// Keep meaningful German letters and word order. No edit-distance passes:
// "kein" / "ein", "schon" / "schön" and "können" / "kennen" differ in meaning.
export function normalizeAnswer(value: string): string {
  return value.normalize("NFC").toLocaleLowerCase("de")
    .replace(/[.,!?;:„“”"']/g, "").replace(/\s+/g, " ").trim();
}

export function assessLocally(answer: string, task: Pick<LessonStep, "expected" | "acceptedAnswers" | "assessment" | "keywords">): AssessmentResult {
  const target = normalizeAnswer(answer);
  const matches = [task.expected, ...(task.acceptedAnswers ?? [])]
    .filter((s): s is string => Boolean(s)).some((s) => normalizeAnswer(s) === target);
  if (target && matches && task.assessment !== "open" && !task.keywords?.length) return {
    status: "correct", source: "answer-key", checks: [],
    feedback: "Jawaban sesuai salah satu contoh yang diterima. Perhatikan juga huruf besar pada kata benda dan awal kalimat.",
  };
  if (task.assessment === "open" || task.keywords?.length) return {
    status: "ungraded", source: "unavailable", checks: [],
    feedback: "Jawabanmu tersimpan untuk latihan. Pemeriksaan otomatis belum tersedia; bandingkan isi dengan kriteria dan contoh. Jawaban yang berbeda dari contoh belum tentu salah.",
  };
  return { status: "needs-work", source: "answer-key", checks: [],
    feedback: "Jawaban belum cocok dengan kunci latihan ini. Bandingkan bentuk kata, urutan, dan ejaannya. Untuk ungkapan lain yang juga benar, mintalah tinjauan pengajar.",
  };
}

export function parseAssessment(raw: unknown, criteria: string[]): AssessmentResult | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!["correct", "needs-work", "ungraded"].includes(String(r.status)) || typeof r.feedback !== "string" || !r.feedback.trim()) return null;
  if (!Array.isArray(r.checks) || r.checks.length !== criteria.length) return null;
  const checks = r.checks as { criterion: string; met: boolean }[];
  if (checks.some((c, i) => !c || c.criterion !== criteria[i] || typeof c.met !== "boolean")) return null;
  if (r.status === "correct" && checks.some((c) => !c.met)) return null;
  return { status: r.status as AssessmentResult["status"], feedback: r.feedback.slice(0, 1500), source: "ai", checks };
}

export async function assessResponse(answer: string, task: LessonStep): Promise<AssessmentResult> {
  const local = assessLocally(answer, task);
  if (local.status !== "ungraded") return local;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 35000);
  try {
    const res = await fetch("/api/assessment", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer, prompt: task.prompt, expected: task.expected, criteria: task.criteria ?? [] }), signal: controller.signal });
    if (!res.ok) return local;
    return parseAssessment(await res.json(), task.criteria ?? []) ?? local;
  } catch { return local; } finally { clearTimeout(timer); }
}
