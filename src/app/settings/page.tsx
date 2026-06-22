"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Monitor,
  Clock,
  Volume2,
  VolumeX,
  Languages,
  Bell,
  RotateCcw,
  Download,
  Flame,
  Award,
  LogOut,
  Music,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { CTAButton } from "@/components/ui/cta-button";
import { LevelBadge } from "@/components/ui/level-badge";
import { useAppStore } from "@/lib/store";
import { computeVocabCounts, deriveBadges } from "@/lib/derive";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const profile = useAppStore((s) => s.profile);
  const streak = useAppStore((s) => s.streak);
  const xp = useAppStore((s) => s.xp);
  const completedDays = useAppStore((s) => s.completedDays);
  const speakingAttempts = useAppStore((s) => s.speakingAttempts);
  const vocabStatus = useAppStore((s) => s.vocabStatus);
  const dailyTargetMinutes = useAppStore((s) => s.dailyTargetMinutes);
  const setDailyTarget = useAppStore((s) => s.setDailyTarget);
  const audioSpeed = useAppStore((s) => s.audioSpeed);
  const setAudioSpeed = useAppStore((s) => s.setAudioSpeed);
  const explanationLang = useAppStore((s) => s.explanationLang);
  const setExplanationLang = useAppStore((s) => s.setExplanationLang);
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const setSoundEnabled = useAppStore((s) => s.setSoundEnabled);
  const resetProgress = useAppStore((s) => s.resetProgress);
  const resetAll = useAppStore((s) => s.resetAll);

  useEffect(() => setMounted(true), []);

  const name = profile?.name ?? "Pelajar";
  const masteredVocab = computeVocabCounts(vocabStatus).mastered;
  const badges = deriveBadges({ streak, completedDays, xp, speakingAttempts, masteredVocab });

  function exportProgress() {
    const data = JSON.stringify(useAppStore.getState(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deutsch30-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell title="Settings" subtitle="Atur tampilan, target belajar, dan preferensi belajarmu.">
      <AppGuard>
        <div className="card-base mb-5 flex items-center gap-4 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary font-heading text-2xl font-extrabold text-onprimary">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-lg font-extrabold text-ink">{name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
              <LevelBadge level={profile?.startLevel ?? "A1.1"} />
              <span className="inline-flex items-center gap-1"><Flame className="h-4 w-4 text-secondary" /> {streak} hari</span>
              {profile?.goal && <span>· Tujuan: {profile.goal}</span>}
            </div>
          </div>
        </div>

        <div className="card-base mb-5 p-5">
          <h2 className="flex items-center gap-2 font-heading font-bold text-ink">
            <Award className="h-5 w-5 text-secondary" /> Badge yang diraih
          </h2>
          {badges.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span key={b} className="rounded-lg bg-secondary-soft px-3 py-1.5 text-sm font-bold text-secondary">
                  {b}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">
              Belum ada badge. Selesaikan pelajaran dan jaga streak untuk membuka badge pertamamu.
            </p>
          )}
        </div>

        <SettingGroup title="Tema" icon={<Sun className="h-5 w-5" />}>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "light", label: "Terang", icon: Sun },
              { value: "dark", label: "Gelap", icon: Moon },
              { value: "system", label: "Sistem", icon: Monitor },
            ].map((opt) => {
              const Icon = opt.icon;
              const active = mounted && theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-bold transition-colors focusable",
                    active ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted hover:text-ink"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </SettingGroup>

        <SettingGroup title="Target belajar harian" icon={<Clock className="h-5 w-5" />}>
          <div className="flex flex-wrap gap-2">
            {[15, 30, 45, 60, 90].map((m) => (
              <button
                key={m}
                onClick={() => setDailyTarget(m)}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-bold transition-colors focusable",
                  dailyTargetMinutes === m ? "bg-primary text-onprimary" : "bg-elevated text-muted hover:text-ink"
                )}
              >
                {m} menit
              </button>
            ))}
          </div>
        </SettingGroup>

        <SettingGroup title="Kecepatan audio" icon={<Volume2 className="h-5 w-5" />}>
          <div className="flex flex-wrap gap-2">
            {[0.75, 1, 1.25].map((s) => (
              <button
                key={s}
                onClick={() => setAudioSpeed(s)}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-bold transition-colors focusable",
                  audioSpeed === s ? "bg-primary text-onprimary" : "bg-elevated text-muted hover:text-ink"
                )}
              >
                {s}x
              </button>
            ))}
          </div>
        </SettingGroup>

        <SettingGroup title="Efek suara" icon={<Music className="h-5 w-5" />}>
          <p className="mb-3 text-sm text-muted">
            Suara saat menekan tombol, menjawab benar/salah, dan menyelesaikan pelajaran agar
            belajar terasa lebih hidup.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              data-no-sound
              onClick={() => {
                setSoundEnabled(true);
                playSound("correct");
              }}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition-colors focusable",
                soundEnabled
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-card text-muted hover:text-ink"
              )}
            >
              <Volume2 className="h-5 w-5" /> Aktif
            </button>
            <button
              data-no-sound
              onClick={() => setSoundEnabled(false)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition-colors focusable",
                !soundEnabled
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-card text-muted hover:text-ink"
              )}
            >
              <VolumeX className="h-5 w-5" /> Mati
            </button>
          </div>
        </SettingGroup>

        <SettingGroup title="Bahasa penjelasan" icon={<Languages className="h-5 w-5" />}>
          <div className="flex flex-wrap gap-2">
            {["Indonesia", "Inggris"].map((l) => (
              <button
                key={l}
                onClick={() => setExplanationLang(l)}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-bold transition-colors focusable",
                  explanationLang === l ? "bg-primary text-onprimary" : "bg-elevated text-muted hover:text-ink"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </SettingGroup>

        <SettingGroup title="Pengingat harian" icon={<Bell className="h-5 w-5" />}>
          <p className="text-sm text-muted">
            Pengingat belajar akan tersedia segera. Untuk sekarang, jaga streak-mu dengan masuk setiap hari.
          </p>
        </SettingGroup>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <CTAButton variant="outline" onClick={exportProgress}>
            <Download className="h-4 w-4" /> Export progress
          </CTAButton>
          <CTAButton
            variant="outline"
            onClick={() => {
              if (confirm("Reset semua progres belajar? Profil dan pengaturan tetap disimpan.")) {
                resetProgress();
              }
            }}
          >
            <RotateCcw className="h-4 w-4" /> Reset progress
          </CTAButton>
          <CTAButton
            variant="outline"
            onClick={() => {
              if (confirm("Keluar dan hapus semua data? Kamu akan mulai onboarding dari awal.")) {
                resetAll();
                router.replace("/onboarding");
              }
            }}
          >
            <LogOut className="h-4 w-4" /> Mulai ulang akun
          </CTAButton>
        </div>
      </AppGuard>
    </AppShell>
  );
}

function SettingGroup({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="card-base mb-4 p-5">
      <h2 className="mb-3 flex items-center gap-2 font-heading font-bold text-ink">
        <span className="text-primary">{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}
