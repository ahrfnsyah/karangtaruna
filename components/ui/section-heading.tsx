import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">{eyebrow}</p>
      ) : null}
      <h2 className="text-h2 text-foreground">{title}</h2>
      {description ? (
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}