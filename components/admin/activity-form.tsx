"use client";

import { useActionState, useState } from "react";

import Image from "next/image";

import { ACTIVITY_CATEGORIES } from "@/lib/activity-categories";
import { cn, resolveGambar } from "@/lib/utils";

import { LinkButton } from "@/components/ui/button";
import { UploadIcon } from "@/components/ui/icons";
import { SubmitButton } from "./submit-button";

export type ActivityFormValues = {
  title: string;
  slug: string;
  category: string;
  event_date: string;
  location: string;
  excerpt: string;
  description: string;
  status: string;
  image_path: string;
  image_alt: string;
  program_id: string;
  is_published: boolean;
};

export type ActivityFormState = {
  error: string | null;
};

type ProgramOption = {
  id: string;
  title: string;
};

type ActivityFormAction = (
  prevState: ActivityFormState,
  formData: FormData,
) => Promise<ActivityFormState>;

const INPUT_BASE =
  "w-full rounded-control border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground";

type ActivityFormProps = {
  action: ActivityFormAction;
  submitLabel: string;
  programs: ProgramOption[];
  initial?: ActivityFormValues;
  id?: string;
};

/*
 * Form tambah/edit kegiatan (Client Component). Memakai useActionState agar
 * pesan error dari Server Action bisa ditampilkan inline. Field mengikuti
 * kolom public.activities pada schema existing.
 */
export function ActivityForm({ action, submitLabel, programs, initial, id }: ActivityFormProps) {
  const [state, formAction] = useActionState<ActivityFormState, FormData>(action, {
    error: null,
  });
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const hasError = state.error !== null;
  const hasCurrentImage = typeof initial?.image_path === "string" && initial.image_path.trim() !== "";

  const fieldErrorProps = {
    "aria-invalid": hasError ? true : undefined,
    "aria-describedby": hasError ? "activity-form-error" : undefined,
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
          placeholder="Nama kegiatan"
          className={cn(INPUT_BASE, "border-border")}
          {...fieldErrorProps}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-foreground">
            Slug <span className="font-normal text-muted-foreground">(bagian URL)</span>
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            maxLength={160}
            defaultValue={initial?.slug ?? ""}
            placeholder="Otomatis dibuat dari judul jika kosong"
            className={cn(INPUT_BASE, "border-border")}
            {...fieldErrorProps}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Contoh: kerja-bakti-lingkungan. Kosongkan untuk membuat otomatis dari judul.
          </p>
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
            {ACTIVITY_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="event_date" className="mb-1.5 block text-sm font-medium text-foreground">
            Tanggal Kegiatan
          </label>
          <input
            id="event_date"
            name="event_date"
            type="date"
            required
            defaultValue={initial?.event_date ?? ""}
            className={cn(INPUT_BASE, "border-border")}
            {...fieldErrorProps}
          />
        </div>
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
            placeholder="Contoh: Tahunan, Berkala, Rutin"
            className={cn(INPUT_BASE, "border-border")}
            {...fieldErrorProps}
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-foreground">
          Lokasi <span className="font-normal text-muted-foreground">(opsional)</span>
        </label>
        <input
          id="location"
          name="location"
          type="text"
          maxLength={200}
          defaultValue={initial?.location ?? ""}
          placeholder="Contoh: Lapangan RT 04 RW 08"
          className={cn(INPUT_BASE, "border-border")}
          {...fieldErrorProps}
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
          placeholder="Rincian dan rangkaian kegiatan..."
          className={cn(INPUT_BASE, "border-border resize-y")}
          {...fieldErrorProps}
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="mb-1.5 block text-sm font-medium text-foreground">
          Ringkasan <span className="font-normal text-muted-foreground">(tampil di kartu)</span>
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          maxLength={500}
          defaultValue={initial?.excerpt ?? ""}
          placeholder="Ringkasan singkat kegiatan..."
          className={cn(INPUT_BASE, "border-border resize-y")}
          {...fieldErrorProps}
        />
      </div>

      <div className="rounded-control border border-border bg-muted p-4">
        <label htmlFor="image_file" className="mb-1.5 block text-sm font-medium text-foreground">
          Gambar Kegiatan <span className="font-normal text-muted-foreground">(opsional)</span>
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-control border border-border bg-background">
            <Image
              src={resolveGambar(initial?.image_path ?? null)}
              alt={hasCurrentImage ? "Pratinjau gambar saat ini" : "Belum ada gambar"}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <input
              id="image_file"
              name="image_file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name ?? "")}
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-control file:border-0 file:bg-primary-600 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white file:cursor-pointer file:hover:bg-primary-700"
              {...fieldErrorProps}
            />
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <UploadIcon className="h-3.5 w-3.5" />
              Hanya JPEG, PNG, WebP, atau AVIF — maksimal 5 MB.
            </p>
            {selectedFileName ? (
              <p className="mt-1 truncate text-xs font-medium text-accent-700">{selectedFileName}</p>
            ) : null}
          </div>
        </div>

        {id && hasCurrentImage ? (
          <div className="mt-4 flex items-start gap-3 rounded-control border border-border bg-background px-4 py-3">
            <input
              id="remove_image"
              name="remove_image"
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded-control border-border accent-accent-700"
            />
            <label htmlFor="remove_image" className="cursor-pointer select-none">
              <span className="block text-sm font-medium text-foreground">
                Hapus gambar saat ini
              </span>
              <span className="block text-xs text-muted-foreground">
                File di galeri media ikut dihapus dan kegiatan tidak menampilkan gambar.
              </span>
            </label>
          </div>
        ) : null}
      </div>

      <div>
        <label htmlFor="image_alt" className="mb-1.5 block text-sm font-medium text-foreground">
          Alt Gambar <span className="font-normal text-muted-foreground">(opsional)</span>
        </label>
        <input
          id="image_alt"
          name="image_alt"
          type="text"
          maxLength={300}
          defaultValue={initial?.image_alt ?? ""}
          placeholder="Deskripsi singkat gambar"
          className={cn(INPUT_BASE, "border-border")}
          {...fieldErrorProps}
        />
      </div>

      <div>
        <label htmlFor="program_id" className="mb-1.5 block text-sm font-medium text-foreground">
          Program Terkait <span className="font-normal text-muted-foreground">(opsional)</span>
        </label>
        <select
          id="program_id"
          name="program_id"
          defaultValue={initial?.program_id ?? ""}
          className={cn(INPUT_BASE, "border-border")}
          {...fieldErrorProps}
        >
          <option value="">Tidak terhubung ke program</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-start gap-3 rounded-control border border-border bg-muted px-4 py-3">
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          defaultChecked={initial?.is_published ?? true}
          className="mt-0.5 h-4 w-4 rounded-control border-border accent-primary-600"
          {...fieldErrorProps}
        />
        <label htmlFor="is_published" className="cursor-pointer select-none">
          <span className="block text-sm font-medium text-foreground">Tayangkan di situs</span>
          <span className="block text-xs text-muted-foreground">
            Jika nonaktif, kegiatan tidak muncul di halaman publik &ldquo;Kegiatan&rdquo;.
          </span>
        </label>
      </div>

      {hasError ? (
        <p id="activity-form-error" role="alert" className="text-sm font-medium text-accent-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-5">
        <SubmitButton pendingLabel="Menyimpan...">{submitLabel}</SubmitButton>
        <LinkButton href="/admin/kegiatan" variant="ghost">
          Batal
        </LinkButton>
      </div>
    </form>
  );
}