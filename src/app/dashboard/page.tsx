import Link from "next/link";
import {
  AlertCircle,
  RefreshCw,
  Flame,
  Trophy,
  ArrowRight,
  Activity,
  CalendarDays,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { MissionCard } from "@/components/learning/mission-card";
import { DayMap } from "@/components/learning/day-map";
import { SkillRadar } from "@/components/stats/skill-radar";
import { AIInsightCard } from "@/components/cards/ai-insight-card";
import { StatCard } from "@/components/cards/stat-card";
import { CTAButton } from "@/components/ui/cta-button";
import { LevelBadge } from "@/components/ui/level-badge";
import { getLessonByDay } from "@/data/lessons";
import { a1Roadmap } from "@/data/levels";
import { demoUser } from "@/data/user";
import { stats } from "@/data/stats";
import { reviewSummary } from "@/data/review";

export default function DashboardPage() {
  const lesson = getLessonByDay(demoUser.day)!;

  return (
    <AppShell
      title={`Hallo, ${demoUser.name}! 👋`}
      subtitle="Ini kondisi belajarmu hari ini. Ayo lanjutkan."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Today's Mission (spans 2) */}
        <div className="lg:col-span-2">
          <MissionCard lesson={lesson} progress={35} />
        </div>

        {/* Streak + consistency */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="card-base flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-soft text-secondary">
              <Flame className="h-7 w-7" />
            </div>
            <div>
              <p className="font-heading text-2xl font-extrabold text-ink">{demoUser.streak} hari</p>
              <p className="text-sm text-muted">Streak konsistensi</p>
            </div>
          </div>
          <div className="card-base flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <Trophy className="h-7 w-7" />
            </div>
            <div>
              <p className="font-heading text-2xl font-extrabold text-ink">{demoUser.xp.toLocaleString("id-ID")} XP</p>
              <p className="text-sm text-muted">{demoUser.badges.length} badge diraih</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skill radar + AI coach */}
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
          <SkillRadar data={stats.skills} />
        </div>

        <div className="flex flex-col gap-5">
          <AIInsightCard>
            Vocabulary kamu kuat, tapi speaking kamu masih pasif. Hari ini aku tambahkan
            3 latihan bicara pendek di Speaking Lab.
          </AIInsightCard>
          <div className="card-base p-5">
            <h3 className="flex items-center gap-2 font-heading text-base font-bold text-ink">
              <AlertCircle className="h-5 w-5 text-warning" /> Weakness Box
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" /> Artikel der/die/das</li>
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" /> Posisi verb setelah “Heute”</li>
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" /> Pengucapan “ch”</li>
            </ul>
            <CTAButton href="/errors" variant="outline" size="sm" className="mt-4 w-full">
              Buka Error Notebook
            </CTAButton>
          </div>
        </div>
      </div>

      {/* Review queue + quick stats */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="card-base flex flex-col justify-between p-5 lg:col-span-1">
          <div>
            <h3 className="flex items-center gap-2 font-heading text-base font-bold text-ink">
              <RefreshCw className="h-5 w-5 text-primary" /> Review Queue
            </h3>
            <p className="mt-2 text-sm text-muted">
              <span className="font-heading text-3xl font-extrabold text-ink">{reviewSummary.dueToday}</span>{" "}
              kata perlu direview hari ini.
            </p>
          </div>
          <CTAButton href="/review" className="mt-4 w-full">
            Mulai Review 10 Menit <ArrowRight className="h-4 w-4" />
          </CTAButton>
        </div>

        <StatCard
          label="Estimasi Level"
          value={<span className="flex items-center gap-2">{stats.estimatedLevel} <LevelBadge level={`${stats.confidence}%`} /></span>}
          hint={`Aktif ${stats.activeLevel} · Pasif ${stats.passiveLevel}`}
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          label="Retention 14 hari"
          value={`${stats.retention14}%`}
          hint="Seberapa kuat kamu mengingat materi lama"
          accent="secondary"
          icon={<RefreshCw className="h-5 w-5" />}
        />
      </div>

      {/* 30-Day map */}
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
          <DayMap days={a1Roadmap} />
        </div>
      </div>
    </AppShell>
  );
}
