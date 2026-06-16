"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Clock, Target, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import { LessonPlayer } from "@/components/learning/lesson-player";
import { getLessonByDay, lessons } from "@/data/lessons";
import { CTAButton } from "@/components/ui/cta-button";
import { LevelBadge } from "@/components/ui/level-badge";
import { useAppStore, useHydrated } from "@/lib/store";
import { formatMinutes } from "@/lib/utils";
import { playSound } from "@/lib/sound";

export default function LessonPage() {
  const hydrated = useHydrated();
  const profile = useAppStore((s) => s.profile);
  const currentDay = useAppStore((s) => s.currentDay);
  const completedDays = useAppStore((s) => s.completedDays);
  const router = useRouter();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (hydrated && !profile) router.replace("/onboarding");
  }, [hydrated, profile, router]);

  if (!hydrated || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const lastAvailableDay = lessons[lessons.length - 1]?.day ?? 1;
  const lesson = getLessonByDay(currentDay) ?? getLessonByDay(Math.min(currentDay, lastAvailableDay));
  const alreadyDone = completedDays.includes(currentDay);

  if (!lesson) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
        <h1 className="font-heading text-2xl font-extrabold text-ink">
          Materi hari {currentDay} sedang disiapkan
        </h1>
        <p className="max-w-sm text-muted">
          Pelajaran interaktif untuk hari ini akan segera hadir. Sementara itu, kamu bisa
          memperkuat ingatan lewat review.
        </p>
        <div className="flex gap-3">
          <CTAButton href="/review">Mulai Review</CTAButton>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center rounded-xl border border-border bg-card px-5 font-heading font-bold text-ink hover:bg-elevated focusable"
          >
            Ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // If started, show the full lesson player
  if (started) {
    return (
      <div className="min-h-screen bg-bg">
        <LessonPlayer lesson={lesson} />
      </div>
    );
  }

  // Overview screen — user sees what they'll learn before entering
  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-4 py-8 sm:px-6">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink focusable rounded-lg w-fit"
        >
          ← Kembali ke Dashboard
        </Link>

        <div className="card-base overflow-hidden">
          <div className="bg-gradient-to-br from-primary-soft/80 to-card p-6">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white dark:text-bg">
                Hari {lesson.day}
              </span>
              <LevelBadge level={lesson.subLevel} variant="soft" />
              {alreadyDone && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Selesai
                </span>
              )}
            </div>
            <h1 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {lesson.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {formatMinutes(lesson.estimatedMinutes)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> {lesson.steps.length} langkah
              </span>
            </div>
          </div>

          <div className="p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold text-ink">
              <Target className="h-5 w-5 text-primary" /> Target hari ini
            </h2>
            <ul className="mt-3 space-y-2">
              {lesson.goal.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink/90">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {g}
                </li>
              ))}
            </ul>

            <h2 className="mt-6 flex items-center gap-2 font-heading text-base font-bold text-ink">
              <BookOpen className="h-5 w-5 text-secondary" /> Apa yang akan kamu lakukan
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from(new Set(lesson.steps.map((s) => s.type))).map((type) => {
                const labels: Record<string, string> = {
                  story: "Cerita",
                  pattern: "Pola & rumus",
                  example: "Contoh berwarna",
                  drill: "Latihan pilih",
                  listening: "Dengarkan",
                  speaking: "Ucapkan",
                  writing: "Tulis jawaban",
                  mistake: "Penjelasan kesalahan",
                  victory: "Ringkasan",
                };
                return (
                  <span key={type} className="rounded-lg bg-elevated px-2.5 py-1 text-xs font-bold text-muted">
                    {labels[type] ?? type}
                  </span>
                );
              })}
            </div>

            <div className="mt-8">
              <CTAButton
                onClick={() => {
                  playSound("start");
                  setStarted(true);
                }}
                size="lg"
                className="w-full"
              >
                {alreadyDone ? "Ulangi Pelajaran" : "Mulai Belajar"} <ArrowRight className="h-5 w-5" />
              </CTAButton>
              {alreadyDone && (
                <p className="mt-3 text-center text-sm text-muted">
                  Kamu sudah menyelesaikan hari ini. Mengulangi pelajaran tidak meresetprogres.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
