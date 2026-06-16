import { Flame, Target, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";

// Lightweight static mockup of the learning dashboard (PRD section 16.1 hero visual)
export function HeroMockup() {
  const skills = [
    { label: "Listening", v: 64 },
    { label: "Reading", v: 72 },
    { label: "Speaking", v: 41 },
    { label: "Grammar", v: 58 },
    { label: "Vocab", v: 75 },
    { label: "Writing", v: 48 },
  ];

  return (
    <div className="relative w-full rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5">
      {/* Today's mission */}
      <div className="rounded-2xl bg-gradient-to-br from-primary-soft/80 to-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-primary">HARI 4 · A1.1</p>
            <p className="font-heading text-base font-extrabold text-ink">
              Kenalan seperti Orang Jerman
            </p>
            <p className="mt-0.5 text-xs text-muted">Today’s Mission · 45 menit</p>
          </div>
          <ProgressRing value={35} size={64} stroke={7} sublabel="hari ini" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* Skill radar (bar style for mock) */}
        <div className="rounded-2xl border border-border p-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-ink">
            <TrendingUp className="h-3.5 w-3.5 text-primary" /> CEFR Skill Radar
          </p>
          <div className="space-y-1.5">
            {skills.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="w-14 text-[0.6rem] text-muted">{s.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-elevated">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${s.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 30 day map */}
        <div className="rounded-2xl border border-border p-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-ink">
            <Target className="h-3.5 w-3.5 text-secondary" /> 30-Day Map
          </p>
          <div className="grid grid-cols-6 gap-1">
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              const cls =
                day < 4
                  ? "bg-success/30"
                  : day === 4
                  ? "bg-primary"
                  : day === 15 || day === 30
                  ? "bg-secondary/40"
                  : "bg-elevated";
              return <span key={i} className={`aspect-square rounded ${cls}`} />;
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-3">
          <p className="flex items-center gap-1.5 text-xs font-bold text-warning">
            <AlertCircle className="h-3.5 w-3.5" /> Weakness Box
          </p>
          <p className="mt-1 text-[0.7rem] leading-snug text-ink/80">
            Artikel der/die/das &amp; posisi verb setelah “Heute”.
          </p>
        </div>
        <div className="rounded-2xl border border-primary/30 bg-primary-soft/50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <RefreshCw className="h-3.5 w-3.5" /> Review Queue
          </p>
          <p className="mt-1 text-[0.7rem] leading-snug text-ink/80">
            27 kata perlu direview hari ini.
          </p>
        </div>
      </div>

      {/* floating streak */}
      <div className="absolute -right-3 -top-3 flex items-center gap-1.5 rounded-2xl border border-border bg-card px-3 py-2 shadow-soft">
        <Flame className="h-4 w-4 text-secondary" />
        <span className="font-heading text-sm font-extrabold text-ink">7</span>
        <span className="text-[0.65rem] text-muted">hari</span>
      </div>
    </div>
  );
}
