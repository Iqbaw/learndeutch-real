"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppStore, useHydrated } from "@/lib/store";

function PageLoading({ label = "Memuat..." }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

/**
 * Gates app content behind a real, onboarded profile.
 * - While the persisted store rehydrates, shows a loader.
 * - If there is no profile yet, redirects to onboarding.
 */
export function AppGuard({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const profile = useAppStore((s) => s.profile);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !profile) router.replace("/onboarding");
  }, [hydrated, profile, router]);

  if (!hydrated) return <PageLoading />;
  if (!profile) return <PageLoading label="Mengarahkan ke onboarding..." />;
  return <>{children}</>;
}
