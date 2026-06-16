"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { playSound, setSoundEnabled, unlockAudio } from "@/lib/sound";

/**
 * Gives the whole app playful audio feedback:
 * - keeps the sound engine in sync with the user's setting
 * - plays a subtle "tap" on every button / link press (Duolingo-style)
 *   unless the element opts out with `data-no-sound`
 */
export function SoundProvider() {
  const soundEnabled = useAppStore((s) => s.soundEnabled);

  useEffect(() => {
    setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // first interaction also unlocks the audio context
      unlockAudio();
      const el = target.closest(
        'button, a, [role="button"], summary, [data-sound]'
      ) as HTMLElement | null;
      if (!el) return;
      if (el.hasAttribute("data-no-sound") || el.closest("[data-no-sound]")) return;
      if (el instanceof HTMLButtonElement && el.disabled) return;
      playSound("tap");
    };
    document.addEventListener("pointerdown", handler, true);
    return () => document.removeEventListener("pointerdown", handler, true);
  }, []);

  return null;
}
