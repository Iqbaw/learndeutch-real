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
  BrainCircuit,
  Lightbulb,
  Loader2,
  Sparkles,
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
import { fetchAIEnabled } from "@/services/lesson-client";
import { fetchAIReview, type AIReviewItem } from "@/services/review-client";
import type { ReviewCard, ErrorItem } from "@/types";

type Mode = "none" | "vocab" | "mistakes";

export default function ReviewPage() {
  const [mode, setMode] = useState<Mode>("none");
  const [aiEnabled, setAiEnabled] = useState(false);

  const vocabStatus = useAppStore((s) => s.vocabStatus);
  const errors = useAppStore((s) => s.errors);
  const lastReviewDate = useAppStore((s) => s.lastReviewDate);

  useEffect(() => {
    let cancelled = false;
    fetchAIEnabled().then((v) => !cancelled && setAiEnabled(v));
    return () => {
      cancelled = true;
    };
  }, []);

  const queue = useMemo(() => buildReviewQueue(vocabStatus), [vocabStatus]);

  // Active mistakes worth re-practicing (everything except already "safe").
  const activeErrors = useMemo(
    () =>
      [...errors]
        .filter((e) => e.status !== "safe")
        .sort((a, b) => statusWeight(b.status) - statusWeight(a.status))
        .slice(0, 8),
    [errors]
  );

  const mistakeDue = activeErrors.length;
  const today = new Date().toISOString().slice(0, 10);
  const reviewDoneToday = lastReviewDate === today;

  if (mode === "mistakes") {
    return (
      <AppShell title="Koreksi Kesalahan" subtitle="Latihan dinamis dari kesalahanmu sendiri — biar benar-benar nempel.">
        <AppGuard>
          <MistakeReviewSession errors={activeErrors} aiEnabled={aiEnabled} onExit={() => setMode("none")} />
        </AppGuard>
      </AppShell>
    );
  }

  if (mode === "vocab") {
    return (
      <AppShell title="Review" subtitle="Spaced repetition: ulang di waktu yang tepat agar tidak lupa.">
        <AppGuard>
          <ReviewSession queue={queue} onExit={() => setMode("none")} />
        </AppGuard>
      </AppShell>
    );
  }

  return (
    <AppShell title="Review" subtitle="Spaced repetition: ulang di waktu yang tepat agar tidak lupa.">
      <AppGuard>
        {queue.length === 0 && mistakeDue === 0 ? (
          <EmptyState
            icon={<Library className="h-6 w-6" />}
            title="Belum ada yang perlu direview"
            description="Kartu review muncul dari kata yang mulai kamu pelajari, dan koreksi kesalahan muncul dari latihan yang keliru. Selesaikan sebuah pelajaran untuk mengisi keduanya."
            action={
              <div className="flex gap-3">
                <CTAButton href="/lesson">Mulai Belajar</CTAButton>
                <CTAButton href="/vocabulary" variant="outline">Buka Vocabulary</CTAButton>
              </div>
            }
          />
        ) : (
          <ReviewOverview
            queueLength={queue.length}
            mistakeDue={mistakeDue}
            aiEnabled={aiEnabled}
            reviewDoneToday={reviewDoneToday}
            onStartVocab={() => setMode("vocab")}
            onStartMistakes={() => setMode("mistakes")}
          />
        )}
      </AppGuard>
    </AppShell>
  );
}

function statusWeight(status: ErrorItem["status"]): number {
  switch (status) {
    case "relapsed":
      return 4;
    case "new":
      return 3;
    case "reviewed":
      return 2;
    case "almost":
      return 1;
    default:
      return 0;
  }
}

