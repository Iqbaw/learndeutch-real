"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { LessonPlayer } from "@/components/learning/lesson-player";
import { getLessonByDay, lessons } from "@/data/lessons";
import { CTAButton } from "@/components/ui/cta-button";
import { useAppStore, useHydrated } from "@/lib/store";

export default function LessonPage() {
  const hydrated = useHydrated();
  const profile = useAppStore((s) => s.profile);
  const currentDay = useAppStore((s) => s.currentDay);
  const router = useRouter();

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

  // Use the lesson for the current day; fall back to the latest available lesson.
  const lastAvailableDay = lessons[lessons.length - 1]?.day ?? 1;
  const lesson = getLessonByDay(currentDay) ?? getLessonByDay(Math.min(currentDay, lastAvailableDay));

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

  return (
    <div className="min-h-screen bg-bg">
      <LessonPlayer lesson={lesson} />
    </div>
  );
}
