"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, Headphones, Mic2, PenLine, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { CTAButton } from "@/components/ui/cta-button";
import { ListenButton } from "@/components/ui/listen-button";
import { ProductionTask } from "@/components/learning/production-task";
import { useCourseStore } from "@/lib/course-store";
import { useTextToSpeech } from "@/lib/speech";
import { courseBlueprints, courseLevels, getCourseUnit, unitsForLevel } from "@/data/course";
import type { CourseLevel, CourseQuestion, CourseSection, CourseUnit } from "@/types/course";

const tabs: { id: CourseSection; label: string }[] = [
  { id: "material", label: "Materi" }, { id: "grammar", label: "Pola & latihan" },
  { id: "reading", label: "Lesen" }, { id: "listening", label: "Hören" },
  { id: "writing", label: "Schreiben" }, { id: "speaking", label: "Sprechen" },
  { id: "review", label: "Uji ulang" },
];

export default function CoursePage() {
  return <Suspense fallback={<div className="min-h-screen bg-bg" />}><CourseInner /></Suspense>;
}

function CourseInner() {
  const params = useSearchParams();
  const levelParam = params.get("level")?.toUpperCase();
  const selectedLevel = courseLevels.includes(levelParam as CourseLevel) ? levelParam as CourseLevel : "B1";
  const unit = getCourseUnit(params.get("unit") ?? "");
  const progress = useCourseStore((state) => state.units);
  const relevant = unit && unit.level === selectedLevel ? unit : null;
  return <AppGuard><AppShell title="Kursus bahasa Jerman" subtitle="Materi bertahap, empat keterampilan, dan uji ulang setelah jeda.">
    {relevant ? <UnitView key={relevant.id} unit={relevant} /> : <>
      <div className="mb-5 rounded-3xl border border-border bg-card p-5 sm:p-7">
        <span className="eyebrow">DEUTSCHKURS · B1–C2</span>
        <h1 className="mt-2 font-heading text-2xl font-extrabold text-ink sm:text-3xl">Belajar materinya. Latih dalam situasi baru.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Saat ini tersedia 10 unit fokus per level B1–C2. Setiap unit menghubungkan tata bahasa, kosakata, membaca, mendengar, menulis, dan berbicara. Ini jalur belajar awal, bukan pengganti kursus penuh atau bukti siap ujian; kesiapan perlu diuji dengan tugas baru dan umpan balik pengajar.</p>
        <div className="mt-4 flex flex-wrap gap-2">{courseLevels.map((level) => <Link key={level} href={`/course?level=${level}`} className={`rounded-xl px-4 py-2 text-sm font-bold focusable ${selectedLevel === level ? "bg-primary text-onprimary" : "bg-elevated text-ink"}`}>{level}</Link>)}</div>
      </div>
      <div className="mb-5 grid gap-4 md:grid-cols-[1.5fr_1fr]">
        <div className="card-base p-5"><h2 className="font-heading text-xl font-extrabold text-ink">{selectedLevel}: {courseBlueprints[selectedLevel].title}</h2><p className="mt-2 text-sm leading-6 text-muted">{courseBlueprints[selectedLevel].description}</p><p className="mt-3 text-xs text-muted">Bekal awal: {courseBlueprints[selectedLevel].prerequisite}</p></div>
        <div className="card-base p-5"><p className="text-xs font-bold uppercase tracking-wide text-muted">Langkah berikutnya</p><h2 className="mt-1 font-heading font-bold text-ink">Latihan ujian per modul</h2><p className="mt-2 text-sm text-muted">Kerjakan Lesen, Hören, Schreiben, dan Sprechen dengan tugas baru setelah mempelajari materinya.</p><CTAButton href={`/exam?level=${selectedLevel}`} variant="outline" className="mt-4">Buka latihan ujian <ArrowRight size={17} /></CTAButton></div>
      </div>
      {unitsForLevel(selectedLevel).length ? <div className="grid gap-3 sm:grid-cols-2">{unitsForLevel(selectedLevel).map((item) => {
        const done = progress[item.id]?.completed.length ?? 0;
        return <Link href={`/course?level=${selectedLevel}&unit=${item.id}`} key={item.id} className="card-base group block p-5 transition-transform hover:-translate-y-0.5 focusable">
          <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wide text-primary">Unit {String(item.order).padStart(2, "0")}</span><span className="text-xs text-muted">{done}/7 bagian dicoba</span></div>
          <h3 className="mt-2 font-heading text-lg font-extrabold text-ink">{item.title}</h3><p className="mt-1 text-sm leading-5 text-muted">{item.topic}</p><div className="mt-4 flex items-center justify-between text-xs text-muted"><span className="flex items-center gap-1"><Clock3 size={14} /> ±{item.estimatedMinutes} menit, dapat dicicil</span><ArrowRight size={17} className="text-primary" /></div>
        </Link>;
      })}</div> : <div className="card-base p-6"><h2 className="font-heading font-bold text-ink">Sprint {selectedLevel} sudah tersedia</h2><p className="mt-2 text-sm text-muted">Buka 30 pelajaran harian pada roadmap. Modul kursus mendalam untuk level ini sedang disusun dan belum dihitung sebagai kursus lengkap.</p><CTAButton href="/roadmap" className="mt-4">Buka roadmap</CTAButton></div>}
    </>}
  </AppShell></AppGuard>;
}

