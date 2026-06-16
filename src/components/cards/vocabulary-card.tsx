"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VocabularyItem, MemoryStatus } from "@/types";
import { LevelBadge } from "@/components/ui/level-badge";

const articleColor: Record<string, string> = {
  der: "text-der",
  die: "text-die",
  das: "text-das",
};

const statusStyle: Record<MemoryStatus, { label: string; cls: string }> = {
  new: { label: "Baru", cls: "bg-elevated text-muted" },
  learning: { label: "Dipelajari", cls: "bg-secondary-soft text-secondary" },
  review: { label: "Perlu review", cls: "bg-warning/15 text-warning" },
  almost: { label: "Hampir hafal", cls: "bg-primary-soft text-primary" },
  mastered: { label: "Dikuasai", cls: "bg-success/15 text-success" },
};

export function VocabularyCard({ item }: { item: VocabularyItem }) {
  const [flipped, setFlipped] = useState(false);
  const status = statusStyle[item.status];

  return (
    <div className="card-base flex flex-col p-4 transition-shadow hover:shadow-glow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl" aria-hidden>{item.emoji}</span>
          <div>
            <p className="font-heading text-lg font-extrabold leading-tight text-ink">
              {item.article && (
                <span className={cn("font-mono text-sm font-bold", articleColor[item.article])}>
                  {item.article}{" "}
                </span>
              )}
              {item.german.replace(/^(der|die|das)\s/, "")}
            </p>
            {item.plural && (
              <p className="text-xs text-muted">Plural: {item.plural}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          aria-label={`Putar audio ${item.german}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-elevated text-primary transition-colors hover:bg-primary-soft focusable"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="mt-3 rounded-xl bg-elevated px-3 py-2 text-left text-sm focusable"
        aria-expanded={flipped}
      >
        {flipped ? (
          <span className="font-bold text-ink">{item.indonesian}</span>
        ) : (
          <span className="text-muted">Ketuk untuk lihat arti</span>
        )}
      </button>

      <div className="mt-3 rounded-xl border border-border bg-card/50 p-3">
        <p className="font-body text-sm text-ink">{item.exampleA1}</p>
        <p className="mt-0.5 text-xs italic text-muted">{item.exampleTranslation}</p>
      </div>

      {item.mnemonic && (
        <p className="mt-2 text-xs text-muted">
          <span className="font-bold text-secondary">Trik: </span>
          {item.mnemonic}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <LevelBadge level={item.level} />
        <span className={cn("rounded-lg px-2 py-1 text-xs font-bold", status.cls)}>
          {status.label}
        </span>
      </div>
    </div>
  );
}
