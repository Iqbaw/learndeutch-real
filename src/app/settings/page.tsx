"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Monitor,
  Clock,
  Volume2,
  Languages,
  Bell,
  RotateCcw,
  Download,
  Flame,
  Award,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { CTAButton } from "@/components/ui/cta-button";
import { LevelBadge } from "@/components/ui/level-badge";
import { useAppStore } from "@/lib/store";
import { demoUser } from "@/data/user";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const {
    dailyTargetMinutes,
    setDailyTarget,
    audioSpeed,
    setAudioSpeed,
    explanationLang,
    setExplanationLang,
    resetOnboarding,
  } = useAppStore();

  useEffect(() => setMounted(true), []);

  return (
    <AppShell title="Settings" subtitle="Atur tampilan, target belajar, dan preferensi belajarmu.">
      {/* Profile */}
      <div className="card-base mb-5 flex items-center gap-4 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary font-heading text-2xl font-extrabold text-white dark:text-bg">
          {demoUser.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-lg font-extrabold text-ink">{demoUser.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
            <LevelBadge level={demoUser.currentLevel} />
            <span className="inline-flex items-center gap-1"><Flame className="h-4 w-4 text-secondary" /> {demoUser.streak} hari</span>
            <span>· Tujuan: {demoUser.goal}</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="card-base mb-5 p-5">
        <h2 className="flex items-center gap-2 font-heading font-bold text-ink">
          <Award className="h-5 w-5 text-secondary" /> Badge yang diraih
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {demoUser.badges.map((b) => (
            <span key={b} className="rounded-lg bg-secondary-soft px-3 py-1.5 text-sm font-bold text-secondary">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Theme */}
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

      {/* Daily target */}
      <SettingGroup title="Target belajar harian" icon={<Clock className="h-5 w-5" />}>
        <div className="flex flex-wrap gap-2">
          {[15, 30, 45, 60, 90].map((m) => (
            <button
              key={m}
              onClick={() => setDailyTarget(m)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-bold transition-colors focusable",
                dailyTargetMinutes === m ? "bg-primary text-white dark:text-bg" : "bg-elevated text-muted hover:text-ink"
              )}
            >
              {m} menit
            </button>
          ))}
        </div>
      </SettingGroup>

      {/* Audio speed */}
      <SettingGroup title="Kecepatan audio" icon={<Volume2 className="h-5 w-5" />}>
        <div className="flex flex-wrap gap-2">
          {[0.75, 1, 1.25].map((s) => (
            <button
              key={s}
              onClick={() => setAudioSpeed(s)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-bold transition-colors focusable",
                audioSpeed === s ? "bg-primary text-white dark:text-bg" : "bg-elevated text-muted hover:text-ink"
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </SettingGroup>

      {/* Explanation language */}
      <SettingGroup title="Bahasa penjelasan" icon={<Languages className="h-5 w-5" />}>
        <div className="flex flex-wrap gap-2">
          {["Indonesia", "Inggris"].map((l) => (
            <button
              key={l}
              onClick={() => setExplanationLang(l)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-bold transition-colors focusable",
                explanationLang === l ? "bg-primary text-white dark:text-bg" : "bg-elevated text-muted hover:text-ink"
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </SettingGroup>

      {/* Reminder placeholder */}
      <SettingGroup title="Pengingat harian" icon={<Bell className="h-5 w-5" />}>
        <p className="text-sm text-muted">
          Pengingat belajar akan tersedia segera. Untuk sekarang, jaga streak-mu dengan masuk setiap hari.
        </p>
      </SettingGroup>

      {/* Danger zone */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <CTAButton variant="outline" onClick={() => resetOnboarding()}>
          <RotateCcw className="h-4 w-4" /> Reset progress (mock)
        </CTAButton>
        <CTAButton variant="outline">
          <Download className="h-4 w-4" /> Export progress (mock)
        </CTAButton>
      </div>
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
