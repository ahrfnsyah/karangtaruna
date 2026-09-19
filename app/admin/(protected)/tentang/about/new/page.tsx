import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icons";

import { pageMetadata } from "@/lib/metadata";

import { TentangItemForm } from "@/components/admin/tentang-item-form";

import { createAboutItem } from "../../actions";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Tambah Item Tentang",
    description: "Tambah misi, nilai, atau peran baru Karang Taruna.",
    path: "/admin/tentang/about/new",
  }),
  robots: { index: false, follow: false },
};

export default function NewAboutItemPage() {
  return (
    <div>
      <LinkButton href="/admin/tentang" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Tentang</p>
      <h1 className="mt-2 text-h2 text-foreground">Tambah Item Tentang</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Item baru langsung tampil di bagian misi, nilai, atau peran halaman publik &ldquo;Tentang&rdquo;.
      </p>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <TentangItemForm action={createAboutItem} submitLabel="Simpan" />
      </Card>
    </div>
  );
}
