"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CTAButton } from "@/components/ui/cta-button";
import { Logo } from "@/components/ui/logo";

const links = [
  { label: "Metode", href: "#method" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Statistik", href: "#stats" },
  { label: "FAQ", href: "#faq" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 focusable rounded-lg">
          <Logo className="h-10 w-10" />
          <span className="font-heading text-base font-extrabold text-ink">
            Deutsch <span className="text-primary">30</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-elevated hover:text-ink focusable"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <CTAButton href="/dashboard" variant="outline" size="sm">
            Masuk
          </CTAButton>
          <CTAButton href="/onboarding" size="sm">
            Mulai dari A1.1
          </CTAButton>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Buka menu"
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-ink focusable"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-elevated hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2">
              <CTAButton href="/dashboard" variant="outline" size="sm" className="flex-1">
                Masuk
              </CTAButton>
              <CTAButton href="/onboarding" size="sm" className="flex-1">
                Mulai
              </CTAButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
