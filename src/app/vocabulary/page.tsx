"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Check, Layers3, List, Plus, RefreshCw, Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { VocabularyCard } from "@/components/cards/vocabulary-card";
import { ListenButton } from "@/components/ui/listen-button";
import { EmptyState } from "@/components/ui/empty-state";
import { vocabulary } from "@/data/vocabulary";
import { useAppStore } from "@/lib/store";
import type { MajorLevel, MemoryStatus, VocabularyItem } from "@/types";
import "./vocabulary.css";

const levels: MajorLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const levelIntro: Record<MajorLevel, string> = {
  A1: "Kenalan, kebutuhan dasar, rumah, belanja, dan perjalanan singkat.",
  A2: "Rutinitas, layanan, kesehatan, pekerjaan, dan pendapat sederhana.",
  B1: "Cerita pengalaman, urusan nyata, opini, kerja, dan masyarakat.",
  B2: "Argumen bernuansa, riset, kebijakan, organisasi, dan hubungan logis.",
  C1: "Bahasa akademik, evaluasi, kebijakan, serta pilihan kata yang presisi.",
  C2: "Nuansa makna, idiom, retorika, dan ragam bahasa tingkat mahir.",
};
const PAGE_SIZE = 12;
const statusLabels: Record<MemoryStatus, string> = {
  new: "Belum dipelajari", learning: "Sedang dipelajari", review: "Perlu diulang", almost: "Hampir hafal", mastered: "Lancar di review",
};

export default function VocabularyPage() {
  const vocabStatus = useAppStore((s) => s.vocabStatus);
  const startLearningVocab = useAppStore((s) => s.startLearningVocab);
  const [level, setLevel] = useState<MajorLevel>("A1");
  const [category, setCategory] = useState("Semua topik");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"cards" | "list">("cards");
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const studyRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLElement>(null);

  const levelWords = useMemo(() => vocabulary.filter((word) => word.level.startsWith(level)), [level]);
  const categories = useMemo(() => ["Semua topik", ...Array.from(new Set(levelWords.map((word) => word.category)))], [levelWords]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("de-DE");
    return levelWords.filter((word) =>
      (category === "Semua topik" || word.category === category) &&
      (!needle || `${word.german} ${word.indonesian} ${word.exampleA1}`.toLocaleLowerCase("de-DE").includes(needle))
    );
  }, [category, levelWords, query]);
  const currentIndex = Math.min(index, Math.max(0, filtered.length - 1));
  const current = filtered[currentIndex];
  const currentStatus = current ? vocabStatus[current.id] ?? "new" : "new";
  const started = levelWords.filter((word) => vocabStatus[word.id] && vocabStatus[word.id] !== "new").length;
  const mastered = levelWords.filter((word) => vocabStatus[word.id] === "mastered").length;
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));

  function resetPosition() { setIndex(0); setPage(0); setRevealed(false); }
  function selectLevel(next: MajorLevel) { setLevel(next); setCategory("Semua topik"); setQuery(""); resetPosition(); }
  function scrollTo(element: HTMLElement | null) {
    element?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }
  function move(step: number) { setIndex((position) => Math.max(0, Math.min(filtered.length - 1, position + step))); setRevealed(false); scrollTo(studyRef.current); }
  function nextCard() {
    if (filtered.length === 1) { setQuery(""); setCategory("Semua topik"); resetPosition(); scrollTo(studyRef.current); return; }
    move(currentIndex === filtered.length - 1 ? -currentIndex : 1);
  }
  function changePage(next: number) { setPage(next); scrollTo(listRef.current); }

  return (
    <AppShell title="Kosakata" subtitle="Kata inti menurut jenjang, dipelajari satu per satu.">
      <AppGuard><div className="vocab-page">
        <section className="vocab-intro" aria-labelledby="vocab-heading">
          <div><p className="vocab-eyebrow"><BookOpen size={16} aria-hidden="true" /> WORTSCHATZ · A1–C2</p><h2 id="vocab-heading">Bangun kosakata, satu kata setiap langkah.</h2><p>Pilih level, baca contoh, tebak artinya, lalu lanjut ke kata berikutnya. Masukkan kata ke Review agar bisa diuji ulang.</p></div>
          <div className="vocab-total"><strong>{vocabulary.length}</strong><span>kata & ungkapan<br />dalam bank belajar</span></div>
        </section>

        <section className="vocab-level-section" aria-label="Pilih jenjang kosakata">
          <div className="vocab-level-rail">{levels.map((item) => {
            const count = vocabulary.filter((word) => word.level.startsWith(item)).length;
            return <button key={item} type="button" aria-pressed={level === item} className="vocab-level focusable" onClick={() => selectLevel(item)}><strong>{item}</strong><span>{count} kata</span></button>;
          })}</div>
          <div className="vocab-level-note"><p><strong>Level {level}</strong> · {levelIntro[level]}</p><span>{started} dipelajari · {mastered} lancar</span></div>
        </section>

        <div className="vocab-toolbar">
          <div className="vocab-mode" role="group" aria-label="Tampilan kosakata"><button type="button" aria-pressed={mode === "cards"} className="focusable" onClick={() => setMode("cards")}><Layers3 size={17} /> Kartu belajar</button><button type="button" aria-pressed={mode === "list"} className="focusable" onClick={() => setMode("list")}><List size={17} /> Daftar kata</button></div>
          <div className="vocab-filters"><label className="vocab-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Cari kata di level {level}</span><input value={query} onChange={(event) => { setQuery(event.target.value); resetPosition(); }} placeholder={`Cari kata di ${level}...`} /></label><label className="vocab-category"><span className="sr-only">Topik kosakata</span><select value={category} onChange={(event) => { setCategory(event.target.value); resetPosition(); }}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label></div>
        </div>

        {filtered.length === 0 ? <EmptyState icon={<Search size={24} />} title="Kata belum ditemukan" description="Coba kata lain atau pilih Semua topik." /> : mode === "cards" && current ? (
          <section ref={studyRef} className="vocab-study" aria-label="Kartu belajar kosakata">
            <div className="vocab-study-top"><span>KATA {currentIndex + 1} DARI {filtered.length}</span><span>TEBAK ARTINYA DULU</span></div>
            <div className="vocab-progress" role="progressbar" aria-label="Posisi dalam daftar kata" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={filtered.length}><span style={{ width: `${((currentIndex + 1) / filtered.length) * 100}%` }} /></div>
            <StudyCard key={current.id} item={current} status={currentStatus} revealed={revealed} onReveal={() => setRevealed((value) => !value)} onLearn={() => startLearningVocab(current.id)} />
            <div className="vocab-stepper"><button type="button" className="vocab-prev focusable" onClick={() => move(-1)} disabled={currentIndex === 0}><ArrowLeft size={18} /> Sebelumnya</button><span>{currentIndex + 1} / {filtered.length}</span><button type="button" className="vocab-next focusable" onClick={nextCard}>{filtered.length === 1 ? "Lihat semua kata" : currentIndex === filtered.length - 1 ? "Ulangi dari awal" : "Kata berikutnya"} <ArrowRight size={18} /></button></div>
          </section>
        ) : (
          <section ref={listRef} className="vocab-list" aria-label="Daftar kosakata"><div className="vocab-list-heading"><div><h3>Daftar kata {level}</h3><p>{filtered.length} hasil · {PAGE_SIZE} kata per halaman</p></div><span>Halaman {currentPage + 1} / {pageCount}</span></div><div className="vocab-grid">{filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE).map((item) => <VocabularyCard key={item.id} item={item} status={vocabStatus[item.id] ?? "new"} onLearn={startLearningVocab} />)}</div><div className="vocab-stepper vocab-list-stepper"><button type="button" className="vocab-prev focusable" disabled={currentPage === 0} onClick={() => changePage(currentPage - 1)}><ArrowLeft size={18} /> Sebelumnya</button><span>{currentPage + 1} / {pageCount}</span><button type="button" className="vocab-next focusable" disabled={currentPage + 1 >= pageCount} onClick={() => changePage(currentPage + 1)}>Halaman berikutnya <ArrowRight size={18} /></button></div></section>
        )}

        <details className="vocab-help"><summary className="focusable">Bagaimana status hafalan dihitung?</summary><p>Menambahkan kata akan memberi status “Sedang dipelajari”. Jawaban benar di Review menaikkan status secara bertahap; jawaban salah menandainya “Perlu diulang”. Melihat kartu saja belum berarti kata sudah dikuasai.</p><Link href="/review">Buka latihan Review <ArrowRight size={15} /></Link></details>
        <p className="vocab-disclaimer">Pilihan kata ini disusun untuk latihan bertahap sesuai tema CEFR. Ini bukan daftar resmi Goethe dan bukan peringkat frekuensi korpus.</p>
      </div></AppGuard>
    </AppShell>
  );
}

