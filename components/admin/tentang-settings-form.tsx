
"use client";

import Image from "next/image";
import { useActionState } from "react";

import { SubmitButton } from "@/components/admin/submit-button";
import { LinkButton } from "@/components/ui/button";

import { cn } from "@/lib/utils";

const INPUT_BASE =
  "w-full rounded-control border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground";

export type SettingsFormState = {
  error: string | null;
};

type SettingsFormAction = (
  prevState: SettingsFormState,
  formData: FormData,
) => Promise<SettingsFormState>;

export type SettingsInitial = {
  vision: string;
  about_paragraphs: string[];
  hero_description: string;
  hero_image_path: string | null;
  hero_image_alt: string;
  about_image_path: string | null;
  about_image_alt: string;
};

type SettingsFormProps = {
  action: SettingsFormAction;
  submitLabel: string;
  initial: SettingsInitial;
};

export function TentangSettingsForm({
  action,
  submitLabel,
  initial,
}: SettingsFormProps) {
  const [state, formAction] = useActionState<SettingsFormState, FormData>(
    action,
    {
      error: null,
    },
  );

  const errorProps = state.error
    ? {
        "aria-invalid": true,
        "aria-describedby": "settings-form-error",
      }
    : {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* Visi */}
      <div>
        <label
          htmlFor="vision"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Visi
        </label>

        <textarea
          id="vision"
          name="vision"
          rows={3}
          maxLength={2000}
          defaultValue={initial.vision}
          placeholder="Visi Karang Taruna..."
          className={cn(
            INPUT_BASE,
            state.error && "border-accent-700",
          )}
          {...errorProps}
        />
      </div>

      {/* Paragraf Pembuka */}
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
          className={cn(
            INPUT_BASE,
            state.error && "border-accent-700",
          )}
          {...errorProps}
        />

        <p className="mt-1.5 text-xs text-muted-foreground">
          Setiap baris kosong memisahkan satu paragraf.
        </p>
      </div>

      {/* Deskripsi Hero */}
      <div className="border-t border-border pt-5">
        <label
          htmlFor="hero_description"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Deskripsi Hero Beranda
        </label>

        <textarea
          id="hero_description"
          name="hero_description"
          rows={4}
          maxLength={1000}
          defaultValue={initial.hero_description}
          placeholder="Wadah generasi muda untuk tumbuh bersama..."
          className={cn(
            INPUT_BASE,
            state.error && "border-accent-700",
          )}
          {...errorProps}
        />

        <p className="mt-1.5 text-xs text-muted-foreground">
          Teks ini akan ditampilkan pada bagian Hero halaman Beranda.
        </p>
      </div>

      {/* Foto Hero */}
      <div className="space-y-3 border-t border-border pt-5">
        <div>
          <label
            htmlFor="hero_image_file"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Foto Hero Beranda
          </label>

          {initial.hero_image_path ? (
            <div className="mb-4 overflow-hidden rounded-card border border-border">
              <div className="relative aspect-16/7 w-full">
                <Image
                  src={initial.hero_image_path}
                  alt={initial.hero_image_alt || "Foto Hero Beranda"}
                  fill
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="mb-4 rounded-card border border-dashed border-border bg-muted px-5 py-8 text-center text-sm text-muted-foreground">
              Belum ada foto hero. Beranda akan menggunakan placeholder.
            </div>
          )}

          <input
            id="hero_image_file"
            name="hero_image_file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="block w-full rounded-control border border-border bg-background px-3 py-2 text-sm"
          />

          <p className="mt-1.5 text-xs text-muted-foreground">
            JPEG, PNG, WebP, atau AVIF. Maksimal 5 MB.
          </p>
        </div>

        {/* Alt Text */}
        <div>
          <label
            htmlFor="hero_image_alt"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Alt Text Foto Hero
          </label>

          <input
            id="hero_image_alt"
            name="hero_image_alt"
            type="text"
            maxLength={300}
            defaultValue={initial.hero_image_alt}
            placeholder="Dokumentasi kegiatan Karang Taruna"
            className={cn(
              INPUT_BASE,
              state.error && "border-accent-700",
            )}
          />
        </div>

        {/* Hapus Foto */}
        {initial.hero_image_path ? (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="remove_hero_image"
              className="h-4 w-4"
            />
            Hapus foto hero
          </label>
        ) : null}
      </div>

      {/* Foto Tentang */}
      <div className="space-y-3 border-t border-border pt-5">
        <div>
          <label
            htmlFor="about_image_file"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Foto Tentang Beranda
          </label>

          {initial.about_image_path ? (
            <div className="mb-4 overflow-hidden rounded-card border border-border">
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={initial.about_image_path}
                  alt={initial.about_image_alt || "Foto Tentang Beranda"}
                  fill
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="mb-4 rounded-card border border-dashed border-border bg-muted px-5 py-8 text-center text-sm text-muted-foreground">
              Belum ada foto tentang. Beranda akan menggunakan placeholder.
            </div>
          )}

          <input
            id="about_image_file"
            name="about_image_file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="block w-full rounded-control border border-border bg-background px-3 py-2 text-sm"
          />

          <p className="mt-1.5 text-xs text-muted-foreground">
            JPEG, PNG, WebP, atau AVIF. Maksimal 5 MB.
          </p>
        </div>

        {/* Alt Text */}
        <div>
          <label
            htmlFor="about_image_alt"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Alt Text Foto Tentang
          </label>

          <input
            id="about_image_alt"
            name="about_image_alt"
            type="text"
            maxLength={300}
            defaultValue={initial.about_image_alt}
            placeholder="Kebersamaan anggota Karang Taruna dalam kegiatan"
            className={cn(
              INPUT_BASE,
              state.error && "border-accent-700",
            )}
          />
        </div>

        {/* Hapus Foto */}
        {initial.about_image_path ? (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="remove_about_image"
              className="h-4 w-4"
            />
            Hapus foto tentang
          </label>
        ) : null}
      </div>

      {/* Error */}
      {state.error ? (
        <p
          id="settings-form-error"
          role="alert"
          className="text-sm font-medium text-accent-700"
        >
          {state.error}
        </p>
      ) : null}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <SubmitButton>{submitLabel}</SubmitButton>

        <LinkButton href="/admin/tentang" variant="ghost" size="sm">
          Batal
        </LinkButton>
      </div>
    </form>
  );
}

