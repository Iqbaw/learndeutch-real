"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Sparkles, NotebookPen, RotateCcw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/lib/speech";
import { playSound } from "@/lib/sound";
import { speakingFeedbackService, type SpeakingFeedback } from "@/services/ai";
import { ProgressRing } from "@/components/ui/progress-ring";
import { ListenButton } from "@/components/ui/listen-button";

interface SpeechPracticeProps {
  expected: string;
  /** show the expected sentence as a "listen to example" affordance */
  showListen?: boolean;
  /** offer the "save to Error Notebook" action */
  allowSave?: boolean;
  /** called when the user saves the attempt to the Error Notebook */
  onSave?: (info: { userAnswer: string; correctAnswer: string; explanation: string }) => void;
  /** fired once per attempt with whether the pronunciation passed */
  onResult?: (passed: boolean) => void;
  className?: string;
}

export function SpeechPractice({
  expected,
  showListen = true,
  allowSave = false,
  onSave,
  onResult,
  className,
}: SpeechPracticeProps) {
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [saved, setSaved] = useState(false);
  const expectedRef = useRef(expected);
  expectedRef.current = expected;
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  async function evaluate(text: string) {
    setEvaluating(true);
    const result = await speakingFeedbackService.evaluate(text, expectedRef.current);
    setFeedback(result);
    setEvaluating(false);
    if (!result.noSpeech) {
      const passed =
        result.pronunciation >= 60 && result.matchedWords / Math.max(1, result.totalWords) >= 0.6;
      playSound(passed ? "correct" : "wrong");
      onResultRef.current?.(passed);
    }
  }

  const { supported, listening, transcript, interim, error, start, stop, reset } =
    useSpeechRecognition({
      lang: "de-DE",
      onFinal: (text) => {
        void evaluate(text);
      },
    });

  // Safety net: if recognition stops without a final result, still evaluate interim text.
  useEffect(() => {
    if (!listening && transcript && !feedback && !evaluating) {
      void evaluate(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening, transcript, feedback, evaluating]);

  // Play fail sound on mic error or no-speech feedback
  useEffect(() => {
    if (error) playSound("fail");
  }, [error]);
  useEffect(() => {
    if (feedback?.noSpeech) playSound("fail");
  }, [feedback]);

  function handleMic() {
    if (listening) {
      stop();
    } else {
      setFeedback(null);
      setSaved(false);
      reset();
      start();
    }
  }

  function tryAgain() {
    setFeedback(null);
    setSaved(false);
    reset();
  }

  if (!supported) {
    return (
      <div className={cn("rounded-2xl border border-warning/30 bg-warning/10 p-4", className)}>
        <p className="flex items-center gap-2 text-sm font-bold text-warning">
          <AlertTriangle className="h-4 w-4" /> Mikrofon belum didukung di browser ini
        </p>
        <p className="mt-1 text-sm text-ink/80">
          Fitur bicara memakai pengenalan suara browser. Coba pakai Google Chrome atau Microsoft
          Edge terbaru di perangkatmu. Kamu tetap bisa mendengarkan contohnya:
        </p>
        {showListen && (
          <div className="mt-3 flex flex-col gap-1.5">
            <p className="font-body text-sm text-ink">{expected}</p>
            <ListenButton text={expected} className="w-fit" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleMic}
          aria-label={listening ? "Berhenti merekam" : "Mulai bicara"}
          className={cn(
            "relative flex h-16 w-16 items-center justify-center rounded-full text-white shadow-glow transition-transform hover:scale-105 focusable dark:text-bg",
            listening ? "bg-danger" : "bg-primary"
          )}
        >
          {listening ? <Square className="h-6 w-6" /> : <Mic className="h-7 w-7" />}
          {listening && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-danger"
              animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
          )}
        </button>

        <p className="text-center text-sm text-muted">
          {evaluating
            ? "Menilai pengucapanmu..."
            : listening
            ? "Mendengarkan... bicara sekarang, lalu ketuk untuk berhenti."
            : feedback
            ? "Ketuk mikrofon untuk mencoba lagi."
            : "Ketuk mikrofon, lalu ucapkan kalimat dalam bahasa Jerman."}
        </p>

        {/* live transcript */}
        {(listening || interim) && (
          <p className="min-h-[1.5rem] text-center font-body text-ink">
            <span className="font-bold">{transcript} </span>
            <span className="text-muted">{interim}</span>
          </p>
        )}

        {showListen && (
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-center font-body text-sm">
              <span className="text-muted">Contoh: </span>
              <span className="font-bold text-ink">{expected}</span>
            </p>
            <ListenButton text={expected} />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-danger/10 p-3 text-sm text-danger">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </p>
      )}

      {feedback && !feedback.noSpeech && (
        <div className="mt-4 animate-fade-up">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Kamu mengucapkan</p>
          <p className="mt-1 rounded-xl bg-elevated p-3 font-body text-ink">
            &ldquo;{feedback.transcript}&rdquo;
          </p>

          <div className="mt-4 flex items-center gap-4">
            <ProgressRing value={feedback.pronunciation} size={60} stroke={7} sublabel="ucap" />
            <div className="flex-1 space-y-2">
              <ScoreBar label="Kelancaran" value={feedback.fluency} />
              <ScoreBar label="Kata tepat" value={feedback.grammar} />
            </div>
          </div>

          <p className="mt-3 flex items-start gap-1.5 text-sm text-ink">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {feedback.feedback}
          </p>
          <p className="mt-2 text-xs text-muted">
            Kata cocok: {feedback.matchedWords}/{feedback.totalWords} · Target:{" "}
            <span className="font-body text-ink">{feedback.betterAnswer}</span>
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={tryAgain}
              className="inline-flex items-center gap-1 rounded-lg bg-elevated px-2.5 py-1.5 text-xs font-bold text-ink hover:bg-primary-soft focusable"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Coba lagi
            </button>
            {allowSave && (
              <button
                onClick={() => {
                  onSave?.({
                    userAnswer: feedback.transcript || "(tidak terdeteksi)",
                    correctAnswer: feedback.betterAnswer || expectedRef.current,
                    explanation: feedback.feedback || "Latih pengucapan kalimat ini sampai lancar.",
                  });
                  setSaved(true);
                }}
                disabled={saved}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary hover:underline focusable disabled:text-success disabled:no-underline"
              >
                <NotebookPen className="h-3.5 w-3.5" />
                {saved ? "Tersimpan ke Error Notebook" : "Simpan ke Error Notebook"}
              </button>
            )}
          </div>
        </div>
      )}

      {feedback?.noSpeech && (
        <p className="mt-3 rounded-xl bg-elevated p-3 text-sm text-muted">{feedback.feedback}</p>
      )}
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[0.65rem] font-bold text-muted">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
