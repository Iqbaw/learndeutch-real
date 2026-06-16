import { clamp } from "@/lib/utils";

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({
  value,
  size = 88,
  stroke = 8,
  label,
  sublabel,
}: ProgressRingProps) {
  const v = clamp(value);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (v / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Progres ${Math.round(v)} persen`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-elevated"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-lg font-extrabold text-ink">
          {label ?? `${Math.round(v)}%`}
        </span>
        {sublabel && (
          <span className="text-[0.65rem] font-medium uppercase tracking-wide text-muted">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
