"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNav } from "./nav-config";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {bottomNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
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
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
