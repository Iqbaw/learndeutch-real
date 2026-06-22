import { cn } from "@/lib/utils";
import type { ErrorItem, ErrorStatus } from "@/types";

const statusStyle: Record<ErrorStatus, { label: string; cls: string }> = {
  new: { label: "Baru salah", cls: "bg-danger/15 text-danger" },
  reviewed: { label: "Sudah direview", cls: "bg-primary-soft text-primary" },
  almost: { label: "Hampir dikuasai", cls: "bg-secondary-soft text-secondary" },
  safe: { label: "Aman", cls: "bg-success/15 text-success" },
  relapsed: { label: "Kambuh lagi", cls: "bg-warning/15 text-warning" },
};

const normTok = (t: string) => t.toLowerCase().replace(/[.,!?;:"'„""()]/g, "");
const tokenize = (s: string) => s.split(/\s+/).filter(Boolean);

export function ErrorCard({ item }: { item: ErrorItem }) {
  const status = statusStyle[item.status];

  const userToks = tokenize(item.userAnswer);
  const corrToks = tokenize(item.correctAnswer);
  const corrSet = new Set(corrToks.map(normTok));
  const userSet = new Set(userToks.map(normTok));

  // Only highlight tokens that genuinely differ — don't paint the whole sentence red.
  const sameAnswer = normTok(item.userAnswer) === normTok(item.correctAnswer);
  const wrongWords = userToks.filter((t) => !corrSet.has(normTok(t)));

  return (
    <div className="card-base p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-lg bg-elevated px-2 py-1 text-xs font-bold text-muted">
          {item.category}
        </span>
        <div className="flex items-center gap-2">
          <span className={cn("rounded-lg px-2 py-1 text-xs font-bold", status.cls)}>
            {status.label}
          </span>
          <span className="text-xs text-muted">{item.date}</span>
        </div>
      </div>

      {item.userAnswer && !sameAnswer && (
        <div className="mt-3">
          <p className="text-[0.7rem] font-bold uppercase tracking-wide text-muted">Yang kamu tulis</p>
          <p className="mt-1 font-body text-sm leading-relaxed">
            {userToks.map((t, i) => {
              const wrong = !corrSet.has(normTok(t));
              return (
                <span
                  key={i}
                  className={cn(
                    "mr-1 inline-block rounded px-1",
                    wrong ? "bg-danger/15 font-bold text-danger" : "text-ink/70"
                  )}
                >
                  {t}
                </span>
              );
            })}
          </p>
        </div>
      )}

      <div className="mt-2">
        <p className="text-[0.7rem] font-bold uppercase tracking-wide text-muted">Yang benar</p>
        <p className="mt-1 font-body text-sm leading-relaxed">
          {corrToks.map((t, i) => {
            const fix = !userSet.has(normTok(t)) && !sameAnswer && item.userAnswer.length > 0;
            return (
              <span
                key={i}
                className={cn(
                  "mr-1 inline-block rounded px-1",
                  fix ? "bg-success/15 font-bold text-success" : "text-ink"
                )}
              >
                {t}
              </span>
            );
          })}
        </p>
      </div>

      {wrongWords.length > 0 && (
        <p className="mt-2 text-xs text-muted">
          Fokus perbaiki: <span className="font-bold text-danger">{wrongWords.join(", ")}</span>
        </p>
      )}

      {item.explanation && <p className="mt-3 text-sm text-muted">{item.explanation}</p>}
    </div>
  );
}
