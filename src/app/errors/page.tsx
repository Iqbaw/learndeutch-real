"use client";

import { useMemo, useState } from "react";
import { NotebookPen, Filter, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { ErrorCard } from "@/components/cards/error-card";
import { StatCard } from "@/components/cards/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { CTAButton } from "@/components/ui/cta-button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ErrorCategory } from "@/types";

export default function ErrorsPage() {
  const errors = useAppStore((s) => s.errors);
  const [cat, setCat] = useState<ErrorCategory | "Semua">("Semua");

  const categories = useMemo<(ErrorCategory | "Semua")[]>(
    () => ["Semua", ...Array.from(new Set(errors.map((e) => e.category)))],
    [errors]
  );

  const filtered = useMemo(
    () => (cat === "Semua" ? errors : errors.filter((e) => e.category === cat)),
    [cat, errors]
  );

  const relapsed = errors.filter((e) => e.status === "relapsed").length;
  const safe = errors.filter((e) => e.status === "safe").length;

  return (
    <AppShell
      title="Error Notebook"
      subtitle="Kesalahanmu jadi bahan latihan otomatis. Setiap kesalahan tersimpan dan muncul lagi sampai dikuasai."
    >
      <AppGuard>
        {errors.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="h-6 w-6" />}
            title="Belum ada kesalahan tercatat"
            description="Setiap kali kamu salah saat latihan, kesalahannya otomatis tersimpan di sini lengkap dengan penjelasannya. Mulai sebuah pelajaran untuk mengisi buku ini."
            action={<CTAButton href="/lesson">Mulai Belajar</CTAButton>}
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Total kesalahan"
                value={errors.length}
                hint="tercatat otomatis"
                accent="danger"
                icon={<NotebookPen className="h-5 w-5" />}
              />
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
                    cat === c ? "bg-primary text-onprimary" : "bg-elevated text-muted hover:text-ink"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {filtered.map((item) => (
                <ErrorCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </AppGuard>
    </AppShell>
  );
}
