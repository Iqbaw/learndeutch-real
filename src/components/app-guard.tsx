"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";

/**
 * Gates app content behind a real, onboarded profile.
 * - Waits for localStorage hydration (prevents SSR flash)
 * - If no profile after hydration, redirects to onboarding
 * - Never asks again once profile exists in localStorage
 */
export function AppGuard({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const profile = useAppStore((s) => s.profile);
  const router = useRouter();

  useEffect(() => {
    // Give the persisted store time to rehydrate from localStorage.
    // useAppStore's persist middleware calls onRehydrateStorage but it can
    // take one tick — we wait a generous frame to be safe across devices.
    const timer = setTimeout(() => {
      setReady(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready && !profile) {
      router.replace("/onboarding");
    }
  }, [ready, profile, router]);

  if (!ready) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 text-muted">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm">Mengarahkan ke onboarding...</p>
      </div>
    );
  }

  return <>{children}</>;
}
