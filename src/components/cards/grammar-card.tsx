"use client";

import { useState } from "react";
import { Check, X, ChevronDown, Dumbbell, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/sound";
import type { GrammarTopic } from "@/types";
import { LevelBadge } from "@/components/ui/level-badge";

export function GrammarCard({
  topic,
  mastery = 0,
  onPractice,
}: {
  topic: GrammarTopic;
  mastery?: number;
  onPractice?: (correct: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [practicing, setPracticing] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);

  // quick recall practice — prefer the dedicated quiz (a DIFFERENT sentence than
  // the worked example) so it tests memory, not copying. Falls back to the
  // correct-vs-wrong example pair when a topic has no quiz yet.
  const correctFirst = topic.title.length % 2 === 0;
  const quizQuestion = topic.quiz?.question ?? "Mana kalimat yang benar?";
  const quizExplanation = topic.quiz?.explanation ?? topic.whyWrong;
  const options = topic.quiz
    ? topic.quiz.options.map((text, i) => ({ text, correct: i === topic.quiz!.correctIndex }))
    : correctFirst
    ? [{ text: topic.correct, correct: true }, { text: topic.wrong, correct: false }]
    : [{ text: topic.wrong, correct: false }, { text: topic.correct, correct: true }];

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    playSound(options[i].correct ? "correct" : "wrong");
    onPractice?.(options[i].correct);
  }

  return (
    <div className="card-base overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-3 p-5 text-left focusable"
        aria-expanded={open}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-lg font-extrabold text-ink">{topic.title}</h3>
            <LevelBadge level={topic.level} />
          </div>
          <p className="mt-1 text-sm text-muted">{topic.simpleExplanation}</p>
        </div>
        <ChevronDown
          className={cn("mt-1 h-5 w-5 shrink-0 text-muted transition-transform", open && "rotate-180")}
        />
      </button>

      <div className="px-5 pb-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-bold text-muted">Penguasaan</span>
          <span className="font-bold text-primary">{mastery}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-elevated">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${mastery}%` }} />
        </div>
      </div>

      {open && (
        <div className="space-y-4 border-t border-border px-5 py-4 animate-fade-up">
          <div className="rounded-xl bg-elevated p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Rumus</p>
            <p className="mt-1 font-mono text-sm text-ink">{topic.formula}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-success/30 bg-success/10 p-3">
              <p className="flex items-center gap-1.5 text-xs font-bold text-success">
                <Check className="h-4 w-4" /> Benar
              </p>
              <p className="mt-1 font-body text-sm text-ink">{topic.correct}</p>
            </div>
            <div className="rounded-xl border border-danger/30 bg-danger/10 p-3">
              <p className="flex items-center gap-1.5 text-xs font-bold text-danger">
                <X className="h-4 w-4" /> Salah
              </p>
              <p className="mt-1 font-body text-sm text-ink line-through decoration-danger/50">
                {topic.wrong}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted">Kenapa salah?</p>
            <p className="mt-1 text-sm text-ink">{topic.whyWrong}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <p className="text-sm text-muted">
              <span className="font-bold text-secondary">Trik: </span>{topic.mnemonic}
            </p>
            <p className="text-sm text-muted">
              <span className="font-bold text-primary">Kapan dipakai: </span>{topic.realLife}
            </p>
          </div>

          {!practicing ? (
            <button
              type="button"
              onClick={() => setPracticing(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-bold text-ink hover:bg-elevated focusable"
            >
              <Dumbbell className="h-4 w-4" /> Latihan cepat
            </button>
          ) : (
            <div className="rounded-xl border border-border bg-card p-3">
              <p className="font-heading text-sm font-bold text-ink">{quizQuestion}</p>
              <div className="mt-2 grid gap-2">
                {options.map((opt, i) => {
                  const answered = picked !== null;
                  return (
                    <button
                      key={i}
                      type="button"
                      data-no-sound
                      onClick={() => choose(i)}
                      disabled={answered}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-all focusable",
                        !answered && "border-border bg-card hover:border-primary",
                        answered && opt.correct && "border-success bg-success/10",
                        answered && i === picked && !opt.correct && "border-danger bg-danger/10",
                        answered && !opt.correct && i !== picked && "opacity-60"
                      )}
                    >
                      <span>{opt.text}</span>
                      {answered && opt.correct && <Check className="h-4 w-4 text-success" />}
                      {answered && i === picked && !opt.correct && <X className="h-4 w-4 text-danger" />}
                    </button>
                  );
                })}
              </div>
              {picked !== null && (
                <p className="mt-2 flex items-start gap-1.5 text-xs text-muted animate-fade-up">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> {quizExplanation}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
