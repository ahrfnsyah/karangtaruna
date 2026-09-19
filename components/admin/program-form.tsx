"use client";

import { useActionState } from "react";

import { LinkButton } from "@/components/ui/button";
import { PROGRAM_CATEGORIES } from "@/lib/program-categories";
import { cn } from "@/lib/utils";

import { SubmitButton } from "./submit-button";

export type ProgramFormValues = {
  title: string;
  category: string;
  description: string;
  status: string;
  target: string;
};

export type ProgramFormState = {
  error: string | null;
};

const INPUT_BASE =
  "w-full rounded-control border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground";

type ProgramFormAction = (
  prevState: ProgramFormState,
  formData: FormData,
) => Promise<ProgramFormState>;

type ProgramFormProps = {
  action: ProgramFormAction;
  submitLabel: string;
  initial?: ProgramFormValues;
  id?: string;
};

/*
 * Form tambah/edit program kerja (Client Component). Memakai useActionState
 * agar pesan error dari Server Action bisa ditampilkan inline. Satu komponen
 * dipakai untuk halaman "new" (tanpa id) dan "edit" (id + nilai awal).
 */
export function ProgramForm({ action, submitLabel, initial, id }: ProgramFormProps) {
  const [state, formAction] = useActionState<ProgramFormState, FormData>(action, {
    error: null,
  });

  const hasError = state.error !== null;

  const fieldErrorProps = {
    "aria-invalid": hasError ? true : undefined,
    "aria-describedby": hasError ? "program-form-error" : undefined,
  };

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {id ? <input type="hidden" name="id" value={id} /> : null}

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-foreground">
          Judul
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          defaultValue={initial?.title ?? ""}
          placeholder="Nama program kerja"
          className={cn(INPUT_BASE, "border-border")}
          {...fieldErrorProps}
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-foreground">
          Kategori
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue={initial?.category ?? ""}
          className={cn(INPUT_BASE, "border-border")}
          {...fieldErrorProps}
        >
          <option value="" disabled>
            Pilih kategori...
          </option>
          {PROGRAM_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-foreground">
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          maxLength={500}
          defaultValue={initial?.description ?? ""}
          placeholder="Tujuan dan cakupan program..."
          className={cn(INPUT_BASE, "border-border resize-y")}
          {...fieldErrorProps}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-foreground">
            Status <span className="font-normal text-muted-foreground">(opsional)</span>
          </label>
          <input
            id="status"
            name="status"
            type="text"
            maxLength={100}
            defaultValue={initial?.status ?? ""}
            placeholder="Contoh: Program Tahunan"
            className={cn(INPUT_BASE, "border-border")}
            {...fieldErrorProps}
          />
        </div>
        <div>
          <label htmlFor="target" className="mb-1.5 block text-sm font-medium text-foreground">
            Target <span className="font-normal text-muted-foreground">(opsional)</span>
          </label>
          <input
            id="target"
            name="target"
            type="text"
            maxLength={100}
            defaultValue={initial?.target ?? ""}
            placeholder="Contoh: Pemuda RT 04 RW 08"
            className={cn(INPUT_BASE, "border-border")}
            {...fieldErrorProps}
          />
        </div>
      </div>

      {hasError ? (
        <p id="program-form-error" role="alert" className="text-sm font-medium text-accent-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-5">
        <SubmitButton pendingLabel="Menyimpan...">{submitLabel}</SubmitButton>
        <LinkButton href="/admin/program-kerja" variant="ghost">
          Batal
        </LinkButton>
      </div>
    </form>
  );
}