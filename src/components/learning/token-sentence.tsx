import { cn } from "@/lib/utils";
import type { ColoredToken } from "@/types";

// Color coding for grammar (PRD section 11.2: Ich=biru, komme=merah, info=hijau)
const roleClass: Record<ColoredToken["role"], string> = {
  subject: "bg-primary-soft text-primary",
  verb: "bg-danger/15 text-danger",
  info: "bg-success/15 text-success",
  object: "bg-secondary-soft text-secondary",
  time: "bg-secondary-soft text-secondary",
  plain: "text-ink",
};

const roleLabel: Record<ColoredToken["role"], string> = {
  subject: "subjek",
  verb: "kata kerja",
  info: "informasi",
  object: "objek",
  time: "waktu",
  plain: "",
};

export function TokenSentence({ tokens }: { tokens: ColoredToken[] }) {
  return (
    <div className="flex flex-wrap items-end gap-2">
      {tokens.map((t, i) => (
        <span key={i} className="flex flex-col items-center gap-1">
          <span
            className={cn(
              "rounded-lg px-3 py-2 font-heading text-lg font-bold",
              roleClass[t.role]
            )}
          >
            {t.text}
          </span>
          {roleLabel[t.role] && (
            <span className="text-[0.6rem] font-medium uppercase tracking-wide text-muted">
              {roleLabel[t.role]}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
