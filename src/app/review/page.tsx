"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  BookText,
  AlertTriangle,
  Gauge,
  Check,
  X,
  ArrowRight,
  Play,
  RotateCcw,
  Library,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { StatCard } from "@/components/cards/stat-card";
import { CTAButton } from "@/components/ui/cta-button";
import { EmptyState } from "@/components/ui/empty-state";
import { useAppStore } from "@/lib/store";
import { buildReviewQueue, deriveStats } from "@/lib/derive";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";
import type { ReviewCard } from "@/types";

export default function ReviewPage() {
  const [started, setStarted] = useState(false);
  const vocabStatus = useAppStore((s) => s.vocabStatus);
  const errors = useAppStore((s) => s.errors);
  const lastReviewDate = useAppStore((s) => s.lastReviewDate);

  const queue = useMemo(() => buildReviewQueue(vocabStatus), [vocabStatus]);
  const mistakeDue = errors.filter((e) => e.status === "new" || e.status === "relapsed").length;

  const today = new Date().toISOString().slice(0, 10);
  const reviewDoneToday = lastReviewDate === today;

  return (
    <AppShell title="Review" subtitle="Spaced repetition: ulang di waktu yang tepat agar tidak lupa.">
      <AppGuard>
        {queue.length === 0 ? (
          <EmptyState
            icon={<Library className="h-6 w-6" />}
            title="Belum ada kartu untuk direview"
            description="Kartu review muncul dari kata yang sudah mulai kamu pelajari. Selesaikan sebuah pelajaran atau tandai kata di halaman Vocabulary untuk mengisi antrean review."
            action={
              <div className="flex gap-3">
                <CTAButton href="/lesson">Mulai Belajar</CTAButton>
                <CTAButton href="/vocabulary" variant="outline">Buka Vocabulary</CTAButton>
              </div>
            }
          />
        ) : reviewDoneToday && !started ? (
          <ReviewDoneState queueLength={queue.length} onRestart={() => setStarted(true)} />
        ) : !started ? (
          <ReviewOverview queueLength={queue.length} mistakeDue={mistakeDue} onStart={() => setStarted(true)} />
        ) : (
          <ReviewSession queue={queue} onExit={() => setStarted(false)} />
        )}
      </AppGuard>
    </AppShell>
  );
}

function ReviewDoneState({ queueLength, onRestart }: { queueLength: number; onRestart: () => void }) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="card-base p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15 text-success">
          <Check className="h-9 w-9" />
        </div>
        <h2 className="mt-4 font-heading text-2xl font-extrabold text-ink">
          Review hari ini telah selesai!
        </h2>
        <p className="mt-2 text-muted">
          Kamu sudah menyelesaikan review hari ini. Kartu akan siap lagi besok
          sesuai jadwal spaced repetition. Tetap konsisten ya!
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <CTAButton href="/dashboard" variant="outline">
            Ke Dashboard
          </CTAButton>
          <CTAButton onClick={onRestart} variant="ghost">
            <RotateCcw className="h-4 w-4" /> Ulangi sesi ({queueLength} kartu)
          </CTAButton>
        </div>
      </div>
    </div>
  );
}

function ReviewOverview({
  queueLength,
  mistakeDue,
  onStart,
}: {
  queueLength: number;
  mistakeDue: number;
  onStart: () => void;
}) {
  const vocabStatus = useAppStore((s) => s.vocabStatus);
  const completedDays = useAppStore((s) => s.completedDays);
  const skillStats = useAppStore((s) => s.skillStats);
  const grammarStats = useAppStore((s) => s.grammarStats);
  const profile = useAppStore((s) => s.profile);
  const speakingAttempts = useAppStore((s) => s.speakingAttempts);
  const currentDay = useAppStore((s) => s.currentDay);

  const stats = deriveStats({
    startLevel: profile?.startLevel ?? "A1.1",
    currentDay,
    completedDays,
    skillStats,
    grammarStats,
    vocabStatus,
    speakingAttempts,
  });

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Perlu direview" value={queueLength} hint="kartu hari ini" icon={<RefreshCw className="h-5 w-5" />} />
        <StatCard label="Vocabulary" value={queueLength} hint="kata dalam antrean" accent="secondary" icon={<BookText className="h-5 w-5" />} />
        <StatCard label="Kesalahan aktif" value={mistakeDue} hint="dari Error Notebook" accent="danger" icon={<AlertTriangle className="h-5 w-5" />} />
        <StatCard label="Retention" value={`${stats.retention}%`} hint="kekuatan ingatan" icon={<Gauge className="h-5 w-5" />} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="card-base flex flex-col justify-between p-6 lg:col-span-2">
          <div>
            <h2 className="font-heading text-xl font-extrabold text-ink">Siap untuk review hari ini?</h2>
            <p className="mt-2 text-muted">
              Kartu disusun dari kata yang sudah mulai kamu pelajari. Jawaban benar membuat kata
              naik status (learning → almost → mastered); jawaban salah mengembalikannya ke antrean.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Pilih arti", "Pilih artikel"].map((t) => (
                <span key={t} className="rounded-lg bg-elevated px-2.5 py-1 text-xs font-bold text-muted">{t}</span>
              ))}
            </div>
          </div>
          <CTAButton onClick={onStart} size="lg" className="mt-6 w-fit">
            <Play className="h-5 w-5" /> Mulai Review ({queueLength} kartu)
          </CTAButton>
        </div>

        <div className="card-base p-6">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-bold text-ink">Retention Score</h3>
          </div>
          <p className="mt-3 font-heading text-4xl font-extrabold text-ink">{stats.retention}%</p>
          <p className="text-sm text-muted">Bagian kata yang sudah mencapai status hampir/dikuasai.</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-elevated">
            <div className="h-full rounded-full bg-primary" style={{ width: `${stats.retention}%` }} />
          </div>
        </div>
      </div>
    </>
  );
}

