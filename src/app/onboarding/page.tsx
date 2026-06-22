"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Hammer,
  Award,
  Heart,
  Plane,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Target,
  Clock,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
} from "lucide-react";
import { CTAButton } from "@/components/ui/cta-button";
import { LevelBadge } from "@/components/ui/level-badge";
import { FormattedText } from "@/components/ui/formatted-text";
import { useAppStore, type OnboardingAnswers, type Profile } from "@/lib/store";
import { playSound } from "@/lib/sound";
import { placementQuestions, evaluatePlacement, type PlacementOutcome } from "@/data/placement";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  icon?: typeof GraduationCap;
}

interface Question {
  key: keyof OnboardingAnswers;
  title: string;
  subtitle: string;
  options: Option[];
}

const questions: Question[] = [
  {
    key: "goal",
    title: "Apa tujuan belajarmu?",
    subtitle: "Supaya kami bisa menyesuaikan fokus materimu.",
    options: [
      { value: "Kuliah", label: "Kuliah di Jerman", icon: GraduationCap },
      { value: "Ausbildung", label: "Ausbildung", icon: Hammer },
      { value: "Kerja", label: "Kerja di Jerman", icon: Briefcase },
      { value: "Ujian", label: "Ujian Goethe/telc", icon: Award },
      { value: "Hobi", label: "Hobi", icon: Heart },
      { value: "Pindah", label: "Pindah ke Jerman", icon: Plane },
    ],
  },
  {
    key: "level",
    title: "Level kamu saat ini?",
    subtitle: "Jujur saja, ini membantu kami menempatkanmu dengan tepat.",
    options: [
      { value: "Nol total", label: "Nol total" },
      { value: "Sedikit", label: "Pernah belajar sedikit" },
      { value: "A1", label: "Sudah A1" },
      { value: "A2", label: "Sudah A2" },
      { value: "Tidak tahu", label: "Tidak tahu" },
    ],
  },
  {
    key: "dailyTime",
    title: "Berapa lama bisa belajar per hari?",
    subtitle: "Target realistis lebih baik daripada ambisius tapi berhenti.",
    options: [
      { value: "15", label: "15 menit" },
      { value: "30", label: "30 menit" },
      { value: "45", label: "45 menit" },
      { value: "60", label: "60 menit" },
      { value: "90", label: "90 menit" },
    ],
  },
  {
    key: "weakSkill",
    title: "Skill apa yang paling lemah?",
    subtitle: "Kami akan memberi latihan tambahan di sini.",
    options: [
      { value: "Grammar", label: "Grammar" },
      { value: "Speaking", label: "Speaking" },
      { value: "Listening", label: "Listening" },
      { value: "Vocabulary", label: "Vocabulary" },
      { value: "Writing", label: "Writing" },
      { value: "Belum tahu", label: "Belum tahu" },
    ],
  },
  {
    key: "learningStyle",
    title: "Gaya belajar yang kamu suka?",
    subtitle: "Kami sesuaikan tampilan materimu.",
    options: [
      { value: "Gambar", label: "Banyak gambar" },
      { value: "Latihan", label: "Banyak latihan" },
      { value: "Detail", label: "Penjelasan detail" },
      { value: "Praktik", label: "Langsung praktik" },
      { value: "Campuran", label: "Campuran" },
    ],
  },
];

type Phase = "profile" | "placementIntro" | "placement" | "result";

