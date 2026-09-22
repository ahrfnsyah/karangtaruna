import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { TentangSettingsForm } from "@/components/admin/tentang-settings-form";

import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

import { updateSiteSettings } from "../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Ubah Pengaturan Tentang",
    description:
      "Perbarui visi, paragraf, foto hero, dan foto tentang halaman Karang Taruna.",
    path: "/admin/tentang/settings",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditTentangSettingsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select(
      "vision, about_paragraphs, hero_description, hero_image_path, hero_image_alt, about_image_path, about_image_alt",
    )
    .eq("id", 1)
    .maybeSingle();

  const settings = (data ?? {
    vision: "",
    about_paragraphs: [],
    hero_description: "",
    hero_image_path: null,
    hero_image_alt: "",
    about_image_path: null,
    about_image_alt: "",
  }) as {
    vision: string | null;
    about_paragraphs: string[] | null;
    hero_description: string | null;
    hero_image_path: string | null;
    hero_image_alt: string | null;
    about_image_path: string | null;
    about_image_alt: string | null;
  };

  return (
    <div>
      <LinkButton
        href="/admin/tentang"
        variant="ghost"
        size="sm"
        className="-ml-3"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
        Tentang
      </p>

      <h1 className="mt-2 text-h2 text-foreground">
        Pengaturan Tentang
      </h1>

      <p className="mt-2 max-w-2xl text-muted-foreground">
        Perbarui visi, paragraf pembuka, foto hero, dan foto tentang yang
        ditampilkan pada halaman publik.
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-5 text-sm font-medium text-accent-700"
        >
          Pengaturan tidak dapat dimuat: {error.message}
        </p>
      ) : null}

      <Card className="mx-auto mt-6 max-w-2xl p-6 md:p-8">
        <TentangSettingsForm
          action={updateSiteSettings}
          submitLabel="Simpan Pengaturan"
          initial={{
            vision: settings.vision ?? "",
            about_paragraphs: settings.about_paragraphs ?? [],
            hero_description: settings.hero_description ?? "",
            hero_image_path: settings.hero_image_path ?? null,
            hero_image_alt: settings.hero_image_alt ?? "",
            about_image_path: settings.about_image_path ?? null,
            about_image_alt: settings.about_image_alt ?? "",
          }}
        />
      </Card>
    </div>
  );
}