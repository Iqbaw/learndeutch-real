"use client";

import { useState } from "react";
import { Check, X, ChevronDown, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GrammarTopic } from "@/types";
import { LevelBadge } from "@/components/ui/level-badge";
import { CTAButton } from "@/components/ui/cta-button";

export function GrammarCard({ topic }: { topic: GrammarTopic }) {
  const [open, setOpen] = useState(false);

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
          className={cn(
            "mt-1 h-5 w-5 shrink-0 text-muted transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <div className="px-5 pb-4">
        {/* mastery bar */}
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-bold text-muted">Penguasaan</span>
          <span className="font-bold text-primary">{topic.mastery}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${topic.mastery}%` }}
          />
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

          <CTAButton href="/lesson" variant="outline" size="sm">
            <Dumbbell className="h-4 w-4" /> Latihan topik ini
          </CTAButton>
        </div>
      )}
    </div>
  );
}
