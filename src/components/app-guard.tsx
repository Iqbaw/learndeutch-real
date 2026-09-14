"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppStore, useHydrated } from "@/lib/store";

/** Wait for persistence before choosing the first-visit or returning-user flow. */
export function AppGuard({ children }: { children: ReactNode }) {
  const ready = useHydrated();
  const profile = useAppStore((s) => s.profile);
  const introCompleted = useAppStore((s) => s.introCompleted);
  const router = useRouter();
  useEffect(() => {
    if (ready && !profile) router.replace(introCompleted ? "/login" : "/onboarding");
  }, [ready, profile, introCompleted, router]);
  if (!ready || !profile) return <div className="entry-loading" role="status"><Loader2 className="h-6 w-6 animate-spin" /><span>Menyiapkan ruang belajarmu…</span></div>;
  return <>{children}</>;
}
