"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:brightness-110 shadow-soft dark:text-bg",
  secondary:
    "bg-secondary text-white hover:brightness-110 shadow-soft dark:text-bg",
  outline:
    "border border-border bg-card text-ink hover:bg-elevated",
  ghost: "text-ink hover:bg-elevated",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-14 px-7 text-base",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

interface ButtonProps extends BaseProps {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

interface LinkProps extends BaseProps {
  href: string;
}

export function CTAButton(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-heading font-bold transition-all focusable disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
    variants[variant],
    sizes[size],
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { onClick, type = "button", disabled } = props as ButtonProps;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
