import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex w-fit items-center rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-muted">{description}</p>
      )}
      {children}
    </div>
  );
}
