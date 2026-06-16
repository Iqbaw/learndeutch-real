import { cn } from "@/lib/utils";
import type { Roleplay } from "@/types";
import { LevelBadge } from "@/components/ui/level-badge";

interface RoleplayCardProps {
  roleplay: Roleplay;
  active?: boolean;
  onSelect?: (id: string) => void;
}

export function RoleplayCard({ roleplay, active, onSelect }: RoleplayCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(roleplay.id)}
      className={cn(
        "card-base flex w-full items-start gap-3 p-4 text-left transition-all hover:shadow-glow focusable",
        active && "ring-2 ring-primary"
      )}
    >
      <span className="text-2xl" aria-hidden>{roleplay.emoji}</span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-bold text-ink">{roleplay.title}</h3>
          <LevelBadge level={roleplay.level} />
        </div>
        <p className="mt-0.5 text-sm text-muted">{roleplay.scenario}</p>
      </div>
    </button>
  );
}