function StudyCard({ item, status, revealed, onReveal, onLearn }: { item: VocabularyItem; status: MemoryStatus; revealed: boolean; onReveal: () => void; onLearn: () => void }) {
  return <div className="vocab-card-focus">
    <div className="vocab-card-meta"><span>{item.emoji} {item.category}</span><span>{item.level} · {statusLabels[status]}</span></div>
    <div className="vocab-card-word"><div><span className="vocab-word-prompt">BACA · UCAPKAN · INGAT</span><h3 lang="de">{item.german}</h3>{item.plural && <p>Plural: {item.plural}</p>}</div><ListenButton text={item.german} label="Dengarkan kata" className="vocab-listen" /></div>
    <div className="vocab-example"><span>CONTOH PEMAKAIAN</span><p lang="de">{item.exampleA1}</p>{revealed && <p className="vocab-example-translation">{item.exampleTranslation}</p>}</div>
    <div className="vocab-card-actions"><button type="button" className="vocab-reveal focusable" aria-expanded={revealed} onClick={onReveal}>{revealed ? <><Check size={17} /> Sembunyikan arti</> : <>Lihat arti & terjemahan <ArrowRight size={17} /></>}</button>{revealed && <div className="vocab-meaning"><span>ARTI</span><strong>{item.indonesian}</strong></div>}{status === "new" ? revealed && <button type="button" className="vocab-learn focusable" onClick={onLearn}><Plus size={17} /> Masukkan ke Review</button> : <Link href="/review" className="vocab-review-link focusable"><RefreshCw size={16} /> Latih di Review</Link>}</div>
  </div>;
}
