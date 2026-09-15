"use client";

import { useEffect, useRef, useState } from "react";
import { assessResponse, type AssessmentResult } from "@/lib/assessment";
import { useLearningEvidence } from "@/lib/learning-evidence";
import { useSpeechRecognition } from "@/lib/speech";
import { CTAButton } from "@/components/ui/cta-button";
import { ListenButton } from "@/components/ui/listen-button";
import type { LessonStep } from "@/types";

export function ProductionTask({ task, draftId, onComplete, deferFeedback = false }: {
  task: LessonStep;
  draftId: string;
  onComplete?: (result: AssessmentResult, answer: string, spoken: boolean) => void;
  deferFeedback?: boolean;
}) {
  const saved = useLearningEvidence((s) => s.drafts[draftId] ?? "");
  const saveDraft = useLearningEvidence((s) => s.saveDraft);
  const [answer, setAnswer] = useState(saved);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [assisted, setAssisted] = useState(() => useLearningEvidence.getState().drafts[`${draftId}-help`] === "yes");
  const [spoken, setSpoken] = useState(false);
  const mounted = useRef(true);
  const sending = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const { supported, listening, interim, error, start, stop } = useSpeechRecognition({ lang: "de-DE",
    onFinal: (text) => { setAnswer(text); saveDraft(draftId, text); setSpoken(true); },
  });
  const speaking = task.type === "speaking";

  async function submit() {
    if (!answer.trim() || sending.current || listening) return;
    sending.current = true;
    setBusy(true);
    const evaluated = await assessResponse(answer, task);
    if (!mounted.current) return;
    const final = assisted ? { ...evaluated, status: "ungraded" as const,
      feedback: `${evaluated.feedback} Percobaan ini menggunakan contoh, jadi belum menjadi bukti mandiri.` } : evaluated;
    setResult(final);
    setBusy(false);
    sending.current = false;
    onComplete?.(final, answer, speaking && spoken);
  }

  return <div className="mt-4 space-y-4">
    <p className="rounded-2xl bg-primary-soft/60 p-4 font-heading text-lg font-bold text-ink">{task.prompt}</p>
    {!!task.criteria?.length && <div className="rounded-xl border border-border p-4">
      <p className="font-bold text-ink">Yang perlu tersampaikan</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">{task.criteria.map((c) => <li key={c}>{c}</li>)}</ul>
    </div>}
    {speaking && <div className="space-y-2">
      <p className="text-sm text-muted">Ucapkan jawabanmu sendiri. Transkrip membantu meninjau isi dan kalimat; pelafalan serta kelancaran audio belum dinilai.</p>
      {supported ? <CTAButton variant="outline" onClick={() => listening ? stop() : start()} disabled={busy || !!result}>
        {listening ? "Berhenti merekam" : "Mulai bicara"}
      </CTAButton> : <p className="text-sm text-muted">Pengenalan suara belum tersedia. Kamu bisa menulis jawaban; latihan ini akan dicatat sebagai latihan tertulis.</p>}
      {interim && <p aria-live="polite" className="text-sm text-muted">{interim}</p>}
      {error && <p role="alert" className="text-sm text-danger">{error} Kamu tetap bisa menulis jawaban.</p>}
    </div>}
    <label className="block text-sm font-bold text-ink" htmlFor={`answer-${draftId}`}>{speaking ? "Transkrip / jawaban tertulis" : "Jawabanmu"}</label>
    <textarea id={`answer-${draftId}`} value={answer} maxLength={3000} rows={4} disabled={busy || !!result || listening}
      onChange={(e) => { setAnswer(e.target.value); saveDraft(draftId, e.target.value); setSpoken(false); }}
      className="w-full rounded-2xl border border-border bg-card p-4 text-ink focusable disabled:opacity-70" placeholder="Tulis dengan kalimatmu sendiri…" />
    {!result && <CTAButton onClick={submit} disabled={busy || listening || !answer.trim()}>{busy ? "Meninjau jawaban…" : deferFeedback ? "Simpan jawaban" : "Periksa jawaban"}</CTAButton>}
    {result && <div role="status" className="rounded-xl border border-border bg-elevated p-4 text-sm text-ink">
      {deferFeedback ? <p>Jawaban tersimpan. Pembahasan muncul setelah semua tugas selesai.</p> : <>
        <p className="font-bold">{result.status === "correct" ? "Tugas terpenuhi" : result.status === "needs-work" ? "Ada bagian yang perlu diperbaiki" : "Belum dinilai sebagai penguasaan"}</p>
        <p className="mt-2">{result.feedback}</p>
        {result.checks.map((c) => <p key={c.criterion} className="mt-1">{c.met ? "✓" : "○"} {c.criterion}</p>)}
        <p className="mt-2 text-xs text-muted">{result.source === "ai" ? "Tinjauan AI atas teks; dapat keliru. Ini bukan hasil ujian resmi." : result.source === "answer-key" ? "Diperiksa terhadap contoh jawaban yang diterima." : "Tidak ada nilai otomatis yang ditambahkan."}</p>
        <button className="mt-3 rounded-lg px-3 py-2 font-bold text-primary focusable" onClick={() => setResult(null)}>Perbaiki dan coba lagi</button>
      </>}
    </div>}
    {!deferFeedback && task.expected && <details onToggle={(e) => { if (e.currentTarget.open && !result) { setAssisted(true); saveDraft(`${draftId}-help`, "yes"); } }} className="rounded-xl border border-border p-4">
      <summary className="cursor-pointer font-bold text-primary focusable">{result ? "Bandingkan dengan contoh" : "Butuh bantuan? Lihat contoh"}</summary>
      <p className="mt-2 text-sm text-muted">Ada beberapa jawaban yang mungkin benar. Jika melihat contoh sebelum menjawab, percobaan ini dicatat sebagai latihan dengan bantuan.</p>
      <p className="mt-2 text-ink">{task.expected}</p><ListenButton text={task.expected} />
    </details>}
  </div>;
}
