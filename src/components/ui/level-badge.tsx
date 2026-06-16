import { cn } from "@/lib/utils";
import type { CEFRLevel } from "@/types";

interface LevelBadgeProps {
  level: CEFRLevel | string;
  variant?: "solid" | "soft";
  className?: string;
}

export function LevelBadge({ level, variant = "soft", className }: LevelBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-1 font-mono text-xs font-bold",
        variant === "soft"
          ? "bg-primary-soft text-primary"
          : "bg-primary text-white dark:text-bg",
        className
      )}
    >
      {level}
    </span>
  );
}
