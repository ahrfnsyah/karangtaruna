import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";

import { NewsForm } from "@/components/admin/news-form";

import { createNewsItem } from "../actions";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Tambah Berita",
    description: "Tambah berita baru Karang Taruna RT 04 RW 08 Srengseng Sawah.",
    path: "/admin/berita/new",
  }),
  robots: { index: false, follow: false },
};

export default function NewNewsPage() {
  return (
    <div>
      <LinkButton href="/admin/berita" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Berita</p>
      <h1 className="mt-2 text-h2 text-foreground">Tambah Berita</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Berita yang ditayangkan langsung muncul di halaman publik &ldquo;Berita&rdquo;.
      </p>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <NewsForm action={createNewsItem} submitLabel="Simpan Berita" />
      </Card>
    </div>
  );
}