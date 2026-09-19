"use client";

import { useActionState } from "react";

import { cn } from "@/lib/utils";

import { LinkButton } from "@/components/ui/button";
import { SubmitButton } from "@/components/admin/submit-button";

const INPUT_BASE =
  "w-full rounded-control border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground";

export type TentangFormState = {
  error: string | null;
};

type TentangStatFormAction = (
  _prevState: TentangFormState,
  formData: FormData,
) => Promise<TentangFormState>;

export type TentangStatInitial = {
  label: string;
  value: string;
  sort_order: string;
  is_published: boolean;
};

type TentangStatFormProps = {
  action: TentangStatFormAction;
  submitLabel: string;
  initial?: TentangStatInitial;
  id?: string;
};

export function TentangStatForm({
  action,
  submitLabel,
  initial = {
    label: "",
    value: "",
    sort_order: "",
    is_published: true,
  },
  id,
}: TentangStatFormProps) {
  const [state, formAction] = useActionState<TentangFormState, FormData>(action, {
    error: null,
  });

  const errorProps = state.error
    ? {
        "aria-invalid": true,
        "aria-describedby": "stat-form-error",
      }
    : {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {id ? <input type="hidden" name="id" value={id} /> : null}

      <div>
        <label htmlFor="label" className="mb-1.5 block text-sm font-medium text-foreground">
          Label
        </label>
        <input
          id="label"
          name="label"
          type="text"
          maxLength={80}
          defaultValue={initial.label}
          placeholder="Contoh: Kegiatan Tahunan"
          className={cn(INPUT_BASE, state.error && "border-accent-700")}
          {...errorProps}
        />
      </div>

      <div>
        <label htmlFor="value" className="mb-1.5 block text-sm font-medium text-foreground">
          Nilai
        </label>
        <input
          id="value"
          name="value"
          type="text"
          maxLength={20}
          defaultValue={initial.value}
          placeholder="Contoh: 50+"
          className={cn(INPUT_BASE, state.error && "border-accent-700")}
          {...errorProps}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="sort_order"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Urutan
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="text"
            inputMode="numeric"
            maxLength={6}
            defaultValue={initial.sort_order}
            placeholder="0"
            className={cn(INPUT_BASE, state.error && "border-accent-700")}
            {...errorProps}
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 pb-2.5 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={initial.is_published}
              className="h-4 w-4 rounded-control border-border bg-background text-primary-600 focus:ring-primary-500"
            />
            Publikasikan
          </label>
        </div>
      </div>

      {state.error ? (
        <p id="stat-form-error" role="alert" className="text-sm font-medium text-accent-700">
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
