"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  BookOpen,
  Headphones,
  Network,
  Library,
  PenLine,
  Mic,
  ArrowRight,
  Check,
  X,
  Award,
  ShieldAlert,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { CTAButton } from "@/components/ui/cta-button";
import { ExerciseCard } from "@/components/learning/exercise-card";
import { a1MockTest } from "@/data/mockTest";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ErrorCategory, Skill } from "@/types";

const sectionIcon: Record<string, typeof BookOpen> = {
  reading: BookOpen,
  listening: Headphones,
  grammar: Network,
  vocab: Library,
  writing: PenLine,
  speaking: Mic,
};

// flatten all questions across sections, keeping section reference
const flatQuestions = a1MockTest.sections.flatMap((s) =>
  s.questions.map((q) => ({ ...q, sectionId: s.id, sectionName: s.name, skill: s.skill }))
);

function categoryFromSkill(skill: string): ErrorCategory {
  switch (skill) {
    case "Listening":
      return "Listening";
    case "Vocabulary":
      return "Vocabulary";
    case "Speaking":
      return "Pronunciation";
    default:
      return "Grammar";
  }
}

type Phase = "intro" | "test" | "result";

export default function MockTestPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const recordError = useAppStore((s) => s.recordError);

  const total = flatQuestions.length;
  const current = flatQuestions[index];

  function answer(correct: boolean) {
    setAnswers((a) => ({ ...a, [index]: correct }));
    recordAnswer(current.skill as Skill, correct);
  }

  function next() {
    if (index < total - 1) setIndex((i) => i + 1);
    else setPhase("result");
  }

  return (
    <AppShell title="Mock Test" subtitle="Simulasi ujian A1 untuk mengukur kesiapanmu — Reading, Listening, Grammar, Vocabulary, Writing, Speaking.">
      <AppGuard>
        {phase === "intro" && <Intro onStart={() => setPhase("test")} />}

        {phase === "test" && current && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-soft px-2.5 py-1.5 text-xs font-bold text-primary">
                {(() => {
                  const Icon = sectionIcon[current.sectionId] ?? BookOpen;
                  return <Icon className="h-4 w-4" />;
                })()}
                {current.sectionName}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-elevated">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(index / total) * 100}%` }} />
              </div>
              <span className="font-mono text-xs font-bold text-muted">{index + 1}/{total}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.22 }}
                className="card-base p-6"
              >
                <ExerciseCard
                  exercise={current}
                  onResult={answer}
                  onAnswered={(correct, info) => {
                    if (!correct) recordError({ ...info, category: categoryFromSkill(current.skill) });
                  }}
                />
                {index in answers && (
                  <CTAButton onClick={next} className="mt-5 w-full">
                    {index === total - 1 ? "Lihat Hasil" : "Soal Berikutnya"} <ArrowRight className="h-4 w-4" />
                  </CTAButton>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {phase === "result" && <Result answers={answers} total={total} />}
      </AppGuard>
    </AppShell>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="card-base p-6 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <ClipboardCheck className="h-7 w-7" />
        </div>
        <h2 className="mt-4 font-heading text-2xl font-extrabold text-ink">{a1MockTest.title}</h2>
        <p className="mt-2 text-muted">
          Test ini meniru format kemampuan CEFR A1. Selesaikan semua bagian untuk mendapat estimasi
          level, score per skill, dan rekomendasi langkah berikutnya. Hasilnya tercatat di
          statistikmu.
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {a1MockTest.sections.map((s) => {
            const Icon = sectionIcon[s.id] ?? BookOpen;
            return (
              <div key={s.id} className="flex items-center gap-2 rounded-xl bg-elevated px-3 py-2.5">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-ink">{s.name}</span>
                <span className="ml-auto text-xs text-muted">{s.questions.length} soal</span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-ink">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p>
            Sertifikat ini menunjukkan penyelesaian program internal Deutsch Lernen in 30 Tagen.
            Untuk kebutuhan resmi visa, studi, atau kerja, gunakan ujian resmi yang diakui.
          </p>
        </div>

        <CTAButton onClick={onStart} size="lg" className="mt-6 w-full">
          Mulai Mock Test <ArrowRight className="h-5 w-5" />
        </CTAButton>
      </div>
    </div>
  );
}

function Result({ answers, total }: { answers: Record<number, boolean>; total: number }) {
  const recordMock = useAppStore((s) => s.recordMock);
  const recordedRef = useRef(false);

  const correct = Object.values(answers).filter(Boolean).length;
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 60;
  const confidence = Math.min(95, 55 + Math.floor(pct / 3));

  // per-skill breakdown
  const skillScores = a1MockTest.sections.map((s) => {
    const offsetStart = flatQuestions.findIndex((q) => q.sectionId === s.id);
    const count = s.questions.length;
    let right = 0;
    for (let i = offsetStart; i < offsetStart + count; i++) {
      if (answers[i]) right++;
    }
    return { name: s.name, skill: s.skill, value: Math.round((right / count) * 100) };
  });

  // persist the result once
  useEffect(() => {
    if (recordedRef.current) return;
    recordedRef.current = true;
    recordMock({
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `mock${Date.now()}`,
      level: passed ? "A1.2" : "A1.1",
      score: pct,
      date: new Date().toISOString().slice(0, 10),
      perSkill: skillScores.map((s) => ({ skill: s.skill, value: s.value })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card-base p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl", passed ? "bg-success/15 text-success" : "bg-warning/15 text-warning")}>
            {passed ? <Award className="h-9 w-9" /> : <ClipboardCheck className="h-9 w-9" />}
          </div>
          <div>
            <p className="text-sm text-muted">Skor keseluruhan</p>
            <p className="font-heading text-4xl font-extrabold text-ink">{pct}%</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-elevated p-4">
            <p className="text-xs text-muted">Estimasi CEFR</p>
            <p className="font-heading text-xl font-extrabold text-ink">{passed ? "A1.2" : "A1.1"}</p>
          </div>
          <div className="rounded-xl bg-elevated p-4">
            <p className="text-xs text-muted">Status internal</p>
            <p className={cn("font-heading text-xl font-extrabold", passed ? "text-success" : "text-warning")}>
              {passed ? "Lulus" : "Belum"}
            </p>
          </div>
          <div className="rounded-xl bg-elevated p-4">
            <p className="text-xs text-muted">Confidence</p>
            <p className="font-heading text-xl font-extrabold text-ink">{confidence}%</p>
          </div>
        </div>

        <h3 className="mt-6 font-heading font-bold text-ink">Score per skill</h3>
        <div className="mt-3 space-y-2.5">
          {skillScores.map((s) => (
            <div key={s.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted">
                  {s.value >= 60 ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-danger" />}
                  {s.name}
                </span>
                <span className="font-bold text-ink">{s.value}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-elevated">
                <div className={cn("h-full rounded-full", s.value >= 60 ? "bg-success" : "bg-warning")} style={{ width: `${s.value}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-primary/30 bg-primary-soft/50 p-4 text-sm text-ink">
          <p className="font-bold text-primary">Rekomendasi</p>
          <p className="mt-1">
            {passed
              ? "Kerja bagus! Kamu siap lanjut ke materi A1.2 berikutnya. Tetap jaga konsistensi review harianmu."
              : "Kamu belum siap lanjut. Kita perkuat dulu bagian dengan skor rendah lewat remedial otomatis, supaya levelmu benar-benar naik."}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <CTAButton href="/dashboard" size="lg" className="flex-1">Kembali ke Dashboard</CTAButton>
          <CTAButton href={passed ? "/roadmap" : "/review"} variant="outline" size="lg" className="flex-1">
            {passed ? "Lihat Roadmap" : "Mulai Remedial"}
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
