import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { demoUser } from "@/data/user";
import { Flame } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile brand */}
          <Link
            href="/"
            className="lg:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary font-heading text-lg font-extrabold text-white dark:text-bg focusable"
          >
            D
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-heading text-lg font-extrabold tracking-tight text-ink sm:text-xl">
              {title}
            </h1>
            {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 rounded-xl bg-secondary-soft px-3 py-2 text-sm font-bold text-secondary">
            <Flame className="h-4 w-4" /> {demoUser.streak} hari
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
