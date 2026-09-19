"use client";

import { useActionState } from "react";

import { cn } from "@/lib/utils";

import { LinkButton } from "@/components/ui/button";
import { SubmitButton } from "@/components/admin/submit-button";

const INPUT_BASE =
  "w-full rounded-control border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground";

export type SettingsFormState = {
  error: string | null;
};

type SettingsFormAction = (
  _prevState: SettingsFormState,
  formData: FormData,
) => Promise<SettingsFormState>;

export type SettingsInitial = {
  vision: string;
  about_paragraphs: string[];
};

type SettingsFormProps = {
  action: SettingsFormAction;
  submitLabel: string;
  initial: SettingsInitial;
};

export function TentangSettingsForm({ action, submitLabel, initial }: SettingsFormProps) {
  const [state, formAction] = useActionState<SettingsFormState, FormData>(action, {
    error: null,
  });

  const errorProps = state.error
    ? {
        "aria-invalid": true,
        "aria-describedby": "settings-form-error",
      }
    : {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div>
        <label htmlFor="vision" className="mb-1.5 block text-sm font-medium text-foreground">
          Visi
        </label>
        <textarea
          id="vision"
          name="vision"
          rows={3}
          maxLength={2000}
          defaultValue={initial.vision}
          placeholder="Visi Karang Taruna..."
          className={cn(INPUT_BASE, state.error && "border-accent-700")}
          {...errorProps}
        />
      </div>

      <div>
        <label
          htmlFor="about_paragraphs"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Paragraf Pembuka
        </label>
        <textarea
          id="about_paragraphs"
          name="about_paragraphs"
          rows={6}
          maxLength={6000}
          defaultValue={initial.about_paragraphs.join("\n\n")}
          placeholder="Tulis paragraf pembuka halaman tentang, dipisahkan baris kosong."
          className={cn(INPUT_BASE, state.error && "border-accent-700")}
          {...errorProps}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Setiap baris kosong memisahkan satu paragraf.
        </p>
      </div>

      {state.error ? (
        <p id="settings-form-error" role="alert" className="text-sm font-medium text-accent-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <SubmitButton>{submitLabel}</SubmitButton>
        <LinkButton href="/admin/tentang" variant="ghost" size="sm">
          Batal
        </LinkButton>
      </div>
    </form>
  );
}
