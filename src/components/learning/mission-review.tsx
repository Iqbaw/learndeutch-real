"use client";

import { useState } from "react";
import { useLearningEvidence } from "@/lib/learning-evidence";
import { missionStep } from "@/data/daily-missions";
import { ProductionTask } from "./production-task";

export function MissionReview() {
  const missions = useLearningEvidence((s) => s.missions);
  const record = useLearningEvidence((s) => s.record);
  const [active, setActive] = useState<string | null>(null);
  const due = Object.values(missions).filter((m) => new Date(m.dueAt).getTime() <= Date.now())
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  const scheduled = Object.values(missions).sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  const selected = active ? missions[active] : undefined;
  if (!scheduled.length && !selected) return null;
  return <section className="card-base mb-6 p-5">
    <h2 className="font-heading text-xl font-bold text-ink">Misi setelah jeda</h2>
    <p className="mt-2 text-sm text-muted">{due.length
      ? `${due.length} misi waktunya dicoba dalam situasi baru. Jawab tanpa melihat contoh lama. Tinjauan teks belum membuktikan kemampuan berbicara.`
      : `Belum ada misi yang jatuh tempo. Misi berikutnya dapat dicoba ${new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date(scheduled[0].dueAt))}.`}</p>
    {selected ? <>
      <ProductionTask key={selected.id} task={missionStep(selected.day, selected.goal, true)} draftId={`${selected.id}-review-${selected.dueAt}`}
        onComplete={(result, answer) => record(selected.id, selected.day, selected.goal, answer, result, true)} />
      <button className="mt-3 rounded-lg px-3 py-2 font-bold text-primary focusable" onClick={() => setActive(null)}>Kembali ke daftar misi</button>
    </> : due.length > 0 ? <div className="mt-3 flex flex-wrap gap-2">{due.slice(0, 5).map((m) => <button key={m.id} onClick={() => setActive(m.id)} className="rounded-xl border border-border px-4 py-3 text-sm font-bold text-ink focusable">Hari {m.day} · {m.status === "ungraded" ? "Perlu ditinjau" : "Uji kembali"}</button>)}</div> : null}
  </section>;
}
