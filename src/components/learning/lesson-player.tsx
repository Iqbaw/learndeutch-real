"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Lightbulb,
  PenLine,
  Volume2,
  Mic,
  KeyRound,
  AlertTriangle,
  PartyPopper,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import type { Lesson, LessonStep, LessonStepType, Skill, ErrorCategory } from "@/types";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { playSound } from "@/lib/sound";
import { speak } from "@/lib/speech";
import { CTAButton } from "@/components/ui/cta-button";
import { FormattedText } from "@/components/ui/formatted-text";
import { FormulaBlock } from "@/components/ui/formula-block";
import { ListenButton } from "@/components/ui/listen-button";
import { ExerciseCard } from "./exercise-card";
import { TokenSentence } from "./token-sentence";
import { ProductionTask } from "./production-task";
import { useLearningEvidence } from "@/lib/learning-evidence";

function stepSkill(type: LessonStepType): Skill {
  switch (type) {
    case "listening":
      return "Listening";
    case "speaking":
      return "Speaking";
    case "writing":
      return "Writing";
    default:
      return "Grammar";
  }
}

function stepCategory(type: LessonStepType): ErrorCategory {
  switch (type) {
    case "listening":
      return "Listening";
    case "speaking":
      return "Speaking";
    default:
      return "Grammar";
  }
}

const stepIcon: Record<LessonStepType, typeof BookOpen> = {
  story: BookOpen,
  pattern: Lightbulb,
  example: Sparkles,
  drill: KeyRound,
  listening: Volume2,
  speaking: Mic,
  writing: PenLine,
  mistake: AlertTriangle,
  victory: PartyPopper,
};

export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const profile = useAppStore((s) => s.profile);
  // A regenerated AI lesson must not inherit a different lesson's step position.
  const fingerprint = JSON.stringify(lesson.steps).split("").reduce((hash, char) => Math.imul(hash, 31) + char.charCodeAt(0) | 0, 0);
  const progressId = [lesson.subLevel, lesson.day, profile?.goal, fingerprint].join("-");
  const savePosition = useLearningEvidence((s) => s.savePosition);
  const recordMission = useLearningEvidence((s) => s.record);
  const [index, setIndex] = useState(() => Math.min(useLearningEvidence.getState().positions[progressId] ?? 0, lesson.steps.length - 1));
  const attempted = useRef(new Set<number>());
  const [done, setDone] = useState(false);
  const [answered, setAnswered] = useState(false);

  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const recordError = useAppStore((s) => s.recordError);
  const recordSpeaking = useAppStore((s) => s.recordSpeaking);
  const completeLesson = useAppStore((s) => s.completeLesson);
  const completedRef = useRef(false);

  const total = lesson.steps.length;
  const step = lesson.steps[index];
  const progress = Math.round(((index + (done ? 1 : 0)) / total) * 100);
  const isLast = index === total - 1;

  // Typed (writing) steps must be checked with "Periksa" before moving on.
  const mustCheckFirst = !!step.exercise || (["writing", "speaking"].includes(step.type) && !!step.prompt);
  const blockNext = mustCheckFirst && !answered;

  // reset the "answered" gate whenever the step changes
  useEffect(() => {
    setAnswered(attempted.current.has(index));
    savePosition(progressId, index);
  }, [index, progressId, savePosition]);

  // record the completed lesson exactly once when the user reaches the end
  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      completeLesson(lesson.day, { xp: 50, subLevel: lesson.subLevel });
      savePosition(progressId, 0);
    }
  }, [done, completeLesson, lesson.day, lesson.subLevel, savePosition, progressId]);

  function handleExercise(
    type: LessonStepType,
    correct: boolean,
    info: { userAnswer: string; correctAnswer: string; explanation: string }
  ) {
    setAnswered(true);
    if (attempted.current.has(index)) return;
    attempted.current.add(index);
    recordAnswer(stepSkill(type), correct);
    if (!correct) {
      recordError({ ...info, category: stepCategory(type) });
    }
  }

  function handleSpeak() {
    setAnswered(true);
    if (!attempted.current.has(index)) recordSpeaking();
    attempted.current.add(index);
  }

  function next() {
    if (isLast) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl flex-col px-4 py-6 sm:px-6">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted hover:text-ink focusable"
          aria-label="Kembali ke dashboard"
        >
          <X className="h-5 w-5" />
        </Link>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-elevated">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <span className="font-mono text-xs font-bold text-muted">
          {Math.min(index + 1, total)}/{total}
        </span>
      </div>

      {/* Step content */}
      <div className="flex flex-1 flex-col justify-center py-6">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              <StepView
                step={step}
                draftId={`${progressId}-${index}`}
                onMission={(result, answer) => {
                  if (step.missionId) recordMission(step.missionId, lesson.day, profile?.goal ?? "", answer, result);
                }}
                onExercise={(correct, info) => handleExercise(step.type, correct, info)}
                onSpeak={handleSpeak}
                onWritten={() => setAnswered(true)}
              />
            </motion.div>
          ) : (
            <VictoryView lesson={lesson} />
          )}
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      {!done && (
        <div className="sticky bottom-0 flex flex-col gap-2 border-t border-border bg-bg/90 py-4 backdrop-blur">
          {blockNext && (
            <p className="text-center text-xs font-medium text-muted">
              Selesaikan percobaan latihan ini sebelum lanjut. Jawaban tidak harus langsung benar.
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-muted hover:text-ink disabled:opacity-40 focusable"
            >
              <ArrowLeft className="h-4 w-4" /> Sebelumnya
            </button>
            <CTAButton onClick={next} size="lg" disabled={blockNext}>
              {isLast ? "Selesai" : "Lanjut"} <ArrowRight className="h-5 w-5" />
            </CTAButton>
          </div>
        </div>
      )}
    </div>
  );
}

