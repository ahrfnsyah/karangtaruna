"use client";

import { useActionState, useState } from "react";

import Image from "next/image";

import { GALLERY_CATEGORIES } from "@/lib/gallery-categories";
import { cn, resolveGambar } from "@/lib/utils";

import { LinkButton } from "@/components/ui/button";
import { UploadIcon } from "@/components/ui/icons";
import { SubmitButton } from "./submit-button";

export type GalleryFormValues = {
  title: string;
  category: string;
  description: string;
  image_path: string | null;
  image_alt: string;
  taken_at: string;
  sort_order: string;
  is_published: boolean;
};

export type GalleryFormState = {
  error: string | null;
};

type GalleryFormAction = (
  prevState: GalleryFormState,
  formData: FormData,
) => Promise<GalleryFormState>;

const INPUT_BASE =
  "w-full rounded-control border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground";

type GalleryFormProps = {
  action: GalleryFormAction;
  submitLabel: string;
  initial?: GalleryFormValues;
  id?: string;
};

/*
 * Form tambah/edit galeri (Client Component). Memakai useActionState agar
 * pesan error Server Action tampil inline. File gambar dikirim apa adanya
 * via input name="image_file" (Server Action menerimanya sebagai File);
 * item tanpa gambar tetap didukung karena image_path di schema nullable.
 */
export function GalleryForm({ action, submitLabel, initial, id }: GalleryFormProps) {
  const [state, formAction] = useActionState<GalleryFormState, FormData>(action, { error: null });
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const hasError = state.error !== null;
  const hasCurrentImage = typeof initial?.image_path === "string" && initial.image_path.trim() !== "";

  const fieldErrorProps = {
    "aria-invalid": hasError ? true : undefined,
    "aria-describedby": hasError ? "gallery-form-error" : undefined,
  };

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {id ? <input type="hidden" name="id" value={id} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
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
            placeholder="Contoh: Suasana Saat Kerja Bakti"
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
            {GALLERY_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-foreground">
          Deskripsi <span className="font-normal text-muted-foreground">(opsional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={2000}
          defaultValue={initial?.description ?? ""}
          placeholder="Cerita singkat di balik foto..."
          className={cn(INPUT_BASE, "border-border resize-y")}
          {...fieldErrorProps}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="taken_at" className="mb-1.5 block text-sm font-medium text-foreground">
            Tanggal Pengambilan <span className="font-normal text-muted-foreground">(opsional)</span>
          </label>
          <input
            id="taken_at"
            name="taken_at"
            type="date"
            defaultValue={initial?.taken_at ?? ""}
            className={cn(INPUT_BASE, "border-border")}
            {...fieldErrorProps}
          />
        </div>
        <div>
          <label htmlFor="sort_order" className="mb-1.5 block text-sm font-medium text-foreground">
            Urutan Tampil
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            required
            step={1}
            defaultValue={initial?.sort_order ?? "0"}
            className={cn(INPUT_BASE, "border-border")}
            {...fieldErrorProps}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Angka terkecil tampil paling awal di halaman publik.
          </p>
        </div>
      </div>

      <div className="rounded-control border border-border bg-muted p-4">
        <label htmlFor="image_file" className="mb-1.5 block text-sm font-medium text-foreground">
          Foto <span className="font-normal text-muted-foreground">(opsional)</span>
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-control border border-border bg-background">
            <Image
              src={resolveGambar(initial?.image_path ?? null)}
              alt={hasCurrentImage ? "Pratinjau foto saat ini" : "Belum ada foto"}
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
                Hapus foto saat ini
              </span>
              <span className="block text-xs text-muted-foreground">
                File di galeri media ikut dihapus dan item tidak menampilkan foto.
              </span>
            </label>
          </div>
        ) : null}
      </div>

      <div>
        <label htmlFor="image_alt" className="mb-1.5 block text-sm font-medium text-foreground">
          Alt Foto <span className="font-normal text-muted-foreground">(opsional)</span>
        </label>
        <input
          id="image_alt"
          name="image_alt"
          type="text"
          maxLength={300}
          defaultValue={initial?.image_alt ?? ""}
          placeholder="Deskripsi singkat untuk foto"
          className={cn(INPUT_BASE, "border-border")}
          {...fieldErrorProps}
        />
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
            Jika nonaktif, foto tidak muncul di halaman publik &ldquo;Galeri&rdquo;.
          </span>
        </label>
      </div>

      {hasError ? (
        <p id="gallery-form-error" role="alert" className="text-sm font-medium text-accent-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-5">
        <SubmitButton pendingLabel="Menyimpan...">{submitLabel}</SubmitButton>
        <LinkButton href="/admin/galeri" variant="ghost">
          Batal
        </LinkButton>
      </div>
    </form>
  );
}