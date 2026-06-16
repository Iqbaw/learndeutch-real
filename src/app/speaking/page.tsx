"use client";

import { useState } from "react";
import { Mic, Volume2, Sparkles, NotebookPen, ArrowLeft, Bot, User } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { RoleplayCard } from "@/components/cards/roleplay-card";
import { CTAButton } from "@/components/ui/cta-button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { AIInsightCard } from "@/components/cards/ai-insight-card";
import { roleplays } from "@/data/roleplays";
import { speakingFeedbackService, type SpeakingFeedback } from "@/services/ai";
import type { Roleplay } from "@/types";
import { cn } from "@/lib/utils";

export default function SpeakingPage() {
  const [active, setActive] = useState<Roleplay | null>(null);

  return (
    <AppShell title="Speaking Lab" subtitle="Latihan bicara tanpa takut. Feedback ramah dan spesifik.">
      {!active ? (
        <>
          <AIInsightCard className="mb-5">
            Speaking kamu masih pasif. Mode privat, feedback lembut, latihan pendek — pilih satu
            roleplay dan mulai bicara. Tidak ada yang menilai kecuali untuk membantumu.
          </AIInsightCard>
          <h2 className="mb-3 font-heading text-lg font-extrabold text-ink">Pilih Roleplay</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {roleplays.map((r) => (
              <RoleplayCard key={r.id} roleplay={r} onSelect={() => setActive(r)} />
            ))}
          </div>
        </>
      ) : (
        <RoleplaySession roleplay={active} onBack={() => setActive(null)} />
      )}
    </AppShell>
  );
}

function RoleplaySession({ roleplay, onBack }: { roleplay: Roleplay; onBack: () => void }) {
  const [recordingTurn, setRecordingTurn] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<number, SpeakingFeedback>>({});
  const [loading, setLoading] = useState<number | null>(null);

  async function record(turnIndex: number, text: string) {
    setRecordingTurn(turnIndex);
    setLoading(turnIndex);
    const result = await speakingFeedbackService.evaluate(text);
    setFeedback((f) => ({ ...f, [turnIndex]: result }));
    setLoading(null);
    setRecordingTurn(null);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink focusable rounded-lg"
      >
        <ArrowLeft className="h-4 w-4" /> Semua roleplay
      </button>

      <div className="card-base mb-4 flex items-center gap-3 p-5">
        <span className="text-3xl" aria-hidden>{roleplay.emoji}</span>
        <div>
          <h2 className="font-heading text-xl font-extrabold text-ink">{roleplay.title}</h2>
          <p className="text-sm text-muted">{roleplay.scenario}</p>
        </div>
      </div>

      <div className="space-y-3">
        {roleplay.turns.map((turn, i) => {
          const isAI = turn.speaker === "ai";
          const fb = feedback[i];
          return (
            <div key={i} className={cn("flex gap-2", isAI ? "justify-start" : "justify-end")}>
              {isAI && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Bot className="h-4 w-4" />
                </span>
              )}
              <div className={cn("max-w-[80%]", !isAI && "text-right")}>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3",
                    isAI ? "bg-elevated text-ink" : "bg-primary text-white dark:text-bg"
                  )}
                >
                  <p className="font-body font-bold">{turn.text}</p>
                  {turn.translation && (
                    <p className={cn("mt-0.5 text-xs", isAI ? "text-muted" : "text-white/80 dark:text-bg/70")}>
                      {turn.translation}
                    </p>
                  )}
                </div>

                {isAI ? (
                  <button
                    className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline focusable rounded"
                    aria-label="Dengarkan ucapan"
                  >
                    <Volume2 className="h-3.5 w-3.5" /> Dengarkan
                  </button>
                ) : (
                  <div className="mt-1 flex items-center justify-end gap-2">
                    <button
                      onClick={() => record(i, turn.text)}
                      disabled={loading === i}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors focusable",
                        recordingTurn === i ? "bg-danger text-white" : "bg-secondary-soft text-secondary"
                      )}
                    >
                      <Mic className="h-3.5 w-3.5" />
                      {loading === i ? "Menilai..." : fb ? "Rekam ulang" : "Ucapkan"}
                    </button>
                  </div>
                )}

                {fb && (
                  <div className="mt-2 rounded-2xl border border-border bg-card p-3 text-left animate-fade-up">
                    <div className="flex items-center gap-4">
                      <ProgressRing value={fb.pronunciation} size={56} stroke={6} sublabel="ucap" />
                      <div className="flex-1 space-y-1.5">
                        <ScoreBar label="Kelancaran" value={fb.fluency} />
                        <ScoreBar label="Grammar" value={fb.grammar} />
                      </div>
                    </div>
                    <p className="mt-3 flex items-start gap-1.5 text-sm text-ink">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {fb.feedback}
                    </p>
                    <button className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline focusable rounded">
                      <NotebookPen className="h-3.5 w-3.5" /> Simpan ke Error Notebook
                    </button>
                  </div>
                )}
              </div>
              {!isAI && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-soft text-secondary">
                  <User className="h-4 w-4" />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <CTAButton onClick={onBack} variant="outline" className="w-full">
          Selesai latihan
        </CTAButton>
      </div>
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
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