function UnitView({ unit }: { unit: CourseUnit }) {
  const [section, onSection] = useState<CourseSection>("material");
  const progress = useCourseStore((state) => state.units[unit.id]);
  const complete = useCourseStore((state) => state.complete);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60_000); return () => window.clearInterval(timer); }, []);
  const reviewDue = progress?.reviewDueAt && new Date(progress.reviewDueAt).getTime() <= now;
  const listeningAnswered = unit.listening.questions.every((q) => Number.isInteger(progress?.answers[q.id]));
  function goNext() { const index = tabs.findIndex((tab) => tab.id === section); onSection(tabs[Math.min(index + 1, tabs.length - 1)].id); window.scrollTo({ top: 0, behavior: "smooth" }); }
  return <div className="mx-auto max-w-4xl">
    <Link href={`/course?level=${unit.level}`} className="mb-4 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-primary focusable"><ArrowLeft size={16} /> Semua unit {unit.level}</Link>
    <div className="card-base p-5 sm:p-6"><div className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted"><span className="rounded-full bg-primary-soft px-2.5 py-1 text-primary">{unit.level} · Unit {unit.order}</span><span>±{unit.estimatedMinutes} menit · bisa dicicil</span></div><h1 className="mt-2 font-heading text-2xl font-extrabold text-ink">{unit.title}</h1><p className="mt-1 text-sm text-muted">{unit.topic}</p><div className="mt-4 flex flex-wrap gap-2">{unit.objectives.map((goal) => <span key={goal} className="rounded-lg bg-elevated px-3 py-2 text-xs text-ink">{goal}</span>)}</div></div>
    <nav aria-label="Bagian kursus" className="mt-4 flex gap-2 overflow-x-auto pb-2">{tabs.map((tab) => <button type="button" key={tab.id} aria-current={section === tab.id ? "step" : undefined} onClick={() => onSection(tab.id)} className={`min-h-11 shrink-0 rounded-xl px-3 text-sm font-bold focusable ${section === tab.id ? "bg-ink text-bg" : "bg-card text-muted"}`}>{progress?.completed.includes(tab.id) && <CheckCircle2 size={14} className="mr-1 inline" />}{tab.label}</button>)}</nav>
    <section key={`${unit.id}-${section}`} className="card-base mt-2 p-5 sm:p-7">
      {section === "material" && <><SectionTitle icon={<BookOpen size={20} />} title="Peta materi" intro="Bangun bekal untuk memahami dan memakai topik ini." /><p className="text-sm text-muted">Prasyarat: {unit.prerequisites.join(" · ")}</p><h3 className="mt-5 font-heading font-bold text-ink">Kosakata dan frasa penting</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">{unit.vocabulary.map((word) => <div key={word.german} className="rounded-xl bg-elevated p-3"><strong className="text-ink">{word.german}</strong><p className="text-sm text-muted">{word.indonesian}</p><p className="mt-1 text-sm italic text-ink">{word.example}</p><ListenButton text={word.example} label="Dengarkan" className="mt-2" /></div>)}</div><button className="mt-5 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-onprimary focusable" onClick={() => { complete(unit.id, "material"); goNext(); }}>Lanjut ke pola <ArrowRight size={16} className="ml-1 inline" /></button></>}
      {section === "grammar" && <><SectionTitle icon={<BookOpen size={20} />} title={unit.grammar.title} intro={unit.grammar.explanation} /><div className="rounded-xl bg-primary-soft p-4 font-mono text-sm text-ink">{unit.grammar.formula}</div><div className="mt-4 space-y-3">{unit.grammar.examples.map((example) => <div key={example.german} className="rounded-xl border border-border p-4"><p className="font-bold text-ink">{example.german}</p><p className="text-sm text-muted">{example.indonesian}</p><p className="mt-2 text-xs text-muted">{example.note}</p><ListenButton text={example.german} className="mt-2" /></div>)}</div><h3 className="mt-5 font-bold text-ink">Perhatikan</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">{unit.grammar.pitfalls.map((p) => <li key={p}>{p}</li>)}</ul><QuestionSet unit={unit} questions={unit.grammar.questions} section="grammar" onAllAnswered={goNext} /></>}
      {section === "reading" && <><SectionTitle icon={<BookOpen size={20} />} title={`Lesen · ${unit.reading.title}`} intro="Baca teks sekali untuk gagasan utama, lalu kembali untuk mencari bukti jawaban." /><article lang="de" className="whitespace-pre-line rounded-xl bg-elevated p-5 text-base leading-8 text-ink">{unit.reading.text}</article><QuestionSet unit={unit} questions={unit.reading.questions} section="reading" onAllAnswered={goNext} /></>}
      {section === "listening" && <><SectionTitle icon={<Headphones size={20} />} title={`Hören · ${unit.listening.title}`} intro="Dengar sumber baru tanpa melihat transkrip. Suara dihasilkan oleh perangkat atau browser dan belum menggantikan audio alami." /><CourseAudio text={unit.listening.audioText} /><QuestionSet unit={unit} questions={unit.listening.questions} section="listening" onAllAnswered={goNext} />{listeningAnswered && <details className="mt-6 rounded-xl border border-border p-4"><summary className="cursor-pointer font-bold text-primary">Transkrip dan pembahasan setelah mencoba</summary><p lang="de" className="mt-3 whitespace-pre-line text-sm leading-7 text-ink">{unit.listening.audioText}</p></details>}</>}
      {section === "writing" && <><SectionTitle icon={<PenLine size={20} />} title="Schreiben · tugas mandiri" intro={`Sasaran ${unit.writing.minWords}–${unit.writing.maxWords} kata. Susun sendiri sebelum membandingkan contoh.`} /><ul className="list-disc space-y-1 pl-5 text-sm text-muted">{unit.writing.guidance.map((g) => <li key={g}>{g}</li>)}</ul><ProductionTask key={`${unit.id}-writing`} task={{ type: "writing", title: "Schreiben", assessment: "open", prompt: unit.writing.prompt, expected: unit.writing.modelAnswer, criteria: unit.writing.criteria }} draftId={`course-${unit.id}-writing`} onComplete={(result) => complete(unit.id, "writing", result.status)} /><p className="mt-3 text-xs text-muted">Koreksi AI atas teks dapat keliru; hasil ini belum setara penilaian penguji.</p></>}
      {section === "speaking" && <><SectionTitle icon={<Mic2 size={20} />} title="Sprechen · presentasi dan tanggapan" intro={`Siapkan selama ${unit.speaking.preparationSeconds} detik, lalu berbicara sekitar ${Math.round(unit.speaking.targetSeconds / 60)} menit. Jawab pertanyaan tindak lanjut tanpa membaca model.`} /><div className="rounded-xl bg-elevated p-4"><p className="text-sm font-bold text-ink">Pertanyaan lanjutan</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">{unit.speaking.followUps.map((q) => <li key={q} lang="de">{q}</li>)}</ul></div><ProductionTask key={`${unit.id}-speaking`} task={{ type: "speaking", title: "Sprechen", assessment: "open", prompt: unit.speaking.prompt, expected: unit.speaking.modelAnswer, criteria: unit.speaking.criteria }} draftId={`course-${unit.id}-speaking`} onComplete={(result) => complete(unit.id, "speaking", result.status)} /></>}
      {section === "review" && <><SectionTitle icon={<RotateCcw size={20} />} title="Uji ulang pada situasi baru" intro="Tugas ini baru berguna sebagai bukti setelah ada jeda dan kamu menjawab tanpa melihat contoh." />{!progress?.reviewDueAt ? <p className="rounded-xl bg-elevated p-4 text-sm text-muted">Selesaikan tugas menulis dan berbicara dulu. Uji ulang akan dijadwalkan untuk besok.</p> : !reviewDue ? <p className="rounded-xl bg-elevated p-4 text-sm text-muted">Uji ulang berikutnya tersedia {new Date(progress.reviewDueAt).toLocaleString("id-ID")}. Kamu tetap bisa meninjau materi sementara menunggu.</p> : <ProductionTask key={`${unit.id}-review-${progress.reviewedAt ?? "first"}`} task={{ type: "writing", title: "Uji ulang", assessment: "open", prompt: unit.review.prompt, expected: unit.review.modelAnswer, criteria: unit.review.criteria }} draftId={`course-${unit.id}-review-${progress.reviewedAt ?? "first"}`} onComplete={(result) => useCourseStore.getState().recordReview(unit.id, result.status)} />}</>}
    </section>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-muted">Unit ini latihan kursus. Lihat hasil setiap keterampilan dan ulangi bagian yang masih sulit.</p><CTAButton href={`/exam?level=${unit.level}`} variant="outline">Latihan format ujian <ArrowRight size={16} /></CTAButton></div>
  </div>;
}

function SectionTitle({ icon, title, intro }: { icon: React.ReactNode; title: string; intro: string }) { return <div className="mb-5"><div className="flex items-center gap-2 text-primary">{icon}<h2 className="font-heading text-xl font-extrabold text-ink">{title}</h2></div><p className="mt-2 text-sm leading-6 text-muted">{intro}</p></div>; }

function CourseAudio({ text }: { text: string }) { const { supported } = useTextToSpeech("de-DE"); return <div className="rounded-xl bg-primary-soft p-4"><p className="text-sm font-bold text-ink">Audio latihan</p><p className="mt-1 text-xs text-muted">Dengarkan sampai selesai sebelum menjawab. Kualitas suara bergantung pada perangkat.</p>{supported ? <ListenButton text={text} label="Putar audio Jerman" className="mt-3 min-h-11" /> : <div className="mt-3 rounded-lg bg-card p-3"><p className="text-xs font-bold text-ink">Suara tidak tersedia di browser ini</p><p className="mt-1 text-xs text-muted">Gunakan transkrip untuk belajar, tetapi jangan hitung hasilnya sebagai latihan menyimak.</p><p lang="de" className="mt-2 whitespace-pre-line text-sm leading-6 text-ink">{text}</p></div>}</div>; }

function QuestionSet({ unit, questions, section, onAllAnswered }: { unit: CourseUnit; questions: CourseQuestion[]; section: CourseSection; onAllAnswered: () => void }) {
  const answers = useCourseStore((state) => state.units[unit.id]?.answers ?? {});
  const answer = useCourseStore((state) => state.answer);
  const complete = useCourseStore((state) => state.complete);
  const completed = questions.every((q) => Number.isInteger(answers[q.id]));
  const correct = questions.filter((q) => answers[q.id] === q.correctIndex).length;
  return <div className="mt-6 space-y-5"><h3 className="font-heading font-bold text-ink">Periksa pemahaman</h3>{questions.map((question, i) => <fieldset key={question.id} className="rounded-xl border border-border p-4"><legend className="px-1 text-sm font-bold text-ink">{i + 1}. {question.prompt}</legend><div className="mt-2 space-y-2">{question.options.map((option, index) => { const selected = answers[question.id] === index; const attempted = Number.isInteger(answers[question.id]); return <button type="button" key={`${question.id}-${index}`} disabled={attempted} onClick={() => answer(unit.id, question.id, index)} className={`block min-h-11 w-full rounded-lg border px-3 py-2 text-left text-sm focusable ${selected ? (index === question.correctIndex ? "border-success bg-success/10 text-ink" : "border-danger bg-danger/10 text-ink") : "border-border bg-card text-ink hover:bg-elevated"}`}>{String.fromCharCode(65 + index)}. {option}</button>; })}</div>{Number.isInteger(answers[question.id]) && <p className="mt-3 text-sm text-muted">{answers[question.id] === question.correctIndex ? "Tepat. " : `Belum tepat. Jawaban: ${question.options[question.correctIndex]}. `}{question.explanation}</p>}</fieldset>)}{completed && <div className="rounded-xl bg-elevated p-4"><p className="font-bold text-ink">{correct}/{questions.length} benar pada percobaan ini</p><p className="mt-1 text-xs text-muted">Skor latihan topik ini belum menentukan level CEFR atau kesiapan ujian.</p><button className="mt-3 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-onprimary focusable" onClick={() => { complete(unit.id, section); onAllAnswered(); }}>Lanjut ke bagian berikutnya <ArrowRight size={16} className="ml-1 inline" /></button></div>}</div>;
}
