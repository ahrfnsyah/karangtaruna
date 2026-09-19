import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "accent" | "neutral" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  primary: "border-primary-200 bg-primary-50 text-primary-800",
  accent: "border-accent-200 bg-accent-50 text-accent-700",
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
  outline: "border-border bg-background text-slate-600",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ variant = "primary", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}