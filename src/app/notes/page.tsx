"use client";

import { useMemo, useState } from "react";
import { Lock, NotebookText, Lightbulb, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { EmptyState } from "@/components/ui/empty-state";
import { FormattedText } from "@/components/ui/formatted-text";
import { levelNotes, type NoteColor } from "@/data/notes";
import { useAppStore, MAJOR_LEVELS } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { MajorLevel } from "@/types";

const COLOR: Record<NoteColor, { bar: string; chip: string; soft: string }> = {
  primary: { bar: "border-l-primary", chip: "text-primary", soft: "bg-primary-soft" },
  secondary: { bar: "border-l-secondary", chip: "text-secondary", soft: "bg-secondary-soft" },
  success: { bar: "border-l-success", chip: "text-success", soft: "bg-success/10" },
  warning: { bar: "border-l-warning", chip: "text-warning", soft: "bg-warning/10" },
  danger: { bar: "border-l-danger", chip: "text-danger", soft: "bg-danger/10" },
};

export default function NotesPage() {
  const activeLevel = useAppStore((s) => s.activeLevel);
  const completedDays = useAppStore((s) => s.completedDays);
  const levelArchive = useAppStore((s) => s.levelArchive);

  const completedFor = useMemo(
    () => (level: MajorLevel) =>
      level === activeLevel ? completedDays : levelArchive[level]?.completedDays ?? [],
    [activeLevel, completedDays, levelArchive]
  );

  const isUnlocked = useMemo(
    () => (level: MajorLevel) => {
      const li = MAJOR_LEVELS.indexOf(level);
      const ai = MAJOR_LEVELS.indexOf(activeLevel);
      if (li < ai) return true; // level was passed / skipped over
      return completedFor(level).includes(30); // level fully finished
    },
    [activeLevel, completedFor]
  );

  const unlocked = MAJOR_LEVELS.filter(isUnlocked);
  const [selected, setSelected] = useState<MajorLevel | null>(unlocked[unlocked.length - 1] ?? null);

  const current = selected && isUnlocked(selected) ? levelNotes[selected] : null;

  return (
    <AppShell
      title="Catatan"
      subtitle="Rangkuman lengkap tiap level dengan metode Cornell — terbuka setelah level dilewati atau diselesaikan."
    >
      <AppGuard>
        {/* Level selector */}
        <div className="flex flex-wrap gap-2">
          {MAJOR_LEVELS.map((lvl) => {
            const open = isUnlocked(lvl);
            const isSel = selected === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => open && setSelected(lvl)}
                disabled={!open}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-heading text-sm font-bold transition-all focusable",
                  isSel
                    ? "border-primary bg-primary text-white dark:text-bg"
                    : open
                    ? "border-border bg-card text-ink hover:border-primary hover:bg-primary-soft/40"
                    : "border-border bg-elevated text-muted cursor-not-allowed"
                )}
              >
                {!open && <Lock className="h-3.5 w-3.5" />}
                {lvl}
              </button>
            );
          })}
        </div>

        {!current ? (
          <div className="mt-8">
            <EmptyState
              icon={<NotebookText className="h-6 w-6" />}
              title="Belum ada catatan yang terbuka"
              description="Catatan sebuah level terbuka otomatis ketika kamu menyelesaikan seluruh 30 harinya, atau ketika kamu melompati level itu (skip) dari Roadmap. Selesaikan atau lewati sebuah level untuk membukanya."
            />
          </div>
        ) : (
          <div className="mt-6">
            {/* Header */}
            <div className="card-base overflow-hidden">
              <div className="bg-gradient-to-br from-primary-soft/80 to-card p-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-heading font-extrabold text-white dark:text-bg">
                    {current.level}
                  </span>
                  <div>
                    <h2 className="font-heading text-xl font-extrabold text-ink">{current.title}</h2>
                    <p className="text-sm text-muted">{current.subtitle}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cornell sections: cue (left) | notes (right) */}
            <div className="mt-4 space-y-3">
              {current.sections.map((sec) => {
                const c = COLOR[sec.color];
                return (
                  <div
                    key={sec.id}
                    className={cn(
                      "grid overflow-hidden rounded-2xl border border-border border-l-4 bg-card sm:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]",
                      c.bar
                    )}
                  >
                    <div className={cn("p-4 sm:border-r border-border", c.soft)}>
                      <p className={cn("font-heading text-sm font-extrabold", c.chip)}>{sec.cue}</p>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-1.5">
                        {sec.notes.map((n, i) => (
                          <li key={i} className="flex gap-2 text-sm text-ink/90">
                            <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", c.chip, "bg-current")} />
                            <span><FormattedText text={n} /></span>
                          </li>
                        ))}
                      </ul>
                      {sec.example && (
                        <div className="mt-3 rounded-xl bg-elevated p-3">
                          <p className="font-mono text-sm font-bold text-ink">{sec.example.de}</p>
                          <p className="mt-0.5 text-xs text-muted">{sec.example.id}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tips & tricks */}
            <div className="mt-4 rounded-2xl border border-warning/30 bg-warning/10 p-5">
              <p className="flex items-center gap-2 font-heading font-bold text-ink">
                <Lightbulb className="h-5 w-5 text-warning" /> Tips &amp; Trik
              </p>
              <ul className="mt-3 space-y-2">
                {current.tips.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink/90">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                    <span><FormattedText text={t} /></span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cornell summary bar */}
            <div className="mt-4 rounded-2xl border border-primary/30 bg-primary-soft/50 p-5">
              <p className="flex items-center gap-2 font-heading font-bold text-primary">
                <Sparkles className="h-5 w-5" /> Ringkasan
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                <FormattedText text={current.summary} />
              </p>
            </div>
          </div>
        )}
      </AppGuard>
    </AppShell>
  );
}
