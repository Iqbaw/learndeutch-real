"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  RefreshCw,
  Flame,
  Trophy,
  ArrowRight,
  Activity,
  CalendarDays,
  BookOpen,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { MissionCard } from "@/components/learning/mission-card";
import { DayMap } from "@/components/learning/day-map";
import { SkillRadar } from "@/components/stats/skill-radar";
import { AIInsightCard } from "@/components/cards/ai-insight-card";
import { StatCard } from "@/components/cards/stat-card";
import { CTAButton } from "@/components/ui/cta-button";
import { LevelBadge } from "@/components/ui/level-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getLessonByDay } from "@/data/lessons";
import { daysForLevel } from "@/data/levels";
import { useAppStore } from "@/lib/store";
import { buildRoadmap, buildReviewQueue, deriveStats } from "@/lib/derive";

export default function DashboardPage() {
  const profile = useAppStore((s) => s.profile);
  const currentDay = useAppStore((s) => s.currentDay);
  const completedDays = useAppStore((s) => s.completedDays);
  const streak = useAppStore((s) => s.streak);
  const xp = useAppStore((s) => s.xp);
  const errors = useAppStore((s) => s.errors);
  const vocabStatus = useAppStore((s) => s.vocabStatus);
  const skillStats = useAppStore((s) => s.skillStats);
  const grammarStats = useAppStore((s) => s.grammarStats);
  const speakingAttempts = useAppStore((s) => s.speakingAttempts);
  const placement = useAppStore((s) => s.placement);
  const activeLevel = useAppStore((s) => s.activeLevel);

  const name = profile?.name ?? "Pelajar";
  const lesson = getLessonByDay(activeLevel === "A1" ? currentDay : -1);
  const dayMeta = daysForLevel(activeLevel).find((d) => d.day === currentDay);
  const roadmap = buildRoadmap(currentDay, completedDays, daysForLevel(activeLevel));
  const reviewDue = buildReviewQueue(vocabStatus).length;
  const stats = deriveStats({
    startLevel: profile?.startLevel ?? "A1.1",
    currentDay,
    completedDays,
    skillStats,
    grammarStats,
    vocabStatus,
    speakingAttempts,
    placement,
  });

  // weakness box from real error categories
  const weakness = topErrorCategories(errors);
  // overall A1 progress (days completed out of 30) — never stuck at 0 after a day
  const dayProgress = Math.round((completedDays.length / 30) * 100);

  return (
    <AppShell title={`Hallo, ${name}! 👋`} subtitle="Ini kondisi belajarmu hari ini. Ayo lanjutkan.">
      <AppGuard>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {lesson ? (
              <MissionCard lesson={lesson} progress={dayProgress} />
            ) : (
              <div className="card-base p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white dark:text-bg">
                    {activeLevel} · Hari {currentDay}
                  </span>
                  {dayMeta && <LevelBadge level={dayMeta.subLevel} variant="soft" />}
                </div>
                <h2 className="mt-3 font-heading text-xl font-extrabold text-ink">
                  {dayMeta?.theme ?? `Hari ${currentDay}`}
                </h2>
                <p className="mt-1 text-muted">
                  {dayMeta?.skill ? `Fokus: ${dayMeta.skill}. ` : ""}
                  Pelajaran ini dibuat khusus untukmu oleh AI sesuai level {activeLevel}.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <CTAButton href="/lesson">Mulai Belajar</CTAButton>
                  <CTAButton href="/review" variant="outline">Review</CTAButton>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="card-base flex items-center gap-4 p-5">
              <PopIcon active={streak > 0} glow="rgba(245, 158, 11, 0.55)" className="bg-secondary-soft text-secondary">
                <Flame className="h-7 w-7" />
              </PopIcon>
              <div>
                <p className="font-heading text-2xl font-extrabold text-ink">{streak} hari</p>
                <p className="text-sm text-muted">Streak konsistensi</p>
              </div>
            </div>
            <div className="card-base flex items-center gap-4 p-5">
              <PopIcon active={xp > 0} glow="rgba(99, 102, 241, 0.5)" delay={0.12} className="bg-primary-soft text-primary">
                <Trophy className="h-7 w-7" />
              </PopIcon>
              <div>
                <p className="font-heading text-2xl font-extrabold text-ink">
                  {xp.toLocaleString("id-ID")} XP
                </p>
                <p className="text-sm text-muted">{completedDays.length} hari selesai</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="card-base p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-ink">
                <Activity className="h-5 w-5 text-primary" /> CEFR Skill Radar
              </h2>
              <Link href="/statistics" className="text-sm font-bold text-primary hover:underline">
                Detail
              </Link>
            </div>
            {stats.hasData ? (
              <SkillRadar data={stats.skills} />
            ) : (
              <EmptyState
                icon={<Activity className="h-6 w-6" />}
                title="Belum ada data skill"
                description="Selesaikan pelajaran dan latihan untuk melihat radar kemampuanmu terisi."
              />
            )}
          </div>

          <div className="flex flex-col gap-5">
            <AIInsightCard>{stats.aiInsight}</AIInsightCard>
            <div className="card-base p-5">
              <h3 className="flex items-center gap-2 font-heading text-base font-bold text-ink">
                <AlertCircle className="h-5 w-5 text-warning" /> Weakness Box
              </h3>
              {weakness.length > 0 ? (
                <>
                  <ul className="mt-3 space-y-2 text-sm text-muted">
                    {weakness.map((w) => (
                      <li key={w.category} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                        {w.category} ({w.count}×)
                      </li>
                    ))}
                  </ul>
                  <CTAButton href="/errors" variant="outline" size="sm" className="mt-4 w-full">
                    Buka Error Notebook
                  </CTAButton>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  Belum ada kelemahan terdeteksi. Selesaikan latihan, dan kesalahanmu akan muncul
                  di sini untuk dilatih ulang.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="card-base flex flex-col justify-between p-5 lg:col-span-1">
            <div>
              <h3 className="flex items-center gap-2 font-heading text-base font-bold text-ink">
                <RefreshCw className="h-5 w-5 text-primary" /> Review Queue
              </h3>
              <p className="mt-2 text-sm text-muted">
                <span className="font-heading text-3xl font-extrabold text-ink">{reviewDue}</span>{" "}
                {reviewDue === 0 ? "kartu menunggu — mulai belajar kata baru dulu." : "kata perlu direview hari ini."}
              </p>
            </div>
            <CTAButton href={reviewDue > 0 ? "/review" : "/vocabulary"} className="mt-4 w-full">
              {reviewDue > 0 ? "Mulai Review" : "Pelajari Kosakata"} <ArrowRight className="h-4 w-4" />
            </CTAButton>
          </div>

          <StatCard
            label="Estimasi Level"
            value={
              <span className="flex items-center gap-2">
                {stats.estimatedLevel} <LevelBadge level={`${stats.confidence}%`} />
              </span>
            }
            hint={`Aktif ${stats.activeLevel} · Pasif ${stats.passiveLevel}`}
            icon={<Activity className="h-5 w-5" />}
          />
          <StatCard
            label="Retention"
            value={`${stats.retention}%`}
            hint="Kekuatan ingatan dari kata yang kamu pelajari"
            accent="secondary"
            icon={<RefreshCw className="h-5 w-5" />}
          />
        </div>

        <div className="mt-5 card-base p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-ink">
              <CalendarDays className="h-5 w-5 text-primary" /> 30-Day Map · A1
            </h2>
            <Link href="/roadmap" className="text-sm font-bold text-primary hover:underline">
              Lihat roadmap penuh
            </Link>
          </div>
          <div className="mt-4">
            <DayMap days={roadmap} />
          </div>
        </div>
      </AppGuard>
    </AppShell>
  );
}

function topErrorCategories(errors: { category: string }[]) {
  const counts = new Map<string, number>();
  for (const e of errors) counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}


// A subtle "ignite" pop for the streak & XP icons when you open the dashboard.
// Kept brief (a couple of pulses) so it celebrates without breaking the
// minimalist feel.
function PopIcon({
  children,
  active,
  glow,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  active: boolean;
  glow: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 15, delay }}
      className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${className}`}
    >
      {active && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-2xl"
          animate={{ boxShadow: ["0 0 0 0 rgba(0,0,0,0)", `0 0 20px 4px ${glow}`, "0 0 0 0 rgba(0,0,0,0)"] }}
          transition={{ duration: 1.5, repeat: 2, delay: delay + 0.2 }}
        />
      )}
      <motion.span
        animate={active ? { scale: [1, 1.16, 1], rotate: [0, -5, 0] } : undefined}
        transition={{ duration: 0.9, repeat: 2, delay: delay + 0.25 }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}
