"use client";

import {
  Activity,
  Gauge,
  Mic,
  BookText,
  Network,
  RefreshCw,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { SkillRadar } from "@/components/stats/skill-radar";
import { WeeklyChart } from "@/components/stats/weekly-chart";
import { AIInsightCard } from "@/components/cards/ai-insight-card";
import { StatCard } from "@/components/cards/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { CTAButton } from "@/components/ui/cta-button";
import { useAppStore } from "@/lib/store";
import { deriveStats } from "@/lib/derive";
import { useLearningEvidence } from "@/lib/learning-evidence";

export default function StatisticsPage() {
  const profile = useAppStore((s) => s.profile);
  const currentDay = useAppStore((s) => s.currentDay);
  const completedDays = useAppStore((s) => s.completedDays);
  const skillStats = useAppStore((s) => s.skillStats);
  const grammarStats = useAppStore((s) => s.grammarStats);
  const vocabStatus = useAppStore((s) => s.vocabStatus);
  const speakingAttempts = useAppStore((s) => s.speakingAttempts);
  const placement = useAppStore((s) => s.placement);
  const missions = useLearningEvidence((s) => s.missions);
  const missionEvidence = Object.values(missions);
  const missionPasses = missionEvidence.filter((m) => m.status === "correct").length;
  const delayedPasses = missionEvidence.reduce((sum, m) => sum + m.delayedPasses, 0);

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
      title="Statistik"
      subtitle="Lihat sesi yang selesai, akurasi latihan, misi mandiri, dan kemampuan yang bertahan setelah jeda."
    >
      <AppGuard>
        {!stats.hasData ? (
          <EmptyState
            icon={<BarChart3 className="h-6 w-6" />}
            title="Statistik akan muncul setelah kamu mulai belajar"
            description="Selesaikan pelajaran, kerjakan misi mandiri, dan ulangi pada situasi baru. Tes penempatan memberi perkiraan awal; latihan harian tidak otomatis menetapkan level CEFR."
            action={<CTAButton href="/lesson">Mulai Hari Ini</CTAButton>}
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="card-base p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Tes penempatan</p>
                <p className="mt-1 font-heading text-3xl font-extrabold text-ink">{placement?.estimatedLevel ?? "Belum ada"}</p>
                <p className="mt-2 text-xs text-muted">{placement ? `Perkiraan awal · keyakinan model ${placement.confidence}%` : "Kerjakan tes penempatan jika ingin perkiraan awal."}</p>
              </div>
              <StatCard label="Sesi selesai" value={completedDays.length} hint="penyelesaian, belum otomatis dikuasai" accent="secondary" icon={<BookText className="h-5 w-5" />} />
              <StatCard label="Misi teks terpenuhi" value={`${missionPasses}/${missionEvidence.length}`} hint="berdasarkan kriteria tugas" icon={<Mic className="h-5 w-5" />} />
              <StatCard label="Lolos setelah jeda" value={delayedPasses} hint="situasi baru saat review jatuh tempo" accent="success" icon={<RefreshCw className="h-5 w-5" />} />
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              <div className="card-base p-5 lg:col-span-2">
                <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-ink">
                  <Activity className="h-5 w-5 text-primary" /> Akurasi Format Latihan
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
              <AIInsightCard title="Ringkasan bukti" className="lg:self-start">
                {missionEvidence.length === 0
                  ? "Kerjakan misi mandiri di akhir pelajaran. Setelah jatuh tempo, Review akan memberi situasi baru untuk melihat apakah kemampuan masih bisa dipakai."
                  : `${missionPasses} dari ${missionEvidence.length} misi terakhir memenuhi kriteria teks. ${delayedPasses} uji ulang berhasil setelah jeda. Tinjauan transkrip tidak menilai pelafalan atau kelancaran audio.`}
              </AIInsightCard>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="card-base p-5">
                <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-ink">
                  <BookText className="h-5 w-5 text-primary" /> Status Latihan Vocabulary
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniStat label="Sudah dimulai" value={stats.vocab.passive} color="text-primary" />
                  <MiniStat label="Lancar di review" value={stats.vocab.active} color="text-success" />
                  <MiniStat label="Perlu review" value={stats.vocab.weak} color="text-warning" />
                  <MiniStat label="Sedang belajar" value={stats.vocab.learning} color="text-secondary" />
                </div>
              </div>

              <div className="card-base p-5">
                <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold text-ink">
                  <Network className="h-5 w-5 text-primary" /> Akurasi Latihan Grammar
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
                  <TrendingUp className="h-5 w-5 text-primary" /> Laporan Mingguan
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
                  <h3 className="font-heading font-bold text-ink">Kemajuan kartu vocabulary</h3>
                </div>
                <p className="mt-3 font-heading text-5xl font-extrabold text-ink">{stats.retention}%</p>
                <p className="mt-1 text-sm text-muted">Bagian kata yang mencapai status hampir hafal atau lancar di review aplikasi.</p>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-elevated p-3">
                  <Gauge className="h-5 w-5 text-primary" />
                  <p className="text-sm text-ink">
                    <span className="font-bold">{delayedPasses}</span> misi berhasil dipakai lagi setelah jeda. Nilai kartu vocabulary tidak menggantikan uji ulang misi.
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