export default function OnboardingPage() {
  const { onboarding, setOnboardingAnswer, completeOnboarding, setDailyTarget } = useAppStore();
  const [phase, setPhase] = useState<Phase>("profile");
  const [step, setStep] = useState(0); // 0 = name, 1..5 = questions
  const [name, setName] = useState(onboarding.name ?? "");
  const [pIndex, setPIndex] = useState(0);
  const [pCorrect, setPCorrect] = useState<boolean[]>([]);
  const [outcome, setOutcome] = useState<PlacementOutcome | null>(null);

  const totalProfileSteps = questions.length + 1;
  const currentQuestion = step >= 1 ? questions[step - 1] : null;

  // overall progress across the whole onboarding
  const progress =
    phase === "result"
      ? 100
      : phase === "placement"
      ? 60 + Math.round((pIndex / placementQuestions.length) * 35)
      : phase === "placementIntro"
      ? 58
      : Math.round((step / totalProfileSteps) * 55);

  function submitName() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setOnboardingAnswer("name", trimmed);
    setStep(1);
  }

  function pickProfile(question: Question, value: string) {
    setOnboardingAnswer(question.key, value);
    if (question.key === "dailyTime") setDailyTarget(parseInt(value, 10));
    setTimeout(() => {
      if (step < totalProfileSteps - 1) {
        setStep((s) => s + 1);
      } else {
        setPhase("placementIntro");
      }
    }, 180);
  }

  function answerPlacement(correct: boolean) {
    const next = [...pCorrect, correct];
    setPCorrect(next);
    setTimeout(() => {
      if (pIndex < placementQuestions.length - 1) {
        setPIndex((i) => i + 1);
      } else {
        finishPlacement(next);
      }
    }, 220);
  }

  function finishPlacement(correctFlags: boolean[]) {
    const result = evaluatePlacement(correctFlags, onboarding.level);
    setOutcome(result);
    setPhase("result");
    playSound("levelup");
  }

  function skipPlacement() {
    // No quiz — estimate purely from self-reported level
    const result = evaluatePlacement([], onboarding.level);
    setOutcome(result);
    setPhase("result");
    playSound("levelup");
  }

  function finishOnboarding(startDay: number, startLevel: Profile["startLevel"]) {
    setDailyTarget(parseInt(onboarding.dailyTime ?? "30", 10));
    completeOnboarding(
      {
        name: (onboarding.name ?? name).trim() || "Pelajar",
        goal: onboarding.goal ?? "Hobi",
        startLevel,
        weakSkill: onboarding.weakSkill ?? "Belum tahu",
        learningStyle: onboarding.learningStyle ?? "Campuran",
        createdAt: new Date().toISOString(),
      },
      startDay
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 focusable rounded-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-heading text-lg font-extrabold text-white dark:text-bg">
              D
            </span>
            <span className="font-heading text-sm font-extrabold text-ink">Deutsch 30</span>
          </Link>
          <span className="text-sm text-muted">
            {phase === "result"
              ? "Selesai"
              : phase === "placement"
              ? `Tes ${pIndex + 1}/${placementQuestions.length}`
              : phase === "placementIntro"
              ? "Tes penempatan"
              : `Langkah ${step + 1}/${totalProfileSteps}`}
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-elevated">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="flex flex-1 flex-col justify-center py-8">
          <AnimatePresence mode="wait">
            {phase === "result" && outcome ? (
              <ResultCard
                key="result"
                outcome={outcome}
                answers={onboarding}
                fallbackName={name}
                onStart={finishOnboarding}
              />
            ) : phase === "placementIntro" ? (
              <PlacementIntro key="pintro" onStart={() => setPhase("placement")} onSkip={skipPlacement} />
            ) : phase === "placement" ? (
              <PlacementQuiz
                key={`pq-${pIndex}`}
                index={pIndex}
                onAnswer={answerPlacement}
              />
            ) : step === 0 ? (
              <NameStep key="name" name={name} setName={setName} onSubmit={submitName} />
            ) : currentQuestion ? (
              <ProfileStep
                key={step}
                question={currentQuestion}
                selected={onboarding[currentQuestion.key]}
                onPick={(v) => pickProfile(currentQuestion, v)}
                onBack={() => setStep((s) => s - 1)}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function NameStep({ name, setName, onSubmit }: { name: string; setName: (s: string) => void; onSubmit: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
        <Sparkles className="h-3.5 w-3.5" /> Konsultasi dengan mentor
      </span>
      <h1 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Siapa namamu?
      </h1>
      <p className="mt-1 text-muted">Kami ingin menyapamu dengan benar selama belajar.</p>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="mt-6">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tulis namamu..."
          className="w-full rounded-2xl border border-border bg-card px-4 py-4 font-heading text-lg font-bold text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <CTAButton type="submit" size="lg" className="mt-4 w-full">
          Lanjut <ArrowRight className="h-5 w-5" />
        </CTAButton>
      </form>
    </motion.div>
  );
}

function ProfileStep({
  question,
  selected,
  onPick,
  onBack,
}: {
  question: Question;
  selected?: string;
  onPick: (value: string) => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
        <Sparkles className="h-3.5 w-3.5" /> Konsultasi dengan mentor
      </span>
      <h1 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {question.title}
      </h1>
      <p className="mt-1 text-muted">{question.subtitle}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {question.options.map((opt) => {
          const Icon = opt.icon;
          const active = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPick(opt.value)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-4 text-left font-heading font-bold transition-all focusable",
                active
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-card text-ink hover:border-primary hover:bg-primary-soft/40"
              )}
            >
              {Icon && <Icon className="h-5 w-5 shrink-0 text-primary" />}
              {opt.label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink focusable rounded-lg"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </button>
    </motion.div>
  );
}

function PlacementIntro({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="card-base p-6 sm:p-8"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <ClipboardCheck className="h-7 w-7" />
      </div>
      <h1 className="mt-4 font-heading text-2xl font-extrabold tracking-tight text-ink">
        Tes Penempatan Singkat
      </h1>
      <p className="mt-2 text-muted">
        8 pertanyaan singkat (sekitar 2 menit) untuk menentukan level awalmu dengan akurat.
        Tidak apa-apa kalau belum tahu jawabannya — pilih saja yang menurutmu paling tepat.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <CTAButton onClick={onStart} size="lg" className="flex-1">
          Mulai Tes <ArrowRight className="h-5 w-5" />
        </CTAButton>
        <CTAButton onClick={onSkip} variant="outline" size="lg" className="flex-1">
          Lewati (mulai dari awal)
        </CTAButton>
      </div>
    </motion.div>
  );
}

function PlacementQuiz({ index, onAnswer }: { index: number; onAnswer: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const q = placementQuestions[index];

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    playSound("tap");
    onAnswer(i === q.correctIndex);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.22 }}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-soft px-3 py-1 text-xs font-bold text-secondary">
        <Gauge className="h-3.5 w-3.5" /> Tes Penempatan
      </span>
      <h1 className="mt-3 font-heading text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
        {q.prompt}
      </h1>
      <div className="mt-6 grid gap-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            data-no-sound
            onClick={() => choose(i)}
            disabled={picked !== null}
            className={cn(
              "rounded-2xl border px-4 py-4 text-left font-body text-ink transition-all focusable",
              picked === null
                ? "border-border bg-card hover:border-primary hover:bg-primary-soft/40"
                : i === picked
                ? "border-primary bg-primary-soft"
                : "border-border bg-card opacity-60"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted">
        Pilih jawaban yang menurutmu paling tepat. Tidak ada nilai minus.
      </p>
    </motion.div>
  );
}

function ResultCard({
  outcome,
  answers,
  fallbackName,
  onStart,
}: {
  outcome: PlacementOutcome;
  answers: OnboardingAnswers;
  fallbackName: string;
  onStart: (startDay: number, startLevel: Profile["startLevel"]) => void;
}) {
  const router = useRouter();
  const time = answers.dailyTime ?? "30";
  const weak =
    answers.weakSkill && answers.weakSkill !== "Belum tahu"
      ? answers.weakSkill.toLowerCase()
      : "speaking";
  const name = answers.name ?? fallbackName ?? "Pelajar";

  function go(startDay: number, startLevel: Profile["startLevel"]) {
    onStart(startDay, startLevel);
    router.push("/dashboard");
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="card-base p-6 sm:p-8"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h2 className="mt-4 font-heading text-2xl font-extrabold tracking-tight text-ink">
        {name}, level awalmu sudah ditentukan!
      </h2>

      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-elevated p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-extrabold text-white dark:text-bg">
          <span className="font-heading">{outcome.estimatedLevel}</span>
        </div>
        <div className="flex-1">
          <p className="font-heading font-bold text-ink">Estimasi level: {outcome.estimatedLevel}</p>
          <p className="text-sm text-muted">Skor tes penempatan: {outcome.scorePct}%</p>
        </div>
      </div>

      <p className="mt-4 text-muted"><FormattedText text={outcome.summary} /></p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-elevated p-4">
          <Target className="h-5 w-5 text-primary" />
          <p className="mt-2 font-heading text-lg font-extrabold text-ink">{outcome.startLevel}</p>
          <p className="text-xs text-muted">Titik mulai</p>
        </div>
        <div className="rounded-2xl bg-elevated p-4">
          <Clock className="h-5 w-5 text-secondary" />
          <p className="mt-2 font-heading text-lg font-extrabold text-ink">{time} mnt</p>
          <p className="text-xs text-muted">Target harian</p>
        </div>
        <div className="rounded-2xl bg-elevated p-4">
          <Sparkles className="h-5 w-5 text-success" />
          <p className="mt-2 font-heading text-lg font-extrabold capitalize text-ink">{weak}</p>
          <p className="text-xs text-muted">Fokus tambahan</p>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3">
        {outcome.canSkip ? (
          <>
            <CTAButton onClick={() => go(outcome.recommendedDay, outcome.startLevel)} size="lg" className="w-full">
              Lompat ke {outcome.startLevel} (Hari {outcome.recommendedDay}) <ArrowRight className="h-5 w-5" />
            </CTAButton>
            <CTAButton onClick={() => go(1, "A1.1")} variant="outline" size="lg" className="w-full">
              Mulai dari fondasi (Hari 1)
            </CTAButton>
          </>
        ) : (
          <CTAButton onClick={() => go(1, outcome.startLevel)} size="lg" className="w-full">
            Masuk ke Dashboard <ArrowRight className="h-5 w-5" />
          </CTAButton>
        )}
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
          <LevelBadge level={outcome.estimatedLevel} /> Levelmu akan terus diperbarui otomatis seiring kamu belajar.
        </p>
      </div>
    </motion.div>
  );
}
