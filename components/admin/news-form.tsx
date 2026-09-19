"use client";

import { useActionState } from "react";

import { NEWS_CATEGORIES } from "@/lib/news-categories";
import { cn } from "@/lib/utils";

import { LinkButton } from "@/components/ui/button";
import { SubmitButton } from "./submit-button";

export type NewsFormValues = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  image_path: string;
  image_alt: string;
  is_featured: boolean;
  is_published: boolean;
};

export type NewsFormState = {
  error: string | null;
};

type NewsFormAction = (prevState: NewsFormState, formData: FormData) => Promise<NewsFormState>;

const INPUT_BASE =
  "w-full rounded-control border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground";

type NewsFormProps = {
  action: NewsFormAction;
  submitLabel: string;
  initial?: NewsFormValues;
  id?: string;
};

/*
 * Form tambah/edit berita (Client Component). Memakai useActionState agar
 * pesan error dari Server Action bisa ditampilkan inline.
 * `content` dikelola sebagai satu textarea: setiap baris menjadi satu paragraf
 * (string[]) agar kompatibel dengan render public /berita/[slug].
 */
export function NewsForm({ action, submitLabel, initial, id }: NewsFormProps) {
  const [state, formAction] = useActionState<NewsFormState, FormData>(action, { error: null });

  const hasError = state.error !== null;

  const fieldErrorProps = {
    "aria-invalid": hasError ? true : undefined,
    "aria-describedby": hasError ? "news-form-error" : undefined,
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
          maxLength={160}
          defaultValue={initial?.title ?? ""}
          placeholder="Judul berita"
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
            maxLength={180}
            defaultValue={initial?.slug ?? ""}
            placeholder="Otomatis dibuat dari judul jika kosong"
            className={cn(INPUT_BASE, "border-border")}
            {...fieldErrorProps}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Contoh: pembukaan-program-kerja-tahunan. Kosongkan untuk membuat otomatis dari judul.
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
            {NEWS_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="mb-1.5 block text-sm font-medium text-foreground">
          Ringkasan
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          maxLength={500}
          defaultValue={initial?.excerpt ?? ""}
          placeholder="Ringkasan singkat berita..."
          className={cn(INPUT_BASE, "border-border resize-y")}
          {...fieldErrorProps}
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1.5 block text-sm font-medium text-foreground">
          Isi Berita
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={8}
          defaultValue={initial?.content ?? ""}
          placeholder={"Paragraf pertama...\n\nParagraf kedua..."}
          className={cn(INPUT_BASE, "border-border resize-y")}
          {...fieldErrorProps}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Setiap baris kosong atau baru memisahkan paragraf. Satu baris = satu paragraf.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="author" className="mb-1.5 block text-sm font-medium text-foreground">
            Penulis <span className="font-normal text-muted-foreground">(opsional)</span>
          </label>
          <input
            id="author"
            name="author"
            type="text"
            maxLength={100}
            defaultValue={initial?.author ?? ""}
            placeholder="Contoh: Pengurus Karang Taruna RT 04 RW 08"
            className={cn(INPUT_BASE, "border-border")}
            {...fieldErrorProps}
          />
        </div>
        <div>
          <label htmlFor="published_at" className="mb-1.5 block text-sm font-medium text-foreground">
            Tanggal Terbit
          </label>
          <input
            id="published_at"
            name="published_at"
            type="date"
            required
            defaultValue={initial?.published_at ?? ""}
            className={cn(INPUT_BASE, "border-border")}
            {...fieldErrorProps}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Disimpan tengah malam WIB; halaman publik menampilkan tanggal saja.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="image_path" className="mb-1.5 block text-sm font-medium text-foreground">
            Path Gambar <span className="font-normal text-muted-foreground">(opsional)</span>
          </label>
          <input
            id="image_path"
            name="image_path"
            type="text"
            maxLength={500}
            defaultValue={initial?.image_path ?? ""}
            placeholder="/images/berita/nama-file.jpg"
            className={cn(INPUT_BASE, "border-border")}
            {...fieldErrorProps}
          />
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
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3 rounded-control border border-border bg-muted px-4 py-3 sm:w-1/2">
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
              Jika nonaktif, berita tidak muncul di halaman publik.
            </span>
          </label>
        </div>

        <div className="flex items-start gap-3 rounded-control border border-border bg-muted px-4 py-3 sm:w-1/2">
          <input
            id="is_featured"
            name="is_featured"
            type="checkbox"
            defaultChecked={initial?.is_featured ?? false}
            className="mt-0.5 h-4 w-4 rounded-control border-border accent-primary-600"
            {...fieldErrorProps}
          />
          <label htmlFor="is_featured" className="cursor-pointer select-none">
            <span className="block text-sm font-medium text-foreground">Berita Utama</span>
            <span className="block text-xs text-muted-foreground">
              Ditampilkan sebagai sorotan (hero) di halaman berita.
            </span>
          </label>
        </div>
      </div>

      {hasError ? (
        <p id="news-form-error" role="alert" className="text-sm font-medium text-accent-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-5">
        <SubmitButton pendingLabel="Menyimpan...">{submitLabel}</SubmitButton>
        <LinkButton href="/admin/berita" variant="ghost">
          Batal
        </LinkButton>
      </div>
    </form>
  );
}