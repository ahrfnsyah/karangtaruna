"use client";

import { useActionState, useState } from "react";

import { login, type LoginState } from "@/app/admin/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, ShieldCheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const INPUT_BASE =
  "w-full rounded-control border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, { error: null });
  const [showPassword, setShowPassword] = useState(false);

  const hasError = state.error !== null;

  return (
    <Card className="mx-auto w-full max-w-md p-6 md:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-control bg-primary-50 text-primary-700">
        <ShieldCheckIcon className="h-6 w-6" />
      </div>
      <h1 className="mt-4 text-h2 text-foreground">Masuk Admin</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Login untuk mengelola konten website Karang Taruna RT 04 RW 08 Srengseng Sawah.
      </p>

      <form action={formAction} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={hasError ? true : undefined}
            aria-describedby={hasError ? "login-error" : undefined}
            className={cn(INPUT_BASE, hasError ? "border-accent-600" : "border-border")}
            placeholder="nama@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              aria-invalid={hasError ? true : undefined}
              className={cn(
                INPUT_BASE,
                "pr-12",
                hasError ? "border-accent-600" : "border-border",
              )}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {hasError ? (
          <p id="login-error" role="alert" className="text-sm font-medium text-accent-700">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
          {pending ? "Memproses..." : "Masuk"}
        </Button>
      </form>
    </Card>
  );
}