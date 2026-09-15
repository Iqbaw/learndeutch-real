"use client";

import { useState } from "react";
import { productionExam } from "@/data/production-exam";
import { ProductionTask } from "./production-task";
import { useAppStore } from "@/lib/store";
import { useLearningEvidence } from "@/lib/learning-evidence";
import { CTAButton } from "@/components/ui/cta-button";
import type { AssessmentResult } from "@/lib/assessment";

export function ProductionExam({ onFinish }: { onFinish: () => void }) {
  const goal = useAppStore((s) => s.profile?.goal ?? "");
  const tasks = productionExam(goal);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<number, { result: AssessmentResult; answer: string; spoken: boolean }>>({});
  const [review, setReview] = useState(false);
  const saveDraft = useLearningEvidence((s) => s.saveDraft);
  const task = tasks[index];
  if (review) return <section className="mx-auto max-w-2xl space-y-4">
    <h2 className="font-heading text-2xl font-bold text-ink">Hasil tugas menulis dan respons lisan</h2>
    <p className="text-sm text-muted">Terpisah dari nilai pilihan ganda. Respons lisan ditinjau melalui transkrip; pengucapan dan kelancaran memerlukan penilaian audio atau pengajar.</p>
    {tasks.map((t, i) => <article key={i} className="card-base p-5">
      <h3 className="font-bold text-ink">{t.title}</h3>
      <p className="mt-2 text-sm text-muted">{results[i]?.spoken ? "Dari transkrip suara" : "Jawaban tertulis"} · {results[i]?.result.status === "correct" ? "Isi tugas terpenuhi" : results[i]?.result.status === "needs-work" ? "Perlu diperbaiki" : "Perlu ditinjau"}</p>
      <p className="mt-3 whitespace-pre-wrap text-ink">{results[i]?.answer}</p>
      <p className="mt-3 text-sm text-ink">{results[i]?.result.feedback}</p>
      <p className="mt-3 text-sm text-muted">Contoh alternatif: {t.expected}</p>
    </article>)}
    <CTAButton onClick={onFinish}>Lihat hasil pemahaman</CTAButton>
  </section>;
  return <section className="mx-auto max-w-2xl card-base p-6">
    <p className="text-sm text-muted">Tugas mandiri {index + 1}/{tasks.length}</p>
    <h2 className="mt-2 font-heading text-xl font-bold text-ink">{task.title}</h2>
    <ProductionTask key={index} task={task} draftId={`mock-production-${goal}-${index}`} deferFeedback
      onComplete={(result, answer, spoken) => setResults((s) => ({ ...s, [index]: { result, answer, spoken } }))} />
    {results[index] && <CTAButton className="mt-4" onClick={() => {
      if (index === tasks.length - 1) {
        saveDraft(`mock-production-result-${goal}`, JSON.stringify({ at: new Date().toISOString(), results }));
        setReview(true);
      } else setIndex(index + 1);
    }}>{index === tasks.length - 1 ? "Lihat pembahasan tugas" : "Tugas berikutnya"}</CTAButton>}
  </section>;
}
