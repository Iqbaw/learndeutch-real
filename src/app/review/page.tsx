"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  BookText,
  Network,
  AlertTriangle,
  Gauge,
  Check,
  X,
  ArrowRight,
  Play,
  RotateCcw,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/cards/stat-card";
import { CTAButton } from "@/components/ui/cta-button";
import { reviewQueue, reviewSummary } from "@/data/review";
import { cn } from "@/lib/utils";
import type { ReviewCard } from "@/types";

export default function ReviewPage() {
  const [started, setStarted] = useState(false);

  return (
    <AppShell title="Review" subtitle="Spaced repetition: ulang di waktu yang tepat agar tidak lupa.">
      {!started ? (
        <ReviewOverview onStart={() => setStarted(true)} />
      ) : (
        <ReviewSession onExit={() => setStarted(false)} />
      )}
    </AppShell>
  );
}

function ReviewOverview({ onStart }: { onStart: () => void }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Perlu direview" value={reviewSummary.dueToday} hint="kartu hari ini" icon={<RefreshCw className="h-5 w-5" />} />
        <StatCard label="Vocabulary" value={reviewSummary.vocabularyDue} hint="kata" accent="secondary" icon={<BookText className="h-5 w-5" />} />
        <StatCard label="Grammar" value={reviewSummary.grammarDue} hint="topik" icon={<Network className="h-5 w-5" />} />
        <StatCard label="Kesalahan" value={reviewSummary.mistakeDue} hint="dari Error Notebook" accent="danger" icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="card-base flex flex-col justify-between p-6 lg:col-span-2">
          <div>
            <h2 className="font-heading text-xl font-extrabold text-ink">Siap untuk review hari ini?</h2>
            <p className="mt-2 text-muted">
              Kartu disusun otomatis berdasarkan kesalahanmu dan jadwal pengulangan (hari ke-1, 3, 7,
              14, 30). Yang sering salah muncul lebih cepat; yang sudah kuat muncul lebih jarang.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Pilih arti", "Ketik arti", "Pilih artikel", "Susun kalimat", "Dengarkan & pilih", "Perbaiki kalimat"].map((t) => (
                <span key={t} className="rounded-lg bg-elevated px-2.5 py-1 text-xs font-bold text-muted">{t}</span>
              ))}
            </div>
          </div>
          <CTAButton onClick={onStart} size="lg" className="mt-6 w-fit">
            <Play className="h-5 w-5" /> Mulai Review 10 Menit
          </CTAButton>
        </div>

        <div className="card-base p-6">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-bold text-ink">Retention Score</h3>
          </div>
          <p className="mt-3 font-heading text-4xl font-extrabold text-ink">{reviewSummary.retention}%</p>
          <p className="text-sm text-muted">Seberapa kuat kamu mengingat materi 14 hari terakhir.</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-elevated">
            <div className="h-full rounded-full bg-primary" style={{ width: `${reviewSummary.retention}%` }} />
          </div>
        </div>
      </div>
    </>
  );
}

function ReviewSession({ onExit }: { onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const card = reviewQueue[index];
  const total = reviewQueue.length;

  function handleResult(correct: boolean) {
    if (correct) setCorrectCount((c) => c + 1);
  }

  function next() {
    if (index < total - 1) setIndex((i) => i + 1);
    else setFinished(true);
  }

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
            Kartu yang masih salah akan muncul lagi besok.
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
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((index) / total) * 100}%` }} />
        </div>
        <span className="font-mono text-xs font-bold text-muted">{index + 1}/{total}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
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
  const [typed, setTyped] = useState("");
  const [revealed, setRevealed] = useState(false);

  const isChoice = card.options && typeof card.correctIndex === "number";
  const answered = isChoice ? picked !== null : revealed;

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    onResult(i === card.correctIndex);
  }

  function reveal() {
    if (revealed) return;
    setRevealed(true);
    // self-graded text answers count as correct attempt for demo
    onResult(typed.trim().length > 0);
  }

  return (
    <div className="card-base p-6">
      <span className="rounded-lg bg-elevated px-2.5 py-1 text-xs font-bold text-muted">
        {card.due}
      </span>
      <p className="mt-3 font-heading text-xl font-extrabold text-ink">{card.question}</p>

      {isChoice ? (
        <div className="mt-5 grid gap-2.5">
          {card.options!.map((opt, i) => {
            const isAnswer = i === card.correctIndex;
            const isPicked = i === picked;
            return (
              <button
                key={i}
                type="button"
                onClick={() => choose(i)}
                disabled={picked !== null}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left font-body text-ink transition-all focusable",
                  picked === null && "border-border bg-card hover:border-primary hover:bg-primary-soft/40",
                  picked !== null && isAnswer && "border-success bg-success/10",
                  picked !== null && isPicked && !isAnswer && "border-danger bg-danger/10",
                  picked !== null && !isAnswer && !isPicked && "opacity-60"
                )}
              >
                <span>{opt}</span>
                {picked !== null && isAnswer && <Check className="h-5 w-5 text-success" />}
                {picked !== null && isPicked && !isAnswer && <X className="h-5 w-5 text-danger" />}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-5">
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Ketik jawabanmu..."
            disabled={revealed}
            className="w-full rounded-xl border border-border bg-card p-3 font-body text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {!revealed && (
            <CTAButton onClick={reveal} variant="outline" size="sm" className="mt-2">
              Cek jawaban
            </CTAButton>
          )}
          {revealed && (
            <div className="mt-3 rounded-xl border border-success/30 bg-success/10 p-3 text-sm text-ink animate-fade-up">
              <span className="font-bold text-success">Jawaban: </span>{card.answer}
            </div>
          )}
        </div>
      )}

      {answered && (
        <p className="mt-4 rounded-xl bg-elevated p-3 text-sm text-muted animate-fade-up">
          {card.explanation}
        </p>
      )}

      {answered && (
        <CTAButton onClick={onNext} className="mt-4 w-full">
          {isLast ? "Selesai" : "Lanjut"} <ArrowRight className="h-4 w-4" />
        </CTAButton>
      )}
    </div>
  );
}
