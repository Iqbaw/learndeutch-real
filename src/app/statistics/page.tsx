"use client";

import {
  Activity,
  Gauge,
  Mic,
  BookText,
  Network,
  RefreshCw,
  Globe,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { SkillRadar } from "@/components/stats/skill-radar";
import { WeeklyChart } from "@/components/stats/weekly-chart";
import { AIInsightCard } from "@/components/cards/ai-insight-card";
import { StatCard } from "@/components/cards/stat-card";
import { LevelBadge } from "@/components/ui/level-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CTAButton } from "@/components/ui/cta-button";
import { useAppStore } from "@/lib/store";
import { deriveStats } from "@/lib/derive";

export default function StatisticsPage() {
  const profile = useAppStore((s) => s.profile);
  const currentDay = useAppStore((s) => s.currentDay);
  const completedDays = useAppStore((s) => s.completedDays);
  const skillStats = useAppStore((s) => s.skillStats);
  const grammarStats = useAppStore((s) => s.grammarStats);
  const vocabStatus = useAppStore((s) => s.vocabStatus);
  const speakingAttempts = useAppStore((s) => s.speakingAttempts);
  const placement = useAppStore((s) => s.placement);

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

  return (
    <AppShell
      title="Statistics"
      subtitle="Tahu level aslimu, bukan cuma merasa sudah bisa. Statistik yang jujur dan berguna."
    >
      <AppGuard>
        {!stats.hasData ? (
          <EmptyState
            icon={<BarChart3 className="h-6 w-6" />}
            title="Statistik akan muncul setelah kamu mulai belajar"
            description="Selesaikan pelajaran, review kosakata, dan latihan speaking. Setiap aktivitas mengisi radar skill, mastery grammar, dan estimasi level CEFR-mu di sini — semuanya dari data nyatamu."
            action={<CTAButton href="/lesson">Mulai Hari Ini</CTAButton>}
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="card-base p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Estimasi CEFR</p>
                <p className="mt-1 font-heading text-3xl font-extrabold text-ink">{stats.estimatedLevel}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-muted">Confidence</span>
                  <LevelBadge level={`${stats.confidence}%`} />
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-elevated">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${stats.confidence}%` }} />
                </div>
              </div>
              <StatCard label="Level Aktif" value={stats.activeLevel} hint="bicara & menulis" accent="secondary" icon={<Mic className="h-5 w-5" />} />
              <StatCard label="Level Pasif" value={stats.passiveLevel} hint="membaca & mendengar" icon={<BookText className="h-5 w-5" />} />
              <StatCard label="Real Use Score" value={`${stats.realUse}%`} hint="pakai bahasa di situasi nyata" accent="success" icon={<Globe className="h-5 w-5" />} />
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              <div className="card-base p-5 lg:col-span-2">
                <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-ink">
                  <Activity className="h-5 w-5 text-primary" /> CEFR Skill Radar
                </h2>
                <SkillRadar data={stats.skills} height={300} />
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {stats.skills.map((s) => (
                    <div key={s.skill} className="rounded-lg bg-elevated px-2.5 py-2 text-center">
                      <p className="text-xs text-muted">{s.skill}</p>
                      <p className="font-heading text-sm font-extrabold text-ink">{s.value}%</p>
                    </div>
                  ))}
                </div>
              </div>
              <AIInsightCard title="AI Insight" className="lg:self-start">
                {stats.aiInsight}
              </AIInsightCard>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="card-base p-5">
                <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-ink">
                  <BookText className="h-5 w-5 text-primary" /> Vocabulary Mastery
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniStat label="Pasif dikenal" value={stats.vocab.passive} color="text-primary" />
                  <MiniStat label="Aktif dikuasai" value={stats.vocab.active} color="text-success" />
                  <MiniStat label="Perlu review" value={stats.vocab.weak} color="text-warning" />
                  <MiniStat label="Sedang belajar" value={stats.vocab.learning} color="text-secondary" />
                </div>
              </div>

              <div className="card-base p-5">
                <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-ink">
                  <Network className="h-5 w-5 text-primary" /> Grammar Mastery
                </h2>
                <div className="mt-4 space-y-3">
                  {stats.grammarMastery.map((g) => (
                    <div key={g.topic}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">{g.topic}</span>
                        <span className="font-bold text-ink">{g.value}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-elevated">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${g.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              <div className="card-base p-5 lg:col-span-2">
                <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-ink">
                  <TrendingUp className="h-5 w-5 text-primary" /> Weekly Report
                </h2>
                <p className="mb-2 mt-1 text-sm text-muted">Akurasi latihanmu.</p>
                {stats.weekly.length > 0 ? (
                  <WeeklyChart data={stats.weekly} />
                ) : (
                  <p className="py-8 text-center text-sm text-muted">Belum ada data mingguan.</p>
                )}
              </div>
              <div className="card-base flex flex-col justify-center p-5">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-secondary" />
                  <h3 className="font-heading font-bold text-ink">Retention</h3>
                </div>
                <p className="mt-3 font-heading text-5xl font-extrabold text-ink">{stats.retention}%</p>
                <p className="mt-1 text-sm text-muted">Bagian kata yang sudah mencapai status hampir/dikuasai.</p>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-elevated p-3">
                  <Gauge className="h-5 w-5 text-primary" />
                  <p className="text-sm text-ink">
                    Confidence keseluruhan <span className="font-bold">{stats.confidence}%</span>. Makin
                    banyak latihan, makin akurat estimasinya.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </AppGuard>
    </AppShell>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl bg-elevated p-3">
      <p className={`font-heading text-2xl font-extrabold ${color}`}>{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
