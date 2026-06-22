"use client";

import { useState } from "react";
import { ArrowLeft, Bot, User, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { RoleplayCard } from "@/components/cards/roleplay-card";
import { CTAButton } from "@/components/ui/cta-button";
import { AIInsightCard } from "@/components/cards/ai-insight-card";
import { SpeechPractice } from "@/components/learning/speech-practice";
import { ListenButton } from "@/components/ui/listen-button";
import { roleplays } from "@/data/roleplays";
import { isSpeechSynthesisSupported } from "@/lib/speech";
import { useAppStore } from "@/lib/store";
import type { Roleplay } from "@/types";
import { cn } from "@/lib/utils";

export default function SpeakingPage() {
  const [active, setActive] = useState<Roleplay | null>(null);

  return (
    <AppShell title="Speaking Lab" subtitle="Latihan bicara pakai mikrofon asli. Feedback ramah dan spesifik.">
      <AppGuard>
        {!active ? (
          <>
            <AIInsightCard className="mb-5">
              Ketuk mikrofon dan ucapkan kalimatnya — pengenalan suara akan mendengar bahasa
              Jermanmu dan memberi skor pengucapan. Pilih satu roleplay untuk mulai bicara.
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
      </AppGuard>
    </AppShell>
  );
}

function RoleplaySession({ roleplay, onBack }: { roleplay: Roleplay; onBack: () => void }) {
  const [openTurn, setOpenTurn] = useState<number | null>(null);
  const synthOk = isSpeechSynthesisSupported();
  const recordSpeaking = useAppStore((s) => s.recordSpeaking);
  const recordAnswer = useAppStore((s) => s.recordAnswer);
  const recordError = useAppStore((s) => s.recordError);

  function handleSpoken(passed: boolean) {
    recordSpeaking();
    recordAnswer("Speaking", passed);
    recordAnswer("Pronunciation", passed);
  }

  function handleSaveError(info: { userAnswer: string; correctAnswer: string; explanation: string }) {
    recordError({ ...info, category: "Pronunciation" });
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
          const isOpen = openTurn === i;
          return (
            <div key={i} className={cn("flex gap-2", isAI ? "justify-start" : "justify-end")}>
              {isAI && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Bot className="h-4 w-4" />
                </span>
              )}
              <div className={cn("max-w-[85%]", !isAI && "text-right")}>
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
                  <div className="mt-1">
                    <ListenButton text={turn.text} label="Dengarkan" />
                  </div>
                ) : (
                  <div className="mt-1 flex items-center justify-end">
                    <button
                      onClick={() => setOpenTurn(isOpen ? null : i)}
                      className="inline-flex items-center gap-1 rounded-lg bg-secondary-soft px-2.5 py-1.5 text-xs font-bold text-secondary focusable"
                    >
                      {isOpen ? "Tutup" : "Ucapkan giliranmu"}
                    </button>
                  </div>
                )}

                {!isAI && isOpen && (
                  <div className="mt-2 text-left">
                    <SpeechPractice expected={turn.text} allowSave showListen onResult={handleSpoken} onSave={handleSaveError} />
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

      {!synthOk && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-warning/10 p-3 text-xs text-warning">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Pemutar suara contoh tidak tersedia di browser ini, tapi mikrofon tetap bisa dipakai.
        </p>
      )}

      <div className="mt-6">
        <CTAButton onClick={onBack} variant="outline" className="w-full">
          Selesai latihan
        </CTAButton>
      </div>
    </div>
  );
}
