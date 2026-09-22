"use client";

import { useActionState, useState } from "react";

import { cn } from "@/lib/utils";

import { LinkButton } from "@/components/ui/button";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  SORT_ORDER_PATTERN,
  TEAM_GROUP_SET,
  TEAM_MAX_NAMES,
  TEAM_NAME_MAX_LENGTH,
} from "@/lib/tentang-admin";

const INPUT_BASE =
  "w-full rounded-control border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground";

export type TeamFormState = {
  error: string | null;
};

type TeamFormAction = (
  _prevState: TeamFormState,
  formData: FormData,
) => Promise<TeamFormState>;

export type TeamMemberInitial = {
  names: string[];
  position: string;
  group_name: string;
  sort_order: string;
  is_active: boolean;
};

type TeamFormProps = {
  action: TeamFormAction;
  submitLabel: string;
  initial?: TeamMemberInitial;
  id?: string;
};

const GROUP_LABELS: Record<string, string> = {
  pengurus: "Pengurus",
  divisi: "Divisi",
};

export function TeamMemberForm({ action, submitLabel, initial, id }: TeamFormProps) {
  const [state, formAction] = useActionState<TeamFormState, FormData>(action, {
    error: null,
  });

  const [names, setNames] = useState<string[]>(
    initial?.names.length ? initial.names : [""],
  );

  const errorProps = state.error
    ? {
        "aria-invalid": true,
        "aria-describedby": "team-form-error",
      }
    : {};

  function handleAddName() {
    setNames((prev) => (prev.length >= TEAM_MAX_NAMES ? prev : [...prev, ""]));
  }

  function handleRemoveName(index: number) {
    setNames((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {id ? <input type="hidden" name="id" value={id} /> : null}

      <div>
        <label htmlFor="position" className="mb-1.5 block text-sm font-medium text-foreground">
          Jabatan
        </label>
        <input
          id="position"
          name="position"
          type="text"
          required
          maxLength={200}
          defaultValue={initial?.position ?? ""}
          placeholder="Contoh: Ketua Harian"
          className={cn(INPUT_BASE, "border-border")}
          {...errorProps}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="group_name" className="mb-1.5 block text-sm font-medium text-foreground">
            Kelompok
          </label>
          <select
            id="group_name"
            name="group_name"
            required
            defaultValue={initial?.group_name ?? "pengurus"}
            className={cn(INPUT_BASE, "border-border")}
            {...errorProps}
          >
            {Array.from(TEAM_GROUP_SET).map((group) => (
              <option key={group} value={group}>
                {GROUP_LABELS[group] ?? group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort_order" className="mb-1.5 block text-sm font-medium text-foreground">
            Urutan
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            required
            min={0}
            pattern={SORT_ORDER_PATTERN.source}
            defaultValue={initial?.sort_order ?? "0"}
            placeholder="0"
            className={cn(INPUT_BASE, "border-border")}
            {...errorProps}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Angka terkecil tampil paling awal.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="mb-1.5 block text-sm font-medium text-foreground">
            Nama ({names.length}/{TEAM_MAX_NAMES})
          </p>
          <button
            type="button"
            onClick={handleAddName}
            disabled={names.length >= TEAM_MAX_NAMES}
            className="rounded-control border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Tambah Nama
          </button>
        </div>

        {names.map((name, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-1">
              <label
                htmlFor={`nama-${index}`}
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Nama {index + 1}
              </label>
              <input
                id={`nama-${index}`}
                name={`nama-${index}`}
                type="text"
                required
                maxLength={TEAM_NAME_MAX_LENGTH}
                defaultValue={name ?? ""}
                placeholder="Contoh: Ahmad Fauzi"
                className={cn(INPUT_BASE, "border-border")}
                {...errorProps}
              />
            </div>
            {names.length > 1 ? (
              <button
                type="button"
                onClick={() => handleRemoveName(index)}
                className="mt-7 rounded-control border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                aria-label={`Hapus nama ${index + 1}`}
              >
                Hapus
              </button>
            ) : null}
          </div>
        ))}

        <p className="text-xs text-muted-foreground">
          Minimal 1 nama, maksimal {TEAM_MAX_NAMES} nama untuk satu jabatan.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-control border border-border bg-muted/50 px-4 py-3">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          defaultChecked={initial?.is_active ?? true}
          className="mt-0.5 h-4 w-4 accent-primary-600"
        />
        <label htmlFor="is_active" className="cursor-pointer select-none">
          <span className="block text-sm font-medium text-foreground">Tampilkan di situs</span>
          <span className="block text-xs text-muted-foreground">
            Jika nonaktif, anggota tidak muncul di bagian &ldquo;Pengurus&rdquo;.
          </span>
        </label>
      </div>

      {state.error ? (
        <p id="team-form-error" role="alert" className="text-sm font-medium text-accent-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-5">
        <SubmitButton pendingLabel="Menyimpan...">{submitLabel}</SubmitButton>
        <LinkButton href="/admin/tentang" variant="ghost">
          Batal
        </LinkButton>
      </div>
    </form>
  );
}
