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
import { CTAButton } from "@/components/ui/cta-button";
import { ExerciseCard } from "./exercise-card";
import { TokenSentence } from "./token-sentence";
import { SpeechPractice } from "./speech-practice";

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
      return "Pronunciation";
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
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const recordError = useAppStore((s) => s.recordError);
  const recordSpeaking = useAppStore((s) => s.recordSpeaking);
  const completeLesson = useAppStore((s) => s.completeLesson);
  const completedRef = useRef(false);

  const total = lesson.steps.length;
  const step = lesson.steps[index];
  const progress = Math.round(((index + (done ? 1 : 0)) / total) * 100);
  const isLast = index === total - 1;

  // record the completed lesson exactly once when the user reaches the end
  useEffect(() => {
    if (done && !completedRef.current) {
      completedRef.current = true;
      completeLesson(lesson.day, { xp: 50, subLevel: lesson.subLevel });
    }
  }, [done, completeLesson, lesson.day, lesson.subLevel]);

  function handleExercise(
    type: LessonStepType,
    correct: boolean,
    info: { userAnswer: string; correctAnswer: string; explanation: string }
  ) {
    recordAnswer(stepSkill(type), correct);
    if (!correct) {
      recordError({ ...info, category: stepCategory(type) });
    }
  }

  function handleSpeak(passed: boolean) {
    recordSpeaking();
    recordAnswer("Speaking", passed);
    recordAnswer("Pronunciation", passed);
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
                onExercise={(correct, info) => handleExercise(step.type, correct, info)}
                onSpeak={handleSpeak}
              />
            </motion.div>
          ) : (
            <VictoryView lesson={lesson} />
          )}
        </AnimatePresence>
      </div>

      {/* Footer nav */}
      {!done && (
        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-border bg-bg/90 py-4 backdrop-blur">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-muted hover:text-ink disabled:opacity-40 focusable"
          >
            <ArrowLeft className="h-4 w-4" /> Sebelumnya
          </button>
          <CTAButton onClick={next} size="lg">
            {isLast ? "Selesai" : "Lanjut"} <ArrowRight className="h-5 w-5" />
          </CTAButton>
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
  onExercise,
  onSpeak,
}: {
  step: LessonStep;
  onExercise?: (
    correct: boolean,
    info: { userAnswer: string; correctAnswer: string; explanation: string }
  ) => void;
  onSpeak?: (passed: boolean) => void;
}) {
  return (
    <div>
      <StepBadge type={step.type} title={step.title} />

      {step.body && step.type !== "mistake" && (
        <p className="text-lg leading-relaxed text-ink">{step.body}</p>
      )}

      {step.formula && (
        <div className="mt-4 rounded-2xl bg-elevated p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Rumus</p>
          <p className="mt-1 font-mono text-base text-ink">{step.formula}</p>
        </div>
      )}

      {step.tokens && (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <TokenSentence tokens={step.tokens} />
        </div>
      )}

      {(step.german || step.indonesian) && (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          {step.german && (
            <p className="font-heading text-xl font-extrabold text-ink">{step.german}</p>
          )}
          {step.indonesian && <p className="mt-1 text-muted">{step.indonesian}</p>}
        </div>
      )}

      {step.exercise && (
        <div className="mt-5">
          <ExerciseCard exercise={step.exercise} onAnswered={onExercise} />
        </div>
      )}

      {(step.type === "speaking" || step.type === "writing") && step.prompt && (
        <InputStep step={step} onSpeak={onSpeak} />
      )}

      {step.type === "mistake" && <MistakeStep step={step} />}

      {step.type === "victory" && step.achievements && (
        <VictoryInline achievements={step.achievements} body={step.body} />
      )}
    </div>
  );
}

function InputStep({ step, onSpeak }: { step: LessonStep; onSpeak?: (passed: boolean) => void }) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const speaking = step.type === "speaking";

  return (
    <div className="mt-4">
      <p className="rounded-2xl bg-primary-soft/60 p-4 font-heading text-lg font-bold text-ink">
        {step.prompt}
      </p>
      {step.body && <p className="mt-2 text-sm text-muted">{step.body}</p>}

      {speaking ? (
        <SpeechPractice expected={step.expected ?? step.prompt ?? ""} onResult={onSpeak} className="mt-4" />
      ) : (
        <div className="mt-4">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ketik jawabanmu di sini..."
            rows={2}
            className="w-full rounded-2xl border border-border bg-card p-4 font-body text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <CTAButton onClick={() => setSubmitted(true)} variant="outline" size="sm" className="mt-2">
            Periksa
          </CTAButton>
        </div>
      )}

      {!speaking && submitted && step.expected && (
        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-success/30 bg-success/10 p-4 text-sm text-success animate-fade-up">
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <span className="font-bold">Contoh jawaban: </span>
            {step.expected}
          </p>
        </div>
      )}
    </div>
  );
}

function MistakeStep({ step }: { step: LessonStep }) {
  return (
    <div className="mt-2 space-y-4">
      {step.body && <p className="text-lg leading-relaxed text-ink">{step.body}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold text-danger">
            <X className="h-4 w-4" /> Sering salah
          </p>
          <p className="mt-1 font-body text-ink">{step.wrong}</p>
        </div>
        <div className="rounded-2xl border border-success/30 bg-success/10 p-4">
          <p className="flex items-center gap-1.5 text-xs font-bold text-success">
            <Check className="h-4 w-4" /> Yang benar
          </p>
          <p className="mt-1 font-body font-bold text-ink">{step.correct}</p>
        </div>
      </div>
    </div>
  );
}

function VictoryInline({ achievements, body }: { achievements: string[]; body?: string }) {
  return (
    <div className="mt-2 space-y-4">
      {body && <p className="text-lg leading-relaxed text-ink">{body}</p>}
      <ul className="space-y-2">
        {achievements.map((a, i) => (
          <li key={i} className="flex items-start gap-2 rounded-xl bg-success/10 p-3 text-sm text-ink">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {a}
          </li>
        ))}
      </ul>
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
        Konsistensimu luar biasa. Kesalahanmu otomatis masuk Error Notebook, dan kosakata
        baru masuk Review Queue.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <CTAButton href="/dashboard" size="lg" className="flex-1">
          Kembali ke Dashboard
        </CTAButton>
        <CTAButton href="/review" variant="outline" size="lg" className="flex-1">
          Lanjut Review
        </CTAButton>
      </div>
    </motion.div>
  );
}
