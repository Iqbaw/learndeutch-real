"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { CTAButton } from "@/components/ui/cta-button";
import { useAppStore, type OnboardingAnswers } from "@/lib/store";
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

// step 0 = name, steps 1..N = option questions
const TOTAL_STEPS = questions.length + 1;

export default function OnboardingPage() {
  const { onboarding, setOnboardingAnswer, completeOnboarding, setDailyTarget } = useAppStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(onboarding.name ?? "");
  const [showResult, setShowResult] = useState(false);

  const progress = showResult ? 100 : Math.round((step / TOTAL_STEPS) * 100);

  function finish() {
    setDailyTarget(parseInt(onboarding.dailyTime ?? "30", 10));
    completeOnboarding({
      name: (onboarding.name ?? name).trim() || "Pelajar",
      goal: onboarding.goal ?? "Hobi",
      startLevel: "A1.1",
      weakSkill: onboarding.weakSkill ?? "Belum tahu",
      learningStyle: onboarding.learningStyle ?? "Campuran",
      createdAt: new Date().toISOString(),
    });
    setShowResult(true);
  }

  function submitName() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setOnboardingAnswer("name", trimmed);
    setStep(1);
  }

  function pick(question: Question, value: string) {
    setOnboardingAnswer(question.key, value);
    setTimeout(() => {
      if (step < TOTAL_STEPS - 1) {
        setStep((s) => s + 1);
      } else {
        // last question answered — build the profile from these real answers
        setDailyTarget(parseInt((question.key === "dailyTime" ? value : onboarding.dailyTime) ?? "30", 10));
        completeOnboarding({
          name: (onboarding.name ?? name).trim() || "Pelajar",
          goal: question.key === "goal" ? value : onboarding.goal ?? "Hobi",
          startLevel: "A1.1",
          weakSkill: question.key === "weakSkill" ? value : onboarding.weakSkill ?? "Belum tahu",
          learningStyle:
            question.key === "learningStyle" ? value : onboarding.learningStyle ?? "Campuran",
          createdAt: new Date().toISOString(),
        });
        setShowResult(true);
      }
    }, 200);
  }

  const currentQuestion = step >= 1 ? questions[step - 1] : null;

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
            {showResult ? "Selesai" : `Langkah ${step + 1} dari ${TOTAL_STEPS}`}
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
            {showResult ? (
              <ResultCard answers={onboarding} fallbackName={name} />
            ) : step === 0 ? (
              <motion.div
                key="name"
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitName();
                  }}
                  className="mt-6"
                >
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
            ) : currentQuestion ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> Konsultasi dengan mentor
                </span>
                <h1 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                  {currentQuestion.title}
                </h1>
                <p className="mt-1 text-muted">{currentQuestion.subtitle}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {currentQuestion.options.map((opt) => {
                    const Icon = opt.icon;
                    const active = onboarding[currentQuestion.key] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => pick(currentQuestion, opt.value)}
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
                  onClick={() => setStep((s) => s - 1)}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink focusable rounded-lg"
                >
                  <ArrowLeft className="h-4 w-4" /> Kembali
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ answers, fallbackName }: { answers: OnboardingAnswers; fallbackName: string }) {
  const time = answers.dailyTime ?? "30";
  const weak =
    answers.weakSkill && answers.weakSkill !== "Belum tahu"
      ? answers.weakSkill.toLowerCase()
      : "speaking";
  const name = answers.name ?? fallbackName ?? "Pelajar";

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="card-base p-6 sm:p-8"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h2 className="mt-4 font-heading text-2xl font-extrabold tracking-tight text-ink">
        {name}, Personal German Roadmap-mu siap!
      </h2>
      <p className="mt-2 text-muted">
        Kamu cocok mulai dari <span className="font-bold text-primary">A1.1</span>. Target
        realistis kamu adalah menyelesaikan A1 dalam <span className="font-bold">30 hari</span>{" "}
        dengan durasi <span className="font-bold">{time} menit per hari</span>. Fokus tambahan:{" "}
        <span className="font-bold">{weak}</span> dan artikel der/die/das.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-elevated p-4">
          <Target className="h-5 w-5 text-primary" />
          <p className="mt-2 font-heading text-lg font-extrabold text-ink">A1.1</p>
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

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <CTAButton href="/dashboard" size="lg" className="flex-1">
          Masuk ke Dashboard <ArrowRight className="h-5 w-5" />
        </CTAButton>
        <CTAButton href="/lesson" variant="outline" size="lg" className="flex-1">
          Mulai Hari 1
        </CTAButton>
      </div>
    </motion.div>
  );
}
