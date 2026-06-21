"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Clock,
  Target,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  AlertCircle,
} from "lucide-react";
import { LessonPlayer } from "@/components/learning/lesson-player";
import { getLessonByDay, lessons } from "@/data/lessons";
import { a1Days } from "@/data/levels";
import { CTAButton } from "@/components/ui/cta-button";
import { LevelBadge } from "@/components/ui/level-badge";
import { useAppStore, useHydrated } from "@/lib/store";
import { formatMinutes } from "@/lib/utils";
import { playSound } from "@/lib/sound";
import { fetchAIEnabled, fetchPersonalizedLesson, type LessonRequest } from "@/services/lesson-client";
import type { CEFRLevel, Lesson } from "@/types";

export default function LessonPage() {
  const hydrated = useHydrated();
  const profile = useAppStore((s) => s.profile);
  const placement = useAppStore((s) => s.placement);
  const errors = useAppStore((s) => s.errors);
  const currentDay = useAppStore((s) => s.currentDay);
  const completedDays = useAppStore((s) => s.completedDays);
  const router = useRouter();

  const [started, setStarted] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(false);

  useEffect(() => {
    if (hydrated && !profile) router.replace("/onboarding");
  }, [hydrated, profile, router]);

  useEffect(() => {
    let cancelled = false;
    fetchAIEnabled().then((v) => {
      if (!cancelled) setAiEnabled(v);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const staticLesson = useMemo(() => {
    const lastAvailableDay = lessons[lessons.length - 1]?.day ?? 1;
    return getLessonByDay(currentDay) ?? getLessonByDay(Math.min(currentDay, lastAvailableDay));
  }, [currentDay]);

  const dayMeta = useMemo(() => a1Days.find((d) => d.day === currentDay), [currentDay]);

  const alreadyDone = completedDays.includes(currentDay);

  // Scaffold used both for the overview and as the brief for AI personalization.
  const scaffold = useMemo(() => {
    const subLevel: CEFRLevel =
      staticLesson?.subLevel ?? (dayMeta?.subLevel as CEFRLevel) ?? profile?.startLevel ?? "A1.1";
    return {
      day: currentDay,
      subLevel,
      title: staticLesson?.title ?? dayMeta?.theme ?? "Pelajaran bahasa Jerman",
      goal: staticLesson?.goal ?? (dayMeta ? [dayMeta.skill] : ["Belajar materi hari ini"]),
      estimatedMinutes: staticLesson?.estimatedMinutes ?? dayMeta?.estimatedMinutes ?? 35,
    };
  }, [staticLesson, dayMeta, profile, currentDay]);

  function buildRequest(): LessonRequest {
    const recentErrorCategories = Array.from(
      new Set(errors.slice(0, 12).map((e) => e.category))
    ).slice(0, 3);
    return {
      day: scaffold.day,
      subLevel: scaffold.subLevel,
      theme: scaffold.title,
      goal: scaffold.goal,
      profile: {
        name: profile?.name,
        goal: profile?.goal,
        weakSkill: profile?.weakSkill,
        learningStyle: profile?.learningStyle,
        estimatedLevel: placement?.estimatedLevel ?? profile?.startLevel,
      },
      recentErrorCategories,
      focusAreas: placement?.focusAreas ?? [],
    };
  }

  async function startWithAI() {
    setGenError(false);
    setGenerating(true);
    playSound("start");
    const lesson = await fetchPersonalizedLesson(buildRequest());
    setGenerating(false);
    if (lesson) {
      setActiveLesson(lesson);
      setStarted(true);
    } else if (staticLesson) {
      // graceful fallback to the bundled lesson
      setGenError(true);
      setActiveLesson(staticLesson);
      setStarted(true);
    } else {
      setGenError(true);
    }
  }

  function startStatic() {
    if (!staticLesson) return;
    playSound("start");
    setActiveLesson(staticLesson);
    setStarted(true);
  }

  if (!hydrated || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Playing a lesson (AI-personalized or static)
  if (started && activeLesson) {
    return (
      <div className="min-h-screen bg-bg">
        <LessonPlayer lesson={activeLesson} />
      </div>
    );
  }

  const withinCourse = currentDay <= 30;
  const canUseAI = aiEnabled === true && withinCourse;

  // No bundled lesson AND AI unavailable → nothing we can show.
  if (!staticLesson && !canUseAI) {
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

  // Overview screen
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white dark:text-bg">
                Hari {scaffold.day}
              </span>
              <LevelBadge level={scaffold.subLevel} variant="soft" />
              {canUseAI && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
                  <BrainCircuit className="h-3.5 w-3.5" /> Dipersonalisasi AI
                </span>
              )}
              {alreadyDone && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Selesai
                </span>
              )}
            </div>
            <h1 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {scaffold.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {formatMinutes(scaffold.estimatedMinutes)}
              </span>
              {staticLesson && (
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" /> {staticLesson.steps.length} langkah
                </span>
              )}
            </div>
          </div>

          <div className="p-6">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold text-ink">
              <Target className="h-5 w-5 text-primary" /> Target hari ini
            </h2>
            <ul className="mt-3 space-y-2">
              {scaffold.goal.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink/90">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {g}
                </li>
              ))}
            </ul>

            {canUseAI && (
              <div className="mt-5 rounded-2xl border border-primary/30 bg-primary-soft/40 p-4">
                <p className="flex items-center gap-2 font-heading text-sm font-bold text-ink">
                  <BrainCircuit className="h-4 w-4 text-primary" /> Disesuaikan untukmu
                </p>
                <p className="mt-1 text-sm text-muted">
                  Pelajaran ini akan dibuat khusus berdasarkan level, tujuan
                  {profile.weakSkill && profile.weakSkill !== "Belum tahu"
                    ? `, dan kelemahanmu di ${profile.weakSkill.toLowerCase()}`
                    : ""}
                  {errors.length > 0 ? ", serta kesalahan yang sering kamu buat" : ""}.
                </p>
              </div>
            )}

            {genError && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-secondary/30 bg-secondary-soft/40 p-3 text-sm text-ink">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span>
                  Personalisasi AI belum bisa dibuat sekarang
                  {staticLesson ? " — kami pakai versi standar dulu." : ". Coba lagi sebentar lagi."}
                </span>
              </div>
            )}

            <div className="mt-8 space-y-3">
              {canUseAI ? (
                <>
                  <CTAButton onClick={startWithAI} size="lg" className="w-full" disabled={generating}>
                    {generating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Menyusun pelajaranmu...
                      </>
                    ) : (
                      <>
                        {alreadyDone ? "Ulangi" : "Mulai Belajar"} — Versi AI{" "}
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </CTAButton>
                  {staticLesson && (
                    <button
                      type="button"
                      onClick={startStatic}
                      disabled={generating}
                      className="w-full rounded-xl border border-border bg-card px-5 py-3 font-heading text-sm font-bold text-ink hover:bg-elevated focusable disabled:opacity-50"
                    >
                      Pakai versi standar
                    </button>
                  )}
                </>
              ) : (
                <CTAButton onClick={startStatic} size="lg" className="w-full" disabled={!staticLesson}>
                  {alreadyDone ? "Ulangi Pelajaran" : "Mulai Belajar"} <ArrowRight className="h-5 w-5" />
                </CTAButton>
              )}

              {alreadyDone && (
                <p className="text-center text-sm text-muted">
                  Kamu sudah menyelesaikan hari ini. Mengulangi pelajaran tidak mereset progres.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