function StepBadge({ type, title }: { type: LessonStepType; title: string }) {
  const Icon = stepIcon[type];
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span className="font-heading text-sm font-bold uppercase tracking-wide text-muted">
        {title}
      </span>
    </div>
  );
}

function StepView({
  step,
  draftId,
  onMission,
  onExercise,
  onSpeak,
  onWritten,
}: {
  step: LessonStep;
  draftId: string;
  onMission: (result: import("@/lib/assessment").AssessmentResult, answer: string) => void;
  onExercise?: (
    correct: boolean,
    info: { userAnswer: string; correctAnswer: string; explanation: string }
  ) => void;
  onSpeak?: (passed: boolean) => void;
  onWritten?: () => void;
}) {
  return (
    <div>
      <StepBadge type={step.type} title={step.title} />

      {step.body && step.type !== "mistake" && step.type !== "victory" && (
        <p className="text-lg leading-relaxed text-ink">
          <FormattedText text={step.body} />
        </p>
      )}

      {step.formula && (
        <div className="mt-4 rounded-2xl bg-elevated p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Rumus</p>
          <FormulaBlock formula={step.formula} />
        </div>
      )}

      {step.tokens && (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <TokenSentence tokens={step.tokens} />
        </div>
      )}

      {step.type !== "listening" && (step.german || step.indonesian) && (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          {step.german && (
            <p className="font-heading text-xl font-extrabold text-ink">{step.german}</p>
          )}
          {step.indonesian && (
            <p className="mt-1 text-muted">
              <FormattedText text={step.indonesian} />
            </p>
          )}
        </div>
      )}

      {step.type === "listening" && step.exercise?.audioText && (
        <HoerenBlock text={step.exercise.audioText!} />
      )}

      {step.exercise && (
        <div className="mt-5">
          <ExerciseCard exercise={step.exercise} onAnswered={onExercise} />
        </div>
      )}

      {(step.type === "speaking" || step.type === "writing") && step.prompt && (
        <ProductionTask task={step} draftId={draftId} onComplete={(result, answer, spoken) => {
          // Only independent, graded WRITING contributes to writing accuracy.
          // Speech recognition is not acoustic assessment.
          if (spoken) onSpeak?.(result.status === "correct");
          else if (step.type === "writing" && result.status !== "ungraded") onExercise?.(result.status === "correct", {
            userAnswer: answer, correctAnswer: step.expected ?? "", explanation: result.feedback,
          });
          onMission(result, answer);
          onWritten?.();
        }} />
      )}

      {step.type === "mistake" && <MistakeStep step={step} />}

      {step.type === "victory" && step.achievements && (
        <VictoryInline achievements={step.achievements} body={step.body} />
      )}
    </div>
  );
}

