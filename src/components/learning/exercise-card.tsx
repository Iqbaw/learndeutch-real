"use client";

import { useState } from "react";
import { Check, X, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/sound";
import type { DrillExercise } from "@/types";

interface ExerciseCardProps {
  exercise: DrillExercise;
  onResult?: (correct: boolean) => void;
  onAnswered?: (
    correct: boolean,
    info: { userAnswer: string; correctAnswer: string; explanation: string }
  ) => void;
}

export function ExerciseCard({ exercise, onResult, onAnswered }: ExerciseCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const answered = selected !== null;
  const isCorrect = selected === exercise.correctIndex;

  function choose(i: number) {
    if (answered) return;
    setSelected(i);
    const correct = i === exercise.correctIndex;
    if (!correct) {
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
    playSound(correct ? "correct" : "wrong");
    onResult?.(correct);
    onAnswered?.(correct, {
      userAnswer: exercise.options[i],
      correctAnswer: exercise.options[exercise.correctIndex],
      explanation: exercise.explanation,
    });
  }

  return (
    <div className={cn("space-y-4", shake && "animate-shake")}>
      <p className="font-heading text-lg font-bold text-ink">{exercise.prompt}</p>
      <div className="grid gap-2.5">
        {exercise.options.map((opt, i) => {
          const isAnswer = i === exercise.correctIndex;
          const isPicked = i === selected;
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
                answered && !isAnswer && !isPicked && "border-border bg-card opacity-60"
              )}
              aria-pressed={isPicked}
            >
              <span>{opt}</span>
              {answered && isAnswer && <Check className="h-5 w-5 text-success" />}
              {answered && isPicked && !isAnswer && <X className="h-5 w-5 text-danger" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={cn(
            "flex items-start gap-2 rounded-xl border p-3 text-sm animate-fade-up",
            isCorrect
              ? "border-success/30 bg-success/10 text-success"
              : "border-primary/30 bg-primary-soft/50 text-ink"
          )}
        >
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <span className="font-bold">
              {isCorrect ? "Tepat sekali! " : "Hampir benar. "}
            </span>
            {exercise.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
