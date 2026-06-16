"use client";

import { useMemo, useState } from "react";
import { NotebookPen, Filter } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorCard } from "@/components/cards/error-card";
import { StatCard } from "@/components/cards/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { errorItems } from "@/data/errors";
import { cn } from "@/lib/utils";
import type { ErrorCategory } from "@/types";

const categories: (ErrorCategory | "Semua")[] = [
  "Semua",
  ...Array.from(new Set(errorItems.map((e) => e.category))),
];

export default function ErrorsPage() {
  const [cat, setCat] = useState<ErrorCategory | "Semua">("Semua");

  const filtered = useMemo(
    () => (cat === "Semua" ? errorItems : errorItems.filter((e) => e.category === cat)),
    [cat]
  );

  const relapsed = errorItems.filter((e) => e.status === "relapsed").length;
  const safe = errorItems.filter((e) => e.status === "safe").length;

  return (
    <AppShell title="Error Notebook" subtitle="Kesalahanmu jadi bahan latihan otomatis. Setiap kesalahan tersimpan dan muncul lagi sampai dikuasai.">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total kesalahan" value={errorItems.length} hint="tercatat otomatis" accent="danger" icon={<NotebookPen className="h-5 w-5" />} />
        <StatCard label="Kambuh lagi" value={relapsed} hint="butuh latihan lebih sering" accent="secondary" />
        <StatCard label="Sudah aman" value={safe} hint="dikuasai" accent="success" />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-muted">
          <Filter className="h-4 w-4" /> Kategori:
        </span>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-bold transition-colors focusable",
              cat === c ? "bg-primary text-white dark:text-bg" : "bg-elevated text-muted hover:text-ink"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<NotebookPen className="h-6 w-6" />}
            title="Belum ada kesalahan di kategori ini"
            description="Bagus! Atau coba kategori lain."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((item) => (
              <ErrorCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
