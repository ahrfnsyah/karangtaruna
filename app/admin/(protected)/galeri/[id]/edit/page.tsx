import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon, CameraIcon } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

import { GalleryForm } from "@/components/admin/gallery-form";

import { updateGalleryItem } from "../../actions";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Edit Foto",
    description: "Perbarui foto galeri Karang Taruna RT 04 RW 08 Srengseng Sawah.",
    path: "/admin/galeri/edit",
  }),
  robots: { index: false, follow: false },
};

type EditGaleriParams = {
  params: Promise<{ id: string }>;
};

export default async function EditGaleriPage({ params }: EditGaleriParams) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: item, error } = await supabase
    .from("gallery_items")
    .select("id, title, category, description, image_path, image_alt, taken_at, sort_order, is_published")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Gagal memuat galeri untuk edit:", error.message);
  }

  if (!item) {
    return (
      <div>
        <LinkButton href="/admin/galeri" variant="ghost" size="sm" className="-ml-3">
          <ArrowLeftIcon className="h-4 w-4" />
          Kembali
        </LinkButton>

        <div className="mt-8 rounded-card border border-dashed border-slate-300 bg-background px-6 py-12 text-center">
          <CameraIcon className="mx-auto h-8 w-8 text-slate-500" />
          <h1 className="mt-4 text-h4 text-foreground">Foto tidak ditemukan</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Item galeri yang ingin diedit tidak ada atau sudah dihapus.
          </p>
          <LinkButton href="/admin/galeri" variant="primary" className="mt-5">
            Kembali ke Daftar Galeri
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <LinkButton href="/admin/galeri" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Galeri</p>
      <h1 className="mt-2 text-h2 text-foreground">Edit Foto</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Perubahan yang disimpan langsung tercermin di halaman publik.
      </p>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <GalleryForm
          id={item.id}
          action={updateGalleryItem}
          submitLabel="Simpan Perubahan"
          initial={{
            title: item.title,
            category: item.category,
            description: item.description ?? "",
            image_path: item.image_path,
            image_alt: item.image_alt ?? "",
            taken_at: item.taken_at ?? "",
            sort_order: String(item.sort_order ?? 0),
            is_published: item.is_published,
          }}
        />
      </Card>
    </div>
  );
}