function MistakeStep({ step }: { step: LessonStep }) {
  return (
    <div className="mt-2 space-y-4">
      {step.body && <p className="text-lg leading-relaxed text-ink"><FormattedText text={step.body} /></p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold text-danger">
            <X className="h-4 w-4" /> {step.contrastLabels?.before ?? "Sering salah"}
          </p>
          <p className="mt-1 font-body text-ink">{step.wrong}</p>
        </div>
        <div className="rounded-2xl border border-success/30 bg-success/10 p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold text-success">
            <Check className="h-4 w-4" /> {step.contrastLabels?.after ?? "Yang benar"}
          </p>
          <p className="mt-1 font-body font-bold text-ink">{step.correct}</p>
        </div>
      </div>
    </div>
  );
}

function VictoryInline({ achievements, body }: { achievements: string[]; body?: string }) {
  // De-duplicate: drop achievements that just repeat the body or each other,
  // which is what caused the "doubled sentence" in the Mini Victory.
  const norm = (s: string) => s.trim().toLowerCase().replace(/[.!]+$/, "");
  const seen = new Set<string>();
  if (body) seen.add(norm(body));
  const uniqueAchievements = achievements.filter((a) => {
    const k = norm(a);
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return (
    <div className="mt-2 space-y-4">
      {body && <p className="text-lg leading-relaxed text-ink"><FormattedText text={body} /></p>}
      {uniqueAchievements.length > 0 && (
        <ul className="space-y-2">
          {uniqueAchievements.map((a, i) => (
            <li key={i} className="flex items-start gap-2 rounded-xl bg-success/10 p-3 text-sm text-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> <FormattedText text={a} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function VictoryView({ lesson }: { lesson: Lesson }) {
  useEffect(() => {
    playSound("complete");
  }, []);

  return (
    <motion.div
      key="lesson-done"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="card-base p-8 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-soft text-secondary">
        <PartyPopper className="h-9 w-9" />
      </div>
      <h2 className="mt-4 font-heading text-2xl font-extrabold text-ink">
        Hari {lesson.day} Selesai! 🎉
      </h2>
      <p className="mt-2 text-muted">
        Sesi latihan selesai. Hasil misi tersimpan terpisah dari penyelesaian hari.
        Kembali ke Review untuk mencoba tugas baru setelah jeda. Jawaban yang belum
        dinilai tidak dihitung sebagai penguasaan.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <CTAButton href="/dashboard" size="lg" className="flex-1">
          Kembali ke Dashboard
        </CTAButton>
        <CTAButton href="/roadmap" variant="outline" size="lg" className="flex-1">
          Lihat Roadmap
        </CTAButton>
      </div>
    </motion.div>
  );
}


// Hören (listening) audio block — plays the clip (auto + replay) and hides the
// transcript so the learner truly practises listening.
function HoerenBlock({ text }: { text: string }) {
  useEffect(() => {
    const t = setTimeout(() => speak(text), 300);
    return () => clearTimeout(t);
  }, [text]);
  return (
    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary-soft/40 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-onprimary">
        <Volume2 className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-heading text-sm font-bold text-ink">Dengarkan</p>
        <p className="text-xs text-muted">Putar audionya, lalu jawab. Teks sengaja disembunyikan.</p>
      </div>
      <ListenButton text={text} label="Putar" />
    </div>
  );
}