function ReviewOverview({
  queueLength,
  mistakeDue,
  aiEnabled,
  reviewDoneToday,
  onStartVocab,
  onStartMistakes,
}: {
  queueLength: number;
  mistakeDue: number;
  aiEnabled: boolean;
  reviewDoneToday: boolean;
  onStartVocab: () => void;
  onStartMistakes: () => void;
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
        <StatCard label="Kartu vocab" value={queueLength} hint="dalam antrean" icon={<RefreshCw className="h-5 w-5" />} />
        <StatCard label="Kesalahan aktif" value={mistakeDue} hint="siap dikoreksi" accent="danger" icon={<AlertTriangle className="h-5 w-5" />} />
        <StatCard label="Retention" value={`${stats.retention}%`} hint="kekuatan ingatan" icon={<Gauge className="h-5 w-5" />} />
        <StatCard label="Confidence" value={`${stats.confidence}%`} hint="estimasi level" accent="secondary" icon={<BookText className="h-5 w-5" />} />
      </div>

      {/* Dynamic AI mistake correction — the headline review experience */}
      {mistakeDue > 0 && (
        <div className="mt-5 card-base overflow-hidden border-primary/40">
          <div className="bg-gradient-to-br from-primary-soft/80 to-card p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white dark:text-bg">
                <BrainCircuit className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-heading text-xl font-extrabold text-ink">Koreksi Kesalahan dengan AI</h2>
                <p className="text-sm text-muted">
                  {aiEnabled
                    ? "Soal latihan baru dibuat khusus dari kesalahanmu agar benar-benar paham."
                    : "Latihan ulang dari kesalahan yang kamu buat sebelumnya."}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-ink/90">
              Kami ambil <span className="font-bold">{mistakeDue}</span> kesalahan teraktifmu (yang baru
              atau kambuh lebih diprioritaskan), lalu {aiEnabled ? "AI menyusun variasi soal yang menguji konsep yang sama" : "kami uji ulang konsepnya"} —
              lengkap dengan penjelasan dan trik mengingat.
            </p>
            <CTAButton onClick={onStartMistakes} size="lg" className="mt-5 w-fit">
              <Sparkles className="h-5 w-5" /> Mulai Koreksi ({mistakeDue})
            </CTAButton>
          </div>
        </div>
      )}

      {/* Vocabulary spaced-repetition */}
      {queueLength > 0 && (
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="card-base flex flex-col justify-between p-6 lg:col-span-2">
            <div>
              <h2 className="font-heading text-xl font-extrabold text-ink">Review Kosakata</h2>
              <p className="mt-2 text-muted">
                Kartu disusun dari kata yang sudah mulai kamu pelajari. Jawaban benar menaikkan status
                kata (learning → almost → mastered); jawaban salah mengembalikannya ke antrean.
              </p>
              {reviewDoneToday && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
                  <Check className="h-3.5 w-3.5" /> Sudah selesai hari ini — boleh diulang
                </p>
              )}
            </div>
            <CTAButton onClick={onStartVocab} size="lg" variant={reviewDoneToday ? "outline" : "primary"} className="mt-6 w-fit">
              <Play className="h-5 w-5" /> {reviewDoneToday ? "Ulangi" : "Mulai"} Review ({queueLength} kartu)
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
      )}
    </>
  );
}

// ---------- Dynamic AI mistake review ----------

function buildFallbackItems(errors: ErrorItem[]): AIReviewItem[] {
  // Used when AI is unavailable: re-test the exact concept by asking the
  // learner to pick the correct form over their previous wrong answer.
  return errors
    .filter((e) => e.correctAnswer && e.correctAnswer !== e.userAnswer)
    .map((e) => {
      const opts = [e.correctAnswer, e.userAnswer].filter(Boolean);
      // shuffle deterministically by id length so it isn't always first
      const flip = e.id.length % 2 === 0;
      const options = flip ? [...opts].reverse() : opts;
      return {
        errorId: e.id,
        category: e.category,
        question: `Pilih bentuk yang benar (${e.category}):`,
        options,
        correctIndex: options.indexOf(e.correctAnswer),
        explanation: e.explanation || `Bentuk yang benar adalah "${e.correctAnswer}".`,
        tip: "",
      };
    })
    .filter((it) => it.options.length >= 2 && it.correctIndex >= 0);
}

