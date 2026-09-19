"use client";

import type { ReactNode } from "react";

import { useFormStatus } from "react-dom";

import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";

type SubmitButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pendingLabel?: string;
  className?: string;
  children: ReactNode;
  autoFocus?: boolean;
};

/*
 * Tombol submit yang otomatis menampilkan status "pending" (useFormStatus)
 * selama Server Action berjalan. Wajib dirender sebagai keturunan <form>.
 */
export function SubmitButton({
  variant = "primary",
  size = "md",
  pendingLabel = "Memproses...",
  className,
  children,
  autoFocus,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      disabled={pending}
      aria-disabled={pending}
      autoFocus={autoFocus}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}