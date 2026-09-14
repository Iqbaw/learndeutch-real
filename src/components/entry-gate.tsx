"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { useAppStore, useHydrated } from "@/lib/store";

export function EntryGate() {
  const router = useRouter();
  const hydrated = useHydrated();
  const profile = useAppStore((s) => s.profile);
  const introCompleted = useAppStore((s) => s.introCompleted);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const route = () => {
      if (hydrated && media.matches) router.replace(profile ? "/dashboard" : introCompleted ? "/login" : "/onboarding");
    };
    route();
    media.addEventListener("change", route);
    return () => media.removeEventListener("change", route);
  }, [hydrated, profile, introCompleted, router]);
  return <div className="entry-loading" role="status"><Logo className="h-16 w-16" /><span>Dein nächster Schritt.</span><span className="sr-only">Menyiapkan ruang belajarmu</span></div>;
}
