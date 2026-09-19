import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = {
  as?: ElementType;
  size?: "default" | "narrow" | "wide";
  className?: string;
  children?: ReactNode;
};

const sizes = {
  default: "max-w-7xl",
  narrow: "max-w-3xl",
  wide: "max-w-[90rem]",
};

export function Container({ as: Tag = "div", size = "default", className, children }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)}>
      {children}
    </Tag>
  );
}