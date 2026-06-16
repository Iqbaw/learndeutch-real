import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ErrorItem, ErrorStatus } from "@/types";

const statusStyle: Record<ErrorStatus, { label: string; cls: string }> = {
  new: { label: "Baru salah", cls: "bg-danger/15 text-danger" },
  reviewed: { label: "Sudah direview", cls: "bg-primary-soft text-primary" },
  almost: { label: "Hampir dikuasai", cls: "bg-secondary-soft text-secondary" },
  safe: { label: "Aman", cls: "bg-success/15 text-success" },
  relapsed: { label: "Kambuh lagi", cls: "bg-warning/15 text-warning" },
};

export function ErrorCard({ item }: { item: ErrorItem }) {
  const status = statusStyle[item.status];
  return (
    <div className="card-base p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-lg bg-elevated px-2 py-1 text-xs font-bold text-muted">
          {item.category}
        </span>
        <div className="flex items-center gap-2">
          <span className={cn("rounded-lg px-2 py-1 text-xs font-bold", status.cls)}>
            {status.label}
          </span>
          <span className="text-xs text-muted">{item.date}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 font-body">
        <span className="rounded-lg bg-danger/10 px-2.5 py-1.5 text-sm text-danger line-through decoration-danger/40">
          {item.userAnswer}
        </span>
        <ArrowRight className="h-4 w-4 text-muted" />
        <span className="rounded-lg bg-success/10 px-2.5 py-1.5 text-sm font-bold text-success">
          {item.correctAnswer}
        </span>
      </div>

      <p className="mt-3 text-sm text-muted">{item.explanation}</p>
    </div>
  );
}
