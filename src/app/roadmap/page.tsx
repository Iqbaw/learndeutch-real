"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Lock, Check, ArrowRight, AlertTriangle, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { DayMap } from "@/components/learning/day-map";
import { LevelBadge } from "@/components/ui/level-badge";
import { CTAButton } from "@/components/ui/cta-button";
import { SectionHeader } from "@/components/ui/section-header";
import { levels, daysForLevel } from "@/data/levels";
import { buildRoadmap } from "@/lib/derive";
import { useAppStore, MAJOR_LEVELS } from "@/lib/store";
import { cn, formatMinutes } from "@/lib/utils";
import type { MajorLevel } from "@/types";

export default function RoadmapPage() {
  const currentDay = useAppStore((s) => s.currentDay);
  const completedDays = useAppStore((s) => s.completedDays);
  const activeLevel = useAppStore((s) => s.activeLevel);
  const unlockedLevels = useAppStore((s) => s.unlockedLevels);
  const switchLevel = useAppStore((s) => s.switchLevel);
  const skipToLevel = useAppStore((s) => s.skipToLevel);

  const [pendingSkip, setPendingSkip] = useState<MajorLevel | null>(null);

  const active = levels.find((l) => l.id === activeLevel)!;
  const roadmap = buildRoadmap(currentDay, completedDays, daysForLevel(activeLevel));

  function onLevelClick(level: MajorLevel) {
    if (level === activeLevel) return;
    if (unlockedLevels.includes(level)) {
      switchLevel(level);
    } else {
      setPendingSkip(level);
    }
  }

  function confirmSkip() {
    if (pendingSkip) skipToLevel(pendingSkip);
    setPendingSkip(null);
  }

  return (
    <AppShell title="Roadmap" subtitle="Jalur belajarmu dari A1 sampai C2 — satu hari satu langkah jelas.">
      <AppGuard>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map((lvl) => {
            const isActive = lvl.id === activeLevel;
            const isUnlocked = unlockedLevels.includes(lvl.id);
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onLevelClick(lvl.id)}
                className={cn(
                  "card-base p-5 text-left transition-all focusable",
                  isActive && "border-primary/50 shadow-glow",
                  !isActive && "hover:border-primary/40 hover:bg-elevated/40",
                  !isUnlocked && !isActive && "opacity-80"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl font-extrabold text-primary">{lvl.id}</span>
                  {isActive ? (
                    <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-onprimary">
                      Aktif
                    </span>
                  ) : isUnlocked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
                      <Check className="h-3.5 w-3.5" /> Terbuka
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-elevated px-2.5 py-1 text-xs font-bold text-muted">
                      <Lock className="h-3.5 w-3.5" /> Terkunci
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-heading text-sm font-bold text-ink">{lvl.title}</h3>
                <p className="mt-1 text-xs text-muted">{lvl.focus}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    {lvl.subLevels.map((s) => (
                      <LevelBadge key={s.id} level={s.id} />
                    ))}
                  </div>
                  {!isActive && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                      {isUnlocked ? "Buka" : "Lompat"} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-muted">
          Tip: klik level mana pun untuk berpindah. Level yang masih terkunci bisa kamu buka dengan
          konfirmasi (skip) — progres tiap level tetap tersimpan terpisah.
        </p>

        <div className="mt-8">
          <SectionHeader
            eyebrow={`${active.id} · 30 Hari`}
            title={active.title}
            description={active.outcome}
          />
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

        {/* Skip-to-locked-level confirmation */}
        <AnimatePresence>
          {pendingSkip && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setPendingSkip(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm card-base p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-soft text-secondary">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-heading text-lg font-extrabold text-ink">
                  Yakin ingin skip ke level {pendingSkip}?
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Level {pendingSkip} masih terkunci. Dengan melompat ke sini kamu menandai level di
                  bawahnya sebagai &quot;terlewati&quot;. Catatan level yang terlewati akan terbuka, dan kamu
                  tetap bisa kembali kapan saja dari Roadmap.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <CTAButton onClick={confirmSkip} className="w-full">
                    <Sparkles className="h-4 w-4" /> Ya, lompat ke {pendingSkip}
                  </CTAButton>
                  <CTAButton onClick={() => setPendingSkip(null)} variant="outline" className="w-full">
                    Batal
                  </CTAButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AppGuard>
    </AppShell>
  );
}
