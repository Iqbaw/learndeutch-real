"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { DayMap } from "@/components/learning/day-map";
import { LevelBadge } from "@/components/ui/level-badge";
import { SectionHeader } from "@/components/ui/section-header";
import { levels } from "@/data/levels";
import { buildRoadmap } from "@/lib/derive";
import { useAppStore } from "@/lib/store";
import { Clock } from "lucide-react";
import { cn, formatMinutes } from "@/lib/utils";

export default function RoadmapPage() {
  const currentDay = useAppStore((s) => s.currentDay);
  const completedDays = useAppStore((s) => s.completedDays);
  const a1 = levels.find((l) => l.id === "A1")!;
  const roadmap = buildRoadmap(currentDay, completedDays);

  return (
    <AppShell title="Roadmap 30 Hari" subtitle="Jalur belajarmu, satu hari satu langkah jelas.">
      <AppGuard>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map((lvl) => (
            <div
              key={lvl.id}
              className={cn("card-base p-5", lvl.id === "A1" && "border-primary/40 shadow-glow")}
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-2xl font-extrabold text-primary">{lvl.id}</span>
                {lvl.id === "A1" ? (
                  <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white dark:text-bg">
                    Aktif
                  </span>
                ) : (
                  <span className="rounded-full bg-elevated px-2.5 py-1 text-xs font-bold text-muted">
                    {lvl.durationDays} hari
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-heading text-sm font-bold text-ink">{lvl.title}</h3>
              <p className="mt-1 text-xs text-muted">{lvl.focus}</p>
              <div className="mt-3 flex gap-2">
                {lvl.subLevels.map((s) => (
                  <LevelBadge key={s.id} level={s.id} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <SectionHeader eyebrow="A1 · 30 Hari" title={a1.title} description={a1.outcome} />
          <div className="mt-5 card-base p-5">
            <DayMap days={roadmap} />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {roadmap.map((d) => (
            <div
              key={d.day}
              className={cn(
                "flex items-center gap-4 rounded-2xl border border-border bg-card p-4",
                d.status === "active" && "border-primary/40",
                d.status === "done" && "opacity-90"
              )}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-elevated font-heading font-extrabold text-ink">
                {d.day}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading font-bold text-ink">{d.theme}</p>
                <p className="text-xs text-muted">{d.skill}</p>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <LevelBadge level={d.subLevel} />
                <span className="inline-flex items-center gap-1 text-xs text-muted">
                  <Clock className="h-3.5 w-3.5" /> {formatMinutes(d.estimatedMinutes)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </AppGuard>
    </AppShell>
  );
}
