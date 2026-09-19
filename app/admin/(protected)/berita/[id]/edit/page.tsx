import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon, NewspaperIcon } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import { formatTanggalWIBISO } from "@/lib/utils";

import { NewsForm } from "@/components/admin/news-form";

import { updateNewsItem } from "../../actions";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Edit Berita",
    description: "Perbarui berita Karang Taruna RT 04 RW 08 Srengseng Sawah.",
    path: "/admin/berita/edit",
  }),
  robots: { index: false, follow: false },
};

type EditNewsParams = {
  params: Promise<{ id: string }>;
};

export default async function EditNewsPage({ params }: EditNewsParams) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: item, error } = await supabase
    .from("news")
    .select(
      "id, slug, title, category, excerpt, content, author, published_at, image_path, image_alt, is_featured, is_published",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Gagal memuat berita untuk edit:", error.message);
  }

  if (!item) {
    return (
      <div>
        <LinkButton href="/admin/berita" variant="ghost" size="sm" className="-ml-3">
          <ArrowLeftIcon className="h-4 w-4" />
          Kembali
        </LinkButton>

        <div className="mt-8 rounded-card border border-dashed border-slate-300 bg-background px-6 py-12 text-center">
          <NewspaperIcon className="mx-auto h-8 w-8 text-slate-500" />
          <h1 className="mt-4 text-h4 text-foreground">Berita tidak ditemukan</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Berita yang ingin diedit tidak ada atau sudah dihapus.
          </p>
          <LinkButton href="/admin/berita" variant="primary" className="mt-5">
            Kembali ke Daftar Berita
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <LinkButton href="/admin/berita" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Berita</p>
      <h1 className="mt-2 text-h2 text-foreground">Edit Berita</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Perubahan yang disimpan langsung tercermin di halaman publik, termasuk URL jika slug
        diubah.
      </p>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <NewsForm
          id={item.id}
          action={updateNewsItem}
          submitLabel="Simpan Perubahan"
          initial={{
            title: item.title,
            slug: item.slug,
            category: item.category,
            excerpt: item.excerpt,
            content: (item.content ?? []).join("\n\n"),
            author: item.author ?? "",
            published_at: formatTanggalWIBISO(item.published_at),
            image_path: item.image_path ?? "",
            image_alt: item.image_alt ?? "",
            is_featured: item.is_featured,
            is_published: item.is_published,
          }}
        />
      </Card>
    </div>
  );
}