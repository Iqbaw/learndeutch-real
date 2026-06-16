import { Clock, Target, ArrowRight } from "lucide-react";
import { CTAButton } from "@/components/ui/cta-button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { LevelBadge } from "@/components/ui/level-badge";
import { formatMinutes } from "@/lib/utils";
import type { Lesson } from "@/types";

interface MissionCardProps {
  lesson: Lesson;
  progress?: number;
}

export function MissionCard({ lesson, progress = 0 }: MissionCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary-soft/80 to-card p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white dark:text-bg">
              Hari {lesson.day}
            </span>
            <LevelBadge level={lesson.subLevel} variant="soft" />
          </div>
          <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-ink">
            {lesson.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {formatMinutes(lesson.estimatedMinutes)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Target className="h-4 w-4" /> {lesson.goal.length} target hari ini
            </span>
          </div>
        </div>
        <ProgressRing value={progress} sublabel="progres" />
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {lesson.goal.map((g, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-ink/90">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {g}
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <CTAButton href="/lesson" size="lg">
          Lanjutkan Belajar <ArrowRight className="h-5 w-5" />
        </CTAButton>
      </div>
    </div>
  );
}
