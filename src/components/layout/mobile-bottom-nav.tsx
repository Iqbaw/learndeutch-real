"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNav } from "./nav-config";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-dock" aria-label="Navigasi utama">
      <ul>
        {bottomNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/") || (item.href === "/library" && ["/vocabulary", "/grammar", "/review", "/roadmap", "/notes", "/errors", "/mock-test"].includes(pathname));
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[0.65rem] font-bold transition-colors focusable rounded-lg",
                  active ? "text-primary" : "text-muted"
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="dock-icon"><Icon className="h-5 w-5" /></span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
