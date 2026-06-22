"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import {
  Sparkles,
  Brain,
  Mic,
  BarChart3,
  CalendarCheck,
  ArrowRight,
  Blocks,
  Radar,
  Palette,
  Compass,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

interface Slide {
  id: string;
  render: () => React.ReactNode;
}

const slides: Slide[] = [
  {
    id: "hero",
    render: () => (
      <div className="flex flex-col items-center text-center">
        <Logo className="h-16 w-16" />
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Belajar dari nol
        </span>
        <h1 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-ink">
          Belajar Bahasa Jerman{" "}
          <span className="text-primary">30 Hari per Level</span>
        </h1>
        <p className="mt-3 max-w-xs text-muted">
          Dari nol sampai percaya diri. Terstruktur, terukur, dan realistis.
        </p>
      </div>
    ),
  },
  {
    id: "problem",
    render: () => (
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary-soft text-secondary">
          <Brain className="h-8 w-8" />
        </div>
        <h2 className="mt-5 font-heading text-2xl font-extrabold tracking-tight text-ink">
          Belajar dengan pola, bukan hafalan buta
        </h2>
        <p className="mt-3 max-w-xs text-muted">
          Grammar Jerman dibuat visual dan masuk akal. Lihat polanya, pahami, tirukan, lalu
          praktik — setiap hari tahu harus belajar apa.
        </p>
      </div>
    ),
  },
  {
    id: "method",
    render: () => (
      <div className="flex flex-col items-center text-center">
        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-ink">
          German King Method
        </h2>
        <p className="mt-2 max-w-xs text-muted">Alat belajar yang membuat grammar terasa mudah.</p>
        <div className="mt-6 grid w-full max-w-xs grid-cols-2 gap-3">
          {[
            { icon: Blocks, label: "Sentence Lego" },
            { icon: Radar, label: "Verb Radar" },
            { icon: Palette, label: "Der/Die/Das" },
            { icon: Compass, label: "Case Compass" },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4">
                <Icon className="h-6 w-6 text-primary" />
                <span className="text-xs font-bold text-ink">{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    ),
  },
  {
    id: "roadmap",
    render: () => (
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-soft text-primary">
          <CalendarCheck className="h-8 w-8" />
        </div>
        <h2 className="mt-5 font-heading text-2xl font-extrabold tracking-tight text-ink">
          30 hari, satu sprint per level
        </h2>
        <p className="mt-3 max-w-xs text-muted">A1, A2, B1, B2, C1, C2 — masing-masing dibagi dua sublevel.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((l, i) => (
            <span
              key={l}
              className={cn(
                "rounded-xl px-3 py-2 font-heading text-sm font-extrabold",
                i === 0 ? "bg-primary text-onprimary" : "bg-elevated text-muted"
              )}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "stats",
    render: () => (
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-success/15 text-success">
          <BarChart3 className="h-8 w-8" />
        </div>
        <h2 className="mt-5 font-heading text-2xl font-extrabold tracking-tight text-ink">
          Tahu level aslimu
        </h2>
        <p className="mt-3 max-w-xs text-muted">
          Statistik CEFR jujur: listening, speaking, grammar, vocabulary, dan AI tutor yang
          menjelaskan kesalahanmu dengan ramah.
        </p>
        <div className="mt-5 flex items-center gap-3">
          <Mic className="h-6 w-6 text-primary" />
          <span className="text-sm text-muted">Latihan speaking dengan mikrofon asli</span>
        </div>
      </div>
    ),
  },
  {
    id: "cta",
    render: () => (
      <div className="flex flex-col items-center text-center">
        <Logo className="h-16 w-16" />
        <h2 className="mt-5 font-heading text-2xl font-extrabold tracking-tight text-ink">
          Siap mulai hari pertamamu?
        </h2>
        <p className="mt-3 max-w-xs text-muted">
          Gratis untuk mencoba A1.1. Tidak perlu login — progresmu tersimpan di perangkat.
        </p>
        <div className="mt-7 flex w-full max-w-xs flex-col gap-3">
          <Link
            href="/onboarding"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary font-heading text-base font-bold text-onprimary shadow-glow active:scale-[0.98] focusable"
          >
            Mulai dari A1.1 <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-border bg-card font-heading font-bold text-ink active:scale-[0.98] focusable"
          >
            Cek Level Saya
          </Link>
        </div>
      </div>
    ),
  },
];

export function MobileLanding() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== active) setActive(idx);
  }

  function goTo(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  const isLast = active === slides.length - 1;

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-bg">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-4">
        <Link href="/" className="flex items-center gap-2 focusable rounded-lg">
          <Logo className="h-9 w-9" />
          <span className="font-heading text-sm font-extrabold text-ink">Deutsch 30</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/onboarding"
            className="rounded-lg px-3 py-2 text-sm font-bold text-muted hover:text-ink focusable"
          >
            Lewati
          </Link>
        </div>
      </div>

      {/* Swipeable slides */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide) => (
          <section
            key={slide.id}
            className="flex h-full w-full shrink-0 snap-center items-center justify-center px-6"
          >
            {slide.render()}
          </section>
        ))}
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col gap-4 px-6 pb-8 pt-2">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Ke slide ${i + 1}`}
              data-no-sound
              className={cn(
                "h-2 rounded-full transition-all",
                i === active ? "w-6 bg-primary" : "w-2 bg-border"
              )}
            />
          ))}
        </div>

        {/* Next / CTA */}
        {isLast ? (
          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-heading text-base font-bold text-onprimary shadow-glow active:scale-[0.98] focusable"
          >
            Mulai Sekarang <ArrowRight className="h-5 w-5" />
          </Link>
        ) : (
          <button
            onClick={() => goTo(active + 1)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-heading text-base font-bold text-onprimary shadow-soft active:scale-[0.98] focusable"
          >
            Lanjut <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
