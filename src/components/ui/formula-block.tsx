import { ArrowRight, Plus } from "lucide-react";

// ============================================================
// FormulaBlock — turns a plain formula string into a clean,
// easy-to-read layout instead of text separated by "·", "+", "→".
//
// Conventions used by the grammar data:
//   "·"  separates independent items (e.g. a conjugation list)
//   "+"  joins parts of one pattern  (e.g. Subjekt + Verb + Rest)
//   "→"  shows a transformation      (e.g. der → den)
// ============================================================

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 font-mono text-sm font-medium text-ink">
      {children}
    </span>
  );
}

function Segment({ text }: { text: string }) {
  // render "a → b" with a nice arrow
  if (text.includes("→")) {
    const parts = text.split("→").map((p) => p.trim());
    return (
      <Pill>
        {parts.map((p, i) => (
          <span key={i} className="inline-flex items-center gap-1">
            {i > 0 && <ArrowRight className="h-3.5 w-3.5 text-primary" />}
            <span className={i === parts.length - 1 ? "font-bold text-primary" : ""}>{p}</span>
          </span>
        ))}
      </Pill>
    );
  }
  return <Pill>{text}</Pill>;
}

export function FormulaBlock({ formula }: { formula: string }) {
  const segments = formula
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);

  // Multiple independent items → a tidy wrap of pills (e.g. conjugation table).
  if (segments.length > 1) {
    return (
      <div className="flex flex-wrap gap-2">
        {segments.map((seg, i) => (
          <Segment key={i} text={seg} />
        ))}
      </div>
    );
  }

  // Single pattern joined by "+" → pills connected with a "+".
  const seg = segments[0] ?? formula;
  if (seg.includes("+")) {
    const parts = seg.split("+").map((p) => p.trim()).filter(Boolean);
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {parts.map((p, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            {i > 0 && <Plus className="h-3.5 w-3.5 text-primary" />}
            <Segment text={p} />
          </span>
        ))}
      </div>
    );
  }

  return <Segment text={seg} />;
}
