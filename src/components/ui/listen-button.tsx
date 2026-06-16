"use client";

import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { useTextToSpeech } from "@/lib/speech";
import { cn } from "@/lib/utils";

interface ListenButtonProps {
  text: string;
  lang?: string;
  rate?: number;
  label?: string;
  variant?: "chip" | "icon";
  className?: string;
}

/** Animated equalizer shown while the example is being spoken. */
function Equalizer({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-end gap-[2px]", className)} aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="w-[2.5px] rounded-full bg-current"
          animate={{ height: [4, 12, 6, 14, 4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

/**
 * A "Dengarkan contoh" button that speaks a German example out loud
 * using the most natural voice available, with live playback feedback.
 */
export function ListenButton({
  text,
  lang = "de-DE",
  rate = 0.9,
  label = "Dengarkan contoh",
  variant = "chip",
  className,
}: ListenButtonProps) {
  const { supported, speaking, speak, stop } = useTextToSpeech(lang);

  if (!supported) return null;

  const handleClick = () => {
    if (speaking) stop();
    else speak(text, { rate });
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={speaking ? `Berhenti memutar ${text}` : `Dengarkan ${text}`}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg bg-elevated text-primary transition-colors hover:bg-primary-soft focusable",
          speaking && "bg-primary-soft",
          className
        )}
      >
        {speaking ? <Equalizer className="h-4 text-primary" /> : <Volume2 className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:brightness-95 focusable",
        className
      )}
      aria-label={speaking ? "Berhenti memutar contoh" : label}
    >
      {speaking ? (
        <>
          <Equalizer className="h-3.5" /> Memutar...
        </>
      ) : (
        <>
          <Volume2 className="h-3.5 w-3.5" /> {label}
        </>
      )}
    </button>
  );
}
