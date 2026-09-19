import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionProps = {
  as?: ElementType;
  id?: string;
  muted?: boolean;
  className?: string;
  children: ReactNode;
};

export function Section({ as: Tag = "section", id, muted = false, className, children }: SectionProps) {
  return (
    <Tag id={id} className={cn("scroll-mt-24 py-16 md:py-24", muted && "bg-muted", className)}>
      {children}
    </Tag>
  );
}