import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  accent?: "primary" | "secondary" | "success" | "danger";
  className?: string;
}

const accentMap = {
  primary: "bg-primary-soft text-primary",
  secondary: "bg-secondary-soft text-secondary",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "primary",
  className,
}: StatCardProps) {
  return (
    <div className={cn("card-base p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
          <p className="mt-1 font-heading text-2xl font-extrabold text-ink">{value}</p>
          {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
        </div>
        {icon && (
          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", accentMap[accent])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