function ReviewSession({ queue, onExit }: { queue: ReviewCard[]; onExit: () => void }) {
  const reviewVocab = useAppStore((s) => s.reviewVocab);
  const completeReview = useAppStore((s) => s.completeReview);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const card = queue[index];
  const total = queue.length;

  function handleResult(correct: boolean) {
    if (correct) setCorrectCount((c) => c + 1);
    playSound(correct ? "correct" : "wrong");
    // card.id is the vocabulary id — update its real memory status
    reviewVocab(card.id, correct);
  }

  function next() {
    if (index < total - 1) setIndex((i) => i + 1);
    else setFinished(true);
  }

  useEffect(() => {
    if (finished) {
      playSound("complete");
      completeReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  if (finished) {
    const pct = Math.round((correctCount / total) * 100);
    return (
      <div className="mx-auto max-w-xl">
        <div className="card-base p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15 text-success">
            <Check className="h-9 w-9" />
          </div>
          <h2 className="mt-4 font-heading text-2xl font-extrabold text-ink">Review selesai!</h2>
          <p className="mt-2 text-muted">
            Kamu menjawab benar <span className="font-bold text-ink">{correctCount} dari {total}</span> kartu ({pct}%).
            Status hafalan kata sudah diperbarui sesuai jawabanmu.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CTAButton onClick={onExit} size="lg" className="flex-1">
              <RotateCcw className="h-5 w-5" /> Kembali
            </CTAButton>
            <CTAButton href="/dashboard" variant="outline" size="lg" className="flex-1">
              Ke Dashboard
            </CTAButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={onExit} className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted hover:text-ink focusable" aria-label="Keluar review">
          <X className="h-5 w-5" />
        </button>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-elevated">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(index / total) * 100}%` }} />
        </div>
        <span className="font-mono text-xs font-bold text-muted">{index + 1}/{total}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={card.id + index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.22 }}
        >
          <ReviewCardView card={card} onResult={handleResult} onNext={next} isLast={index === total - 1} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ReviewCardView({
  card,
  onResult,
  onNext,
  isLast,
}: {
  card: ReviewCard;
  onResult: (correct: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    onResult(i === card.correctIndex);
  }

  return (
    <div className="card-base p-6">
      <span className="rounded-lg bg-elevated px-2.5 py-1 text-xs font-bold text-muted">{card.due}</span>
      <p className="mt-3 font-heading text-xl font-extrabold text-ink">{card.question}</p>

      <div className="mt-5 grid gap-2.5">
        {card.options!.map((opt, i) => {
          const isAnswer = i === card.correctIndex;
          const isPicked = i === picked;
          return (
            <button
              key={i}
              type="button"
              data-no-sound
              onClick={() => choose(i)}
              disabled={answered}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left font-body text-ink transition-all focusable",
                !answered && "border-border bg-card hover:border-primary hover:bg-primary-soft/40",
                answered && isAnswer && "border-success bg-success/10",
                answered && isPicked && !isAnswer && "border-danger bg-danger/10",
                answered && !isAnswer && !isPicked && "opacity-60"
              )}
            >
              <span>{opt}</span>
              {answered && isAnswer && <Check className="h-5 w-5 text-success" />}
              {answered && isPicked && !isAnswer && <X className="h-5 w-5 text-danger" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <p className="mt-4 rounded-xl bg-elevated p-3 text-sm text-muted animate-fade-up">{card.explanation}</p>
      )}

      {answered && (
        <CTAButton onClick={onNext} className="mt-4 w-full">
          {isLast ? "Selesai" : "Lanjut"} <ArrowRight className="h-4 w-4" />
        </CTAButton>
      )}
    </div>
  );
}
