import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function AIInsightCard({
  title = "Pesan dari AI Coach",
  children,
  className,
}: AIInsightCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/30 bg-primary-soft/60 p-5",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-onprimary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-heading text-sm font-bold text-primary">{title}</p>
          <div className="mt-1 text-sm leading-relaxed text-ink/90">{children}</div>
        </div>
      </div>
    </div>
  );
}
