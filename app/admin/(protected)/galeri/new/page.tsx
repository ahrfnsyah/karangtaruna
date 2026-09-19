import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";

import { GalleryForm } from "@/components/admin/gallery-form";

import { createGalleryItem } from "../actions";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Tambah Foto",
    description: "Tambah foto galeri baru Karang Taruna RT 04 RW 08 Srengseng Sawah.",
    path: "/admin/galeri/new",
  }),
  robots: { index: false, follow: false },
};

export default function NewGaleriPage() {
  return (
    <div>
      <LinkButton href="/admin/galeri" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Galeri</p>
      <h1 className="mt-2 text-h2 text-foreground">Tambah Foto</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Foto yang ditayangkan langsung muncul di halaman publik &ldquo;Galeri&rdquo;.
      </p>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <GalleryForm action={createGalleryItem} submitLabel="Simpan Foto" />
      </Card>
    </div>
  );
}