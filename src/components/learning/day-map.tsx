"use client";

import Link from "next/link";
import { Check, Lock, Play, Trophy, RefreshCw, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DayStatus, RoadmapDay } from "@/types";

const statusConfig: Record<
  DayStatus,
  { cls: string; icon: typeof Check; label: string }
> = {
  done: { cls: "bg-success/15 text-success border-success/30", icon: Check, label: "Selesai" },
  active: { cls: "bg-primary text-onprimary border-primary shadow-glow", icon: Play, label: "Hari ini" },
  locked: { cls: "bg-elevated text-muted border-border", icon: Lock, label: "Terkunci" },
  remedial: { cls: "bg-warning/15 text-warning border-warning/30", icon: Stethoscope, label: "Remedial" },
  exam: { cls: "bg-secondary-soft text-secondary border-secondary/30", icon: Trophy, label: "Ujian" },
  review: { cls: "bg-primary-soft text-primary border-primary/30", icon: RefreshCw, label: "Review" },
};

interface DayMapProps {
  days: RoadmapDay[];
  compact?: boolean;
}

export function DayMap({ days, compact = false }: DayMapProps) {
  return (
    <div>
      <div
        className={cn(
          "grid gap-2",
          compact ? "grid-cols-6 sm:grid-cols-10" : "grid-cols-5 sm:grid-cols-6 md:grid-cols-10"
        )}
      >
        {days.map((d) => {
          const conf = statusConfig[d.status];
          const Icon = conf.icon;
          const clickable = d.status !== "locked";
          const inner = (
            <div
              className={cn(
                "group relative flex aspect-square flex-col items-center justify-center rounded-xl border text-center transition-transform",
                conf.cls,
                clickable && "hover:scale-105 cursor-pointer",
                !clickable && "cursor-not-allowed"
              )}
              title={`Hari ${d.day} — ${d.theme}`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="mt-0.5 font-heading text-sm font-extrabold">{d.day}</span>
            </div>
          );
          return clickable ? (
            <Link key={d.day} href={`/lesson?day=${d.day}`} className="focusable rounded-xl">
              {inner}
            </Link>
          ) : (
            <div key={d.day}>{inner}</div>
          );
        })}
      </div>

      {!compact && (
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(statusConfig).map(([key, conf]) => {
            const Icon = conf.icon;
            return (
              <span key={key} className="inline-flex items-center gap-1.5 text-xs text-muted">
                <span className={cn("flex h-5 w-5 items-center justify-center rounded-md border", conf.cls)}>
                  <Icon className="h-3 w-3" />
                </span>
                {conf.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