function MistakeReviewSession({
  errors,
  aiEnabled,
  onExit,
}: {
  errors: ErrorItem[];
  aiEnabled: boolean;
  onExit: () => void;
}) {
  const reviewError = useAppStore((s) => s.reviewError);
  const completeReview = useAppStore((s) => s.completeReview);
  const profile = useAppStore((s) => s.profile);
  const placement = useAppStore((s) => s.placement);

  const [items, setItems] = useState<AIReviewItem[] | null>(null);
  const [usedAI, setUsedAI] = useState(false);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      let result: AIReviewItem[] | null = null;
      if (aiEnabled) {
        result = await fetchAIReview(errors, {
          name: profile?.name,
          goal: profile?.goal,
          estimatedLevel: placement?.estimatedLevel ?? profile?.startLevel,
        });
      }
      if (cancelled) return;
      if (result && result.length > 0) {
        setItems(result);
        setUsedAI(true);
      } else {
        setItems(buildFallbackItems(errors));
        setUsedAI(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (finished) {
      playSound("complete");
      completeReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  if (items === null) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-3 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="font-heading font-bold text-ink">Menyusun latihan dari kesalahanmu...</p>
        <p className="max-w-xs text-sm text-muted">
          AI sedang membuat soal yang menargetkan konsep yang masih perlu kamu perbaiki.
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="card-base p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15 text-success">
            <Check className="h-9 w-9" />
          </div>
          <h2 className="mt-4 font-heading text-2xl font-extrabold text-ink">Tidak ada yang perlu dikoreksi</h2>
          <p className="mt-2 text-muted">Mantap! Kesalahanmu sudah teratasi. Lanjutkan belajar untuk menambah tantangan.</p>
          <CTAButton onClick={onExit} className="mt-6">Kembali</CTAButton>
        </div>
      </div>
    );
  }

  const total = items.length;

  if (finished) {
    const pct = Math.round((correctCount / total) * 100);
    return (
      <div className="mx-auto max-w-xl">
        <div className="card-base p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15 text-success">
            <Check className="h-9 w-9" />
          </div>
          <h2 className="mt-4 font-heading text-2xl font-extrabold text-ink">Koreksi selesai!</h2>
          <p className="mt-2 text-muted">
            Kamu benar <span className="font-bold text-ink">{correctCount} dari {total}</span> ({pct}%).
            Kesalahan yang kamu jawab benar naik menuju status &quot;aman&quot;; yang masih salah akan muncul lagi.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CTAButton onClick={onExit} size="lg" className="flex-1">
              <RotateCcw className="h-5 w-5" /> Kembali
            </CTAButton>
            <CTAButton href="/errors" variant="outline" size="lg" className="flex-1">
              Lihat Error Notebook
            </CTAButton>
          </div>
        </div>
      </div>
    );
  }

  const item = items[index];

  function handleResult(correct: boolean) {
    if (correct) setCorrectCount((c) => c + 1);
    playSound(correct ? "correct" : "wrong");
    reviewError(item.errorId, correct);
  }

  function next() {
    if (index < total - 1) setIndex((i) => i + 1);
    else setFinished(true);
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={onExit} className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted hover:text-ink focusable" aria-label="Keluar koreksi">
          <X className="h-5 w-5" />
        </button>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-elevated">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(index / total) * 100}%` }} />
        </div>
        <span className="font-mono text-xs font-bold text-muted">{index + 1}/{total}</span>
      </div>

      {usedAI && (
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
          <BrainCircuit className="h-3.5 w-3.5" /> Dibuat AI dari kesalahanmu
        </p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={item.errorId + index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.22 }}
        >
          <MistakeCardView item={item} onResult={handleResult} onNext={next} isLast={index === total - 1} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MistakeCardView({
  item,
  onResult,
  onNext,
  isLast,
}: {
  item: AIReviewItem;
  onResult: (correct: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  function choose(i: number) {
    if (answered) return;
    setPicked(i);
    onResult(i === item.correctIndex);
  }

  return (
    <div className="card-base p-6">
      <span className="rounded-lg bg-elevated px-2.5 py-1 text-xs font-bold text-muted">{item.category}</span>
      <p className="mt-3 font-heading text-xl font-extrabold text-ink">{item.question}</p>

      <div className="mt-5 grid gap-2.5">
        {item.options.map((opt, i) => {
          const isAnswer = i === item.correctIndex;
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

      {answered && (item.explanation || item.tip) && (
        <div className="mt-4 space-y-2 animate-fade-up">
          {item.explanation && (
            <p className="rounded-xl bg-elevated p-3 text-sm text-muted">{item.explanation}</p>
          )}
          {item.tip && (
            <p className="flex items-start gap-2 rounded-xl border border-primary/30 bg-primary-soft/50 p-3 text-sm text-ink">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span><span className="font-bold">Trik ingat: </span>{item.tip}</span>
            </p>
          )}
        </div>
      )}

      {answered && (
        <CTAButton onClick={onNext} className="mt-4 w-full">
          {isLast ? "Selesai" : "Lanjut"} <ArrowRight className="h-4 w-4" />
        </CTAButton>
      )}
    </div>
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
