"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { GrammarCard } from "@/components/cards/grammar-card";
import { grammarTopics } from "@/data/grammar";
import { useAppStore } from "@/lib/store";
import { grammarMasteryFor } from "@/lib/derive";
import { Network, Palette } from "lucide-react";

export default function GrammarPage() {
  const grammarStats = useAppStore((s) => s.grammarStats);
  const recordGrammar = useAppStore((s) => s.recordGrammar);

  const masteries = grammarTopics.map((t) => grammarMasteryFor(t.id, grammarStats));
  const avgMastery = masteries.length
    ? Math.round(masteries.reduce((a, b) => a + b, 0) / masteries.length)
    : 0;

  return (
    <AppShell
      title="Grammar Map"
      subtitle="Grammar Jerman dibuat visual dan masuk akal — pola dulu, istilah belakangan."
    >
      <AppGuard>
        <div className="card-base mb-5 p-5">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-bold text-ink">Der Die Das Memory System</h2>
          </div>
          <p className="mt-1 text-sm text-muted">
            Artikel diberi warna agar mudah diingat. Bukan hafalan brutal, tapi pola visual.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl bg-der/10 px-3 py-2 text-sm font-bold text-der">
              <span className="h-3 w-3 rounded-full bg-der" /> der · maskulin
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl bg-die/10 px-3 py-2 text-sm font-bold text-die">
              <span className="h-3 w-3 rounded-full bg-die" /> die · feminin
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl bg-das/10 px-3 py-2 text-sm font-bold text-das">
              <span className="h-3 w-3 rounded-full bg-das" /> das · netral
            </span>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between rounded-2xl bg-elevated p-4">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-ink">{grammarTopics.length} topik A1</span>
          </div>
          <div className="text-right">
            <p className="font-heading text-lg font-extrabold text-ink">{avgMastery}%</p>
            <p className="text-xs text-muted">rata-rata penguasaan</p>
          </div>
        </div>

        <div className="grid gap-4">
          {grammarTopics.map((t) => (
            <GrammarCard
              key={t.id}
              topic={t}
              mastery={grammarMasteryFor(t.id, grammarStats)}
              onPractice={(correct) => recordGrammar(t.id, correct)}
            />
          ))}
        </div>
      </AppGuard>
    </AppShell>
  );
}
