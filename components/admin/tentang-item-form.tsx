"use client";

import { useActionState } from "react";

import { cn } from "@/lib/utils";

import { LinkButton } from "@/components/ui/button";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  ABOUT_ICON_SET,
  ABOUT_SECTION_SET,
  SORT_ORDER_PATTERN,
} from "@/lib/tentang-admin";

const INPUT_BASE =
  "w-full rounded-control border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground";

export type TentangFormState = {
  error: string | null;
};

type TentangFormAction = (
  _prevState: TentangFormState,
  formData: FormData,
) => Promise<TentangFormState>;

export type TentangItemInitial = {
  section: string;
  title: string;
  description: string;
  icon: string;
  sort_order: string;
  is_published: boolean;
};

type TentangItemFormProps = {
  action: TentangFormAction;
  submitLabel: string;
  initial?: TentangItemInitial;
  id?: string;
};

const SECTION_LABELS: Record<string, string> = {
  mission: "Misi",
  value: "Nilai",
  role: "Peran",
};

function iconLabel(icon: string): string {
  const words = icon.split("-");
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function TentangItemForm({ action, submitLabel, initial, id }: TentangItemFormProps) {
  const [state, formAction] = useActionState<TentangFormState, FormData>(action, {
    error: null,
  });

  const errorProps = state.error
    ? {
        "aria-invalid": true,
        "aria-describedby": "tentang-form-error",
      }
    : {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {id ? <input type="hidden" name="id" value={id} /> : null}

      <div>
        <label htmlFor="section" className="mb-1.5 block text-sm font-medium text-foreground">
          Bagian
        </label>
        <select
          id="section"
          name="section"
          required
          defaultValue={initial?.section ?? ""}
          className={cn(INPUT_BASE, "border-border")}
          {...errorProps}
        >
          <option value="" disabled>
            Pilih bagian...
          </option>
          {Array.from(ABOUT_SECTION_SET).map((section) => (
            <option key={section} value={section}>
              {SECTION_LABELS[section] ?? section}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-foreground">
          Judul
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={initial?.title ?? ""}
          placeholder="Contoh: Misi kami adalah..."
          className={cn(INPUT_BASE, "border-border")}
          {...errorProps}
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-foreground">
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={5000}
          defaultValue={initial?.description ?? ""}
          placeholder="Uraian singkat untuk bagian ini..."
          className={cn(INPUT_BASE, "border-border resize-y")}
          {...errorProps}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="icon" className="mb-1.5 block text-sm font-medium text-foreground">
            Ikon
          </label>
          <select
            id="icon"
            name="icon"
            required
            defaultValue={initial?.icon ?? "users"}
            className={cn(INPUT_BASE, "border-border")}
            {...errorProps}
          >
            {Array.from(ABOUT_ICON_SET).map((icon) => (
              <option key={icon} value={icon}>
                {iconLabel(icon)}
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
            Angka terkecil tampil paling awal, gunakan angka tanpa desimal.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-border border border-border bg-muted/50 px-4 py-3">
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          defaultChecked={initial?.is_published ?? true}
          className="mt-0.5 h-4 w-4 accent-primary-600"
        />
        <label htmlFor="is_published" className="cursor-pointer select-none">
          <span className="block text-sm font-medium text-foreground">Tayangkan di situs</span>
          <span className="block text-xs text-muted-foreground">
            Jika nonaktif, item tidak muncul di halaman publik &ldquo;Tentang&rdquo;.
          </span>
        </label>
      </div>

      {state.error ? (
        <p id="tentang-form-error" role="alert" className="text-sm font-medium text-accent-700">
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
