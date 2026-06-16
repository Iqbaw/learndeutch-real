"use client";

import { useMemo, useState } from "react";
import { Search, Library } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { VocabularyCard } from "@/components/cards/vocabulary-card";
import { StatCard } from "@/components/cards/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { vocabulary } from "@/data/vocabulary";
import { cn } from "@/lib/utils";

const categories = ["Semua", ...Array.from(new Set(vocabulary.map((v) => v.category)))];

export default function VocabularyPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("Semua");

  const filtered = useMemo(() => {
    return vocabulary.filter((v) => {
      const matchCat = cat === "Semua" || v.category === cat;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        v.german.toLowerCase().includes(q) ||
        v.indonesian.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, cat]);

  const mastered = vocabulary.filter((v) => v.status === "mastered").length;
  const review = vocabulary.filter((v) => v.status === "review").length;

  return (
    <AppShell title="Vocabulary" subtitle="Kamus pribadimu — setiap kata punya kartu, contoh, dan status hafalan.">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total kosakata" value={vocabulary.length} hint="kata di kamusmu" icon={<Library className="h-5 w-5" />} />
        <StatCard label="Sudah dikuasai" value={mastered} hint="kata" accent="success" />
        <StatCard label="Perlu review" value={review} hint="kata" accent="secondary" />
      </div>

      {/* Search */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kata Jerman atau arti Indonesia..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 font-body text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="mt-3 flex flex-wrap gap-2">
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

      {/* Grid */}
      <div className="mt-5">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="h-6 w-6" />}
            title="Tidak ada kata ditemukan"
            description="Coba kata kunci lain atau ganti kategori."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <VocabularyCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
