"use client";

import { useActionState } from "react";

import { cn } from "@/lib/utils";

import { LinkButton } from "@/components/ui/button";
import { SubmitButton } from "@/components/admin/submit-button";
import { SORT_ORDER_PATTERN, TEAM_GROUP_SET } from "@/lib/tentang-admin";

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
  name: string;
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

  const errorProps = state.error
    ? {
        "aria-invalid": true,
        "aria-describedby": "team-form-error",
      }
    : {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {id ? <input type="hidden" name="id" value={id} /> : null}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
          Nama
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={200}
          defaultValue={initial?.name ?? ""}
          placeholder="Contoh: Ahmad Fauzi"
          className={cn(INPUT_BASE, "border-border")}
          {...errorProps}
        />
      </div>

      <div>
        <label htmlFor="position" className="mb-1.5 block text-sm font-medium text-foreground">
          Posisi / Jabatan
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
