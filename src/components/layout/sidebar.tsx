"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primarySidebarNav, sidebarGroups, type NavItem } from "./nav-config";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { LevelBadge } from "@/components/ui/level-badge";
import { Logo } from "@/components/ui/logo";
import { ChevronDown, Flame, Settings } from "lucide-react";

const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

function SidebarLink({ item, pathname, nested = false }: { item: NavItem; pathname: string; nested?: boolean }) {
  const active = isCurrent(pathname, item.href);
  const Icon = item.icon;
  return <li><Link href={item.href} aria-current={active ? "page" : undefined}
    className={cn("sidebar-link focusable", nested && "sidebar-link-nested")}>
    <Icon size={18} aria-hidden="true" />
    <span>{item.href === "/dashboard" ? "Beranda" : item.label}</span>
  </Link></li>;
}

export function Sidebar() {
  const pathname = usePathname();
  const profile = useAppStore((s) => s.profile);
  const streak = useAppStore((s) => s.streak);
  const name = profile?.name ?? "Pelajar";

  return (
    <aside className="learning-sidebar hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card">
      <div className="flex shrink-0 items-center gap-2.5 px-5 h-16 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 focusable rounded-lg">
          <Logo className="h-10 w-10" />
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-sm font-extrabold text-ink">Deutsch 30</span>
            <span className="text-[0.65rem] text-muted">in 30 Tagen</span>
          </span>
        </Link>
      </div>

      <nav aria-label="Navigasi belajar" className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <p className="sidebar-section-label">Ruang belajarmu</p>
        <ul className="flex flex-col gap-1">
          {primarySidebarNav.map((item) => <SidebarLink key={item.href} item={item} pathname={pathname} />)}
        </ul>
        <div className="sidebar-tools">
          <p className="sidebar-section-label">Pendukung belajar</p>
          {sidebarGroups.map((group) => {
            const active = group.items.some((item) => isCurrent(pathname, item.href));
            const Icon = group.icon;
            return <details key={`${group.id}-${pathname}`} open={active} className="sidebar-group">
              <summary className={cn("sidebar-group-toggle focusable", active && "sidebar-group-active")}>
                <Icon size={18} aria-hidden="true" />
                <span className="min-w-0 flex-1"><span className="block">{group.label}</span><span className="sidebar-group-description">{group.description}</span></span>
                <ChevronDown size={15} className="sidebar-chevron" aria-hidden="true" />
              </summary>
              <ul className="sidebar-group-items">{group.items.map((item) => <SidebarLink key={item.href} item={item} pathname={pathname} nested />)}</ul>
            </details>;
          })}
        </div>
      </nav>

      <Link href="/settings" aria-label={`Profil dan pengaturan ${name}`} aria-current={pathname === "/settings" ? "page" : undefined} className="sidebar-profile focusable m-3 mt-0 shrink-0 rounded-2xl border border-border bg-card p-3.5 transition-colors hover:bg-elevated">
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
          <Settings size={17} className="shrink-0 text-muted" aria-hidden="true" />
        </div>
      </Link>
    </aside>
  );
}
