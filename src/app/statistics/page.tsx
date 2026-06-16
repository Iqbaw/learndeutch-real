import {
  Activity,
  Gauge,
  Mic,
  BookText,
  Network,
  RefreshCw,
  Globe,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { SkillRadar } from "@/components/stats/skill-radar";
import { WeeklyChart } from "@/components/stats/weekly-chart";
import { AIInsightCard } from "@/components/cards/ai-insight-card";
import { StatCard } from "@/components/cards/stat-card";
import { LevelBadge } from "@/components/ui/level-badge";
import { stats } from "@/data/stats";

export default function StatisticsPage() {
  return (
    <AppShell title="Statistics" subtitle="Tahu level aslimu, bukan cuma merasa sudah bisa. Statistik yang jujur dan berguna.">
      {/* Top: estimated level + confidence */}
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

      {/* Radar + AI insight */}
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
                <p className="font-heading text-sm font-extrabold text-ink">{s.level}</p>
              </div>
            ))}
          </div>
        </div>
        <AIInsightCard title="AI Insight" className="lg:self-start">
          {stats.aiInsight}
        </AIInsightCard>
      </div>

      {/* Vocabulary + grammar mastery */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="card-base p-5">
          <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-ink">
            <BookText className="h-5 w-5 text-primary" /> Vocabulary Mastery
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MiniStat label="Pasif dikenal" value={stats.vocabulary.passive} color="text-primary" />
            <MiniStat label="Aktif dipakai" value={stats.vocabulary.active} color="text-success" />
            <MiniStat label="Kata lemah" value={stats.vocabulary.weak} color="text-warning" />
            <MiniStat label="Terlupakan" value={stats.vocabulary.forgotten} color="text-danger" />
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

      {/* Weekly report + retention */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="card-base p-5 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-ink">
            <TrendingUp className="h-5 w-5 text-primary" /> Weekly Report
          </h2>
          <p className="mb-2 mt-1 text-sm text-muted">Akurasi latihan per minggu.</p>
          <WeeklyChart data={stats.weekly} />
        </div>
        <div className="card-base flex flex-col justify-center p-5">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-secondary" />
            <h3 className="font-heading font-bold text-ink">Retention 14 hari</h3>
          </div>
          <p className="mt-3 font-heading text-5xl font-extrabold text-ink">{stats.retention14}%</p>
          <p className="mt-1 text-sm text-muted">Seberapa kuat kamu mengingat materi lama setelah 14 hari.</p>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-elevated p-3">
            <Gauge className="h-5 w-5 text-primary" />
            <p className="text-sm text-ink">
              Confidence keseluruhan <span className="font-bold">{stats.confidence}%</span>. Ambil
              test tambahan untuk meningkatkan akurasi estimasi.
            </p>
          </div>
        </div>
      </div>
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
