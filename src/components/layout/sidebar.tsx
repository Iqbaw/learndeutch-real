"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarNav } from "./nav-config";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { LevelBadge } from "@/components/ui/level-badge";
import { Logo } from "@/components/ui/logo";
import { Flame } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const profile = useAppStore((s) => s.profile);
  const streak = useAppStore((s) => s.streak);
  const name = profile?.name ?? "Pelajar";

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 focusable rounded-lg">
          <Logo className="h-10 w-10" />
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-sm font-extrabold text-ink">Deutsch 30</span>
            <span className="text-[0.65rem] text-muted">in 30 Tagen</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {sidebarNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focusable",
                    active
                      ? "bg-primary-soft text-primary"
                      : "text-muted hover:bg-elevated hover:text-ink"
                  )}
                >
                  <Icon className={cn("h-[18px] w-[18px]", active ? "text-primary" : "")} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="m-3 rounded-2xl bg-elevated p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-heading font-bold text-onprimary">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-sm font-bold text-ink">{name}</p>
            <div className="flex items-center gap-1.5">
              <LevelBadge level={profile?.startLevel ?? "A1.1"} />
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-secondary">
                <Flame className="h-3.5 w-3.5" /> {streak}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
