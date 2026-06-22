"use client";

import { useMemo, useState } from "react";
import { Search, Library } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { VocabularyCard } from "@/components/cards/vocabulary-card";
import { StatCard } from "@/components/cards/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { vocabulary } from "@/data/vocabulary";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const categories = ["Semua", ...Array.from(new Set(vocabulary.map((v) => v.category)))];

export default function VocabularyPage() {
  const vocabStatus = useAppStore((s) => s.vocabStatus);
  const startLearningVocab = useAppStore((s) => s.startLearningVocab);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("Semua");

  const filtered = useMemo(() => {
    return vocabulary.filter((v) => {
      const matchCat = cat === "Semua" || v.category === cat;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q || v.german.toLowerCase().includes(q) || v.indonesian.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, cat]);

  const mastered = vocabulary.filter((v) => vocabStatus[v.id] === "mastered").length;
  const started = vocabulary.filter((v) => vocabStatus[v.id] && vocabStatus[v.id] !== "new").length;

  return (
    <AppShell title="Vocabulary" subtitle="Kamus pribadimu — pelajari kata, lalu lacak status hafalannya.">
      <AppGuard>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total kosakata" value={vocabulary.length} hint="tersedia di kursus" icon={<Library className="h-5 w-5" />} />
          <StatCard label="Sedang dipelajari" value={started} hint="kata" accent="secondary" />
          <StatCard label="Sudah dikuasai" value={mastered} hint="kata" accent="success" />
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Arti status (urutan kemajuan)</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Legend cls="bg-elevated text-muted" label="Belum dipelajari" desc="belum kamu mulai" />
            <Legend cls="bg-secondary-soft text-secondary" label="Sedang dipelajari" desc="baru masuk daftar belajarmu" />
            <Legend cls="bg-warning/15 text-warning" label="Perlu diulang" desc="pernah salah saat review" />
            <Legend cls="bg-primary-soft text-primary" label="Hampir hafal" desc="sebentar lagi dikuasai" />
            <Legend cls="bg-success/15 text-success" label="Dikuasai" desc="sudah melekat kuat" />
          </div>
          <p className="mt-3 text-xs text-muted">
            Alur kemajuannya: <span className="font-bold text-ink">Belum dipelajari → Sedang dipelajari →
            (Perlu diulang jika salah) → Hampir hafal → Dikuasai</span>. Status naik saat kamu menjawab
            benar di <span className="font-bold text-ink">Review</span>, dan turun ke &quot;Perlu diulang&quot; saat
            salah. Status bukan tombol — naikkan dengan berlatih di Review.
          </p>
        </div>

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

        <div className="mt-3 flex flex-wrap gap-2">
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
                <VocabularyCard
                  key={item.id}
                  item={item}
                  status={vocabStatus[item.id] ?? "new"}
                  onLearn={startLearningVocab}
                />
              ))}
            </div>
          )}
        </div>
      </AppGuard>
    </AppShell>
  );
}

function Legend({ cls, label, desc }: { cls: string; label: string; desc: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("rounded-md px-2 py-0.5 text-xs font-bold", cls)}>{label}</span>
      <span className="text-xs text-muted">{desc}</span>
    </div>
  );
}
