import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "link" | "outlineLight";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 text-white shadow-card hover:bg-primary-700 active:bg-primary-800",
  accent: "bg-accent-600 text-white shadow-card hover:bg-accent-700 active:bg-accent-800",
  outline: "border border-border bg-background text-foreground hover:border-slate-300 hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  link: "text-primary-700 underline decoration-primary-300 underline-offset-4 hover:text-primary-900 hover:decoration-primary-500",
  outlineLight: "border border-white/25 bg-transparent text-white hover:border-white/45 hover:bg-white/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-base",
};

const baseClasses =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50";

export function buttonVariants({
  variant = "primary",
  size = "md",
}: { variant?: ButtonVariant; size?: ButtonSize } = {}) {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size]);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ variant = "primary", size = "md", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </Link>
  );
}