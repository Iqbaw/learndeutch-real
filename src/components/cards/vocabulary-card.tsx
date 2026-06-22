"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VocabularyItem, MemoryStatus } from "@/types";
import { LevelBadge } from "@/components/ui/level-badge";
import { ListenButton } from "@/components/ui/listen-button";
import { playSound } from "@/lib/sound";

const articleColor: Record<string, string> = {
  der: "text-der",
  die: "text-die",
  das: "text-das",
};

const statusStyle: Record<MemoryStatus, { label: string; cls: string }> = {
  new: { label: "Belum dipelajari", cls: "bg-elevated text-muted" },
  learning: { label: "Sedang dipelajari", cls: "bg-secondary-soft text-secondary" },
  review: { label: "Perlu diulang", cls: "bg-warning/15 text-warning" },
  almost: { label: "Hampir hafal", cls: "bg-primary-soft text-primary" },
  mastered: { label: "Dikuasai", cls: "bg-success/15 text-success" },
};

export function VocabularyCard({
  item,
  status = "new",
  onLearn,
}: {
  item: VocabularyItem;
  status?: MemoryStatus;
  onLearn?: (id: string) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const style = statusStyle[status];

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
        <ListenButton text={item.german} variant="icon" />
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
        <span className={cn("rounded-lg px-2 py-1 text-xs font-bold", style.cls)}>
          {style.label}
        </span>
      </div>

      {status === "new" && onLearn && (
        <button
          type="button"
          data-no-sound
          onClick={() => {
            playSound("pop");
            onLearn(item.id);
          }}
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-primary-soft/50 px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary-soft focusable"
        >
          <Plus className="h-4 w-4" /> Pelajari kata ini
        </button>
      )}

      {status !== "new" && status !== "mastered" && (
        <Link
          href="/review"
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-bold text-ink transition-colors hover:bg-elevated focusable"
        >
          <RefreshCw className="h-4 w-4 text-primary" /> Latih di Review
        </Link>
      )}

      {status === "mastered" && (
        <p className="mt-3 rounded-xl bg-success/10 px-3 py-2 text-center text-xs font-bold text-success">
          Sudah dikuasai 🎉
        </p>
      )}
    </div>
  );
}
