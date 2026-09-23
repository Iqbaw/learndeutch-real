"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Clock3, Headphones, Mic2, PenLine } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AppGuard } from "@/components/app-guard";
import { CTAButton } from "@/components/ui/cta-button";
import { ListenButton } from "@/components/ui/listen-button";
import { assessResponse } from "@/lib/assessment";
import { useExamStore } from "@/lib/exam-store";
import { useSpeechRecognition, useTextToSpeech } from "@/lib/speech";
import { courseBlueprints, courseLevels } from "@/data/course";
import { getExamPractice, practicesForLevel } from "@/data/exam-prep";
import type { CourseLevel, CourseSkill } from "@/types/course";
import type { ExamAttempt, ExamPractice } from "@/types/exam";

const skillLabels: Record<CourseSkill, string> = { reading: "Lesen", listening: "Hören", writing: "Schreiben", speaking: "Sprechen" };
const skillIcons = { reading: BookOpen, listening: Headphones, writing: PenLine, speaking: Mic2 };

export default function ExamPage() { return <Suspense fallback={<div className="min-h-screen bg-bg" />}><ExamInner /></Suspense>; }

function ExamInner() {
  const params = useSearchParams();
  const levelParam = params.get("level")?.toUpperCase();
  const level = courseLevels.includes(levelParam as CourseLevel) ? levelParam as CourseLevel : "B1";
  const practice = getExamPractice(params.get("practice") ?? "");
  const relevant = practice?.level === level ? practice : null;
  const attempts = useExamStore((state) => state.attempts);
  const start = useExamStore((state) => state.start);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [timed, setTimed] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const active = relevant && attempts.find((attempt) => attempt.id === activeId && attempt.practiceId === relevant.id);
  const unfinished = relevant && [...attempts].reverse().find((attempt) => attempt.practiceId === relevant.id && !attempt.submittedAt);
  const latest = relevant && [...attempts].reverse().find((attempt) => attempt.practiceId === relevant.id && attempt.submittedAt);
  useEffect(() => { if (!active?.deadlineAt || active.submittedAt) return; const tick = () => setNow(Date.now()); tick(); const timer = window.setInterval(tick, 1000); return () => window.clearInterval(timer); }, [active?.deadlineAt, active?.submittedAt]);
  useEffect(() => { if (relevant && active && !active.submittedAt && active.deadlineAt && now >= new Date(active.deadlineAt).getTime()) useExamStore.getState().submit(active.id, relevant); }, [active, now, relevant]);

  return <AppGuard><AppShell title="Latihan format ujian" subtitle="Empat keterampilan. Tugas baru. Umpan balik per modul.">
    {relevant ? <div className="mx-auto max-w-4xl"><Link href={`/exam?level=${level}`} className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-primary focusable"><ArrowLeft size={16} /> Semua modul {level}</Link>
      {!active ? <div className="card-base p-6"><span className="eyebrow">{level} · {skillLabels[relevant.skill]}</span><h1 className="mt-2 font-heading text-2xl font-extrabold text-ink">{relevant.title}</h1><p className="mt-2 text-sm leading-6 text-muted">{relevant.instructions}</p><p className="mt-4 text-sm text-muted">Satu set latihan orisinal. Waktu latihan {relevant.practiceMinutes} menit berbeda dari durasi ujian resmi. Nilai set pendek ini belum menjadi prediksi kelulusan.</p>
        <label className="mt-5 flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border p-3 text-sm font-bold text-ink"><input type="checkbox" checked={timed} onChange={(event) => setTimed(event.target.checked)} className="h-5 w-5" /> Gunakan batas waktu latihan</label>
        <div className="mt-5 flex flex-wrap gap-3"><CTAButton onClick={() => setActiveId(start(relevant, timed))}>Mulai set baru <ArrowRight size={17} /></CTAButton>{unfinished && <CTAButton variant="outline" onClick={() => setActiveId(unfinished.id)}>Lanjutkan sesi tersimpan</CTAButton>}{latest && <CTAButton variant="outline" onClick={() => setActiveId(latest.id)}>Lihat hasil terakhir</CTAButton>}</div>
      </div> : <AttemptView key={active.id} practice={relevant} attempt={active} now={now} />}
    </div> : <><div className="card-base p-6"><span className="eyebrow">GOETHE-ALIGNED PRACTICE</span><h1 className="mt-2 font-heading text-2xl font-extrabold text-ink">Latih tiap modul dengan materi baru</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Kerjakan materi kursus, lalu coba set per modul ini. Set latihan di sini lebih singkat daripada ujian resmi dan dibuat oleh Deutsch 30. Bahan ujian resmi tersedia melalui tautan Goethe-Institut.</p><div className="mt-4 flex flex-wrap gap-2">{courseLevels.map((item) => <Link key={item} href={`/exam?level=${item}`} className={`rounded-xl px-4 py-2 text-sm font-bold focusable ${item === level ? "bg-primary text-onprimary" : "bg-elevated text-ink"}`}>{item}</Link>)}</div></div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted">{level}: empat modul, masing-masing satu set latihan.</p><a href={courseBlueprints[level].sources[0].url} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary underline focusable">Lihat bahan resmi Goethe ↗</a></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{practicesForLevel(level).map((item) => { const Icon = skillIcons[item.skill]; const history = attempts.filter((attempt) => attempt.practiceId === item.id && attempt.submittedAt); return <Link key={item.id} href={`/exam?level=${level}&practice=${item.id}`} className="card-base group block p-5 transition-transform hover:-translate-y-0.5 focusable"><div className="flex items-center justify-between"><span className="rounded-xl bg-primary-soft p-2 text-primary"><Icon size={21} /></span><span className="text-xs text-muted">{history.length} percobaan</span></div><h2 className="mt-3 font-heading text-lg font-extrabold text-ink">{skillLabels[item.skill]}</h2><p className="mt-1 text-sm text-muted">{item.instructions}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">Buka modul <ArrowRight size={15} /></span></Link>; })}</div>
      <CTAButton href={`/course?level=${level}`} variant="outline" className="mt-5">Kembali ke materi {level}</CTAButton>
    </>}
  </AppShell></AppGuard>;
}

function AttemptView({ practice, attempt, now }: { practice: ExamPractice; attempt: ExamAttempt; now: number }) {
  const answer = useExamStore((state) => state.answer);
  const saveResponse = useExamStore((state) => state.saveResponse);
  const submit = useExamStore((state) => state.submit);
  const feedback = useExamStore((state) => state.feedback);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const submitted = Boolean(attempt.submittedAt);
  const remaining = attempt.deadlineAt ? Math.max(0, Math.ceil((new Date(attempt.deadlineAt).getTime() - now) / 1000)) : null;
  const answered = practice.questions ? practice.questions.filter((question) => Number.isInteger(attempt.answers[question.id])).length : attempt.response.trim() ? 1 : 0;
  const total = practice.questions?.length ?? 1;
  async function requestFeedback() {
    if (!practice.prompt || !attempt.response.trim() || attempt.aiFeedback || busy) return;
    setBusy(true);
    const result = await assessResponse(attempt.response, { type: practice.skill === "speaking" ? "speaking" : "writing", title: practice.title, assessment: "open", prompt: practice.prompt, expected: practice.modelAnswer, criteria: practice.criteria });
    feedback(attempt.id, result.status, result.feedback);
    setBusy(false);
  }
  return <div className="space-y-4"><div className="card-base flex flex-wrap items-center justify-between gap-3 p-4"><div><span className="text-xs font-bold text-primary">{practice.level} · {skillLabels[practice.skill]}</span><h1 className="font-heading text-xl font-extrabold text-ink">{practice.title}</h1></div><div className="text-right text-sm text-muted">{remaining !== null && !submitted ? <p className="font-mono font-bold text-ink"><Clock3 size={15} className="mr-1 inline" />{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}</p> : <p>{submitted ? "Selesai" : "Tanpa batas waktu"}</p>}<p>{answered}/{total} {practice.questions ? "soal dijawab" : "respons tersimpan"}</p></div></div>
    {practice.sourceText && <article className="card-base whitespace-pre-line p-5 text-base leading-8 text-ink" lang="de"><h2 className="mb-3 font-heading text-lg font-bold">{practice.sourceTitle}</h2>{practice.sourceText}</article>}
    {practice.audioText && <ExamAudio title={practice.sourceTitle ?? "Audio latihan"} text={practice.audioText} submitted={submitted} />}
    {practice.questions && <div className="space-y-3">{practice.questions.map((question, index) => <fieldset key={question.id} className="card-base p-4"><legend className="px-2 text-sm font-bold text-ink">{index + 1}. {question.prompt}</legend><div className="space-y-2">{question.options.map((option, optionIndex) => <label key={option} className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm text-ink ${attempt.answers[question.id] === optionIndex ? "border-primary bg-primary-soft" : "border-border"}`}><input type="radio" name={`${attempt.id}-${question.id}`} checked={attempt.answers[question.id] === optionIndex} disabled={submitted} onChange={() => answer(attempt.id, question.id, optionIndex)} className="h-5 w-5" />{option}</label>)}</div>{submitted && <p className="mt-3 text-sm text-muted">{attempt.answers[question.id] === question.correctIndex ? "Tepat. " : `Jawaban: ${question.options[question.correctIndex].replace(/[.!?]$/, "")}. `}{question.explanation}</p>}</fieldset>)}</div>}
    {practice.prompt && <div className="card-base p-5"><h2 className="font-heading font-bold text-ink">Tugas mandiri</h2><p className="mt-2 text-sm leading-6 text-ink">{practice.prompt}</p>{practice.followUps && <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">{practice.followUps.map((question) => <li key={question} lang="de">{question}</li>)}</ul>}{practice.skill === "speaking" && !submitted && <SpeakingRecorder onFinal={(value) => saveResponse(attempt.id, value)} />}
      <label className="mt-4 block text-sm font-bold text-ink" htmlFor="exam-response">{practice.skill === "speaking" ? "Transkrip ucapan atau catatan jawaban" : "Jawaban tertulis"}</label><textarea id="exam-response" value={attempt.response} onChange={(event) => saveResponse(attempt.id, event.target.value)} disabled={submitted} maxLength={5000} rows={10} className="mt-2 w-full rounded-xl border border-border bg-card p-4 text-base text-ink focusable disabled:opacity-75" placeholder="Tulis responsmu di sini. Tersimpan otomatis di perangkat ini." /><p className="mt-1 text-xs text-muted">{attempt.response.trim().split(/\s+/).filter(Boolean).length} kata · draf tersimpan otomatis</p></div>}
    {!submitted ? <div className="card-base p-4">{confirm ? <><p className="font-bold text-ink">Kumpulkan sekarang?</p><p className="mt-1 text-sm text-muted">{answered < total ? `${total - answered} bagian belum dijawab. ` : ""}Setelah dikumpulkan, jawaban tidak dapat diubah.</p><div className="mt-3 flex gap-2"><CTAButton onClick={() => submit(attempt.id, practice)}>Ya, kumpulkan</CTAButton><CTAButton variant="outline" onClick={() => setConfirm(false)}>Kembali</CTAButton></div></> : <CTAButton onClick={() => setConfirm(true)}>Kumpulkan latihan</CTAButton>}</div> : <div className="card-base p-5"><h2 className="font-heading text-lg font-extrabold text-ink">Hasil latihan</h2>{practice.questions ? <><p className="mt-2 text-xl font-bold text-ink">{attempt.correctCount}/{attempt.totalCount} tepat</p><p className="mt-1 text-sm text-muted">Jumlah soal set ini lebih sedikit dari ujian resmi. Gunakan kesalahan untuk memilih materi yang perlu diulang.</p></> : <><p className="mt-2 text-sm text-muted">Respons tersimpan. Penilaian menulis dan berbicara memerlukan rubrik serta, idealnya, tinjauan pengajar.</p>{attempt.response.trim() && !attempt.aiFeedback && <CTAButton variant="outline" onClick={requestFeedback} disabled={busy} className="mt-3">{busy ? "Meninjau…" : "Minta tinjauan teks AI"}</CTAButton>}{attempt.aiFeedback && <div className="mt-3 rounded-xl bg-elevated p-4 text-sm text-ink"><b>{attempt.aiFeedback.status === "ungraded" ? "Belum dinilai" : "Tinjauan AI atas teks"}</b><p className="mt-1">{attempt.aiFeedback.feedback}</p><p className="mt-2 text-xs text-muted">Bukan nilai resmi; transkrip tidak mengukur pelafalan atau kelancaran.</p></div>}</>}
      {practice.criteria && <div className="mt-4"><h3 className="font-bold text-ink">Periksa dengan rubrik</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">{practice.criteria.map((item) => <li key={item}>{item}</li>)}</ul></div>}{practice.modelAnswer && <details className="mt-4 rounded-xl border border-border p-4"><summary className="cursor-pointer font-bold text-primary">Bandingkan dengan contoh respons</summary><p lang="de" className="mt-3 whitespace-pre-line text-sm leading-7 text-ink">{practice.modelAnswer}</p></details>}
      <div className="mt-5 flex flex-wrap gap-2"><CTAButton href={`/course?level=${practice.level}`} variant="outline">Ulangi materi</CTAButton><CTAButton href={`/exam?level=${practice.level}`}>Pilih modul lain <ArrowRight size={16} /></CTAButton></div></div>}
  </div>;
}

function ExamAudio({ title, text, submitted }: { title: string; text: string; submitted: boolean }) {
  const { supported } = useTextToSpeech("de-DE");
  return <div className="card-base p-5"><h2 className="font-heading font-bold text-ink">{title}</h2><p className="mt-1 text-xs text-muted">Suara sintetis browser. Transkrip tersedia setelah tugas dikumpulkan.</p>{supported ? <ListenButton text={text} label="Putar audio" className="mt-3 min-h-11" /> : <div className="mt-3 rounded-xl bg-elevated p-4"><p className="text-sm font-bold text-ink">Suara tidak tersedia di browser ini.</p><p className="mt-1 text-xs text-muted">Kamu boleh memakai transkrip sebagai latihan membaca. Hasilnya tidak boleh dianggap skor Hören; coba ulang di perangkat dengan suara Jerman.</p>{!submitted && <details className="mt-3"><summary className="cursor-pointer text-sm font-bold text-primary">Buka transkrip bantuan</summary><p lang="de" className="mt-3 whitespace-pre-line text-sm leading-7 text-ink">{text}</p></details>}</div>}{submitted && <details className="mt-4 rounded-xl bg-elevated p-4"><summary className="cursor-pointer font-bold text-primary">Lihat transkrip</summary><p lang="de" className="mt-3 whitespace-pre-line text-sm leading-7 text-ink">{text}</p></details>}</div>;
}

function SpeakingRecorder({ onFinal }: { onFinal: (text: string) => void }) {
  const { supported, listening, interim, error, start, stop } = useSpeechRecognition({ lang: "de-DE", onFinal });
  return <div className="mt-4 rounded-xl bg-elevated p-4"><p className="text-sm text-muted">Ucapkan respons dengan mikrofon bila tersedia. Browser mengubah ucapan menjadi teks; rekaman audio tidak dinilai di sini.</p>{supported ? <button type="button" onClick={() => listening ? stop() : start()} className="mt-3 min-h-11 rounded-xl bg-primary px-4 text-sm font-bold text-onprimary focusable">{listening ? "Berhenti" : "Mulai bicara"}</button> : <p className="mt-2 text-sm text-muted">Pengenalan suara tidak tersedia di browser ini. Tulis ringkasan responsmu.</p>}{interim && <p className="mt-2 text-sm text-muted" aria-live="polite">{interim}</p>}{error && <p className="mt-2 text-sm text-danger" role="alert">{error}</p>}</div>;
}
