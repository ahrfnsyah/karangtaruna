import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CalendarIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import type { BeritaItem } from "@/lib/types";
import { formatTanggalWIB, formatTanggalWIBISO, resolveGambar } from "@/lib/utils";

type BeritaDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const NEWS_SELECT =
  "id, slug, title, excerpt, content, category, author, published_at, image_path, image_alt, is_featured, is_published";

/*
 * Data berita kini berasal dari Supabase dan bisa berubah, jadi tidak ada
 * generateStaticParams. Server Client berbasis cookie juga tidak memungkinkan
 * prerender statis => dynamic rendering (konsisten dengan /program-kerja).
 */
export const dynamic = "force-dynamic";

async function getBeritaBySlug(slug: string): Promise<{
  item: BeritaItem | null;
  error: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select(NEWS_SELECT)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error("Gagal mengambil detail berita dari Supabase:", error.message);
      return { item: null, error: true };
    }

    return {
      item: (data as BeritaItem | null) ?? null,
      error: false,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengambil detail berita dari Supabase:", message);
    return { item: null, error: true };
  }
}

export async function generateMetadata({
  params,
}: BeritaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { item } = await getBeritaBySlug(slug);

  if (!item) {
    return {
      title: "Berita Tidak Ditemukan",
      description: "Berita yang Anda cari tidak tersedia atau telah dihapus.",
    };
  }

  return pageMetadata({
    title: item.title,
    description: item.excerpt,
    path: `/berita/${item.slug}`,
    publishedTime: item.published_at,
    authors: [item.author],
  });
}

export default async function BeritaDetailPage({ params }: BeritaDetailPageProps) {
  const { slug } = await params;
  const { item, error } = await getBeritaBySlug(slug);

  // Gagal query Supabase: biarkan error boundary menampilkan pesan yang ramah,
  // BUKAN 404, karena ini bukan berarti berita tidak ditemukan.
  if (error) {
    throw new Error("Terjadi kendala saat memuat data berita.");
  }

  if (!item) {
    notFound();
  }

  const gambar = resolveGambar(item.image_path);

  return (
    <article>
      <Section>
        <Container>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/berita" className="transition-colors hover:text-foreground">
                  Berita
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="truncate font-medium text-foreground">
                {item.title}
              </li>
            </ol>
          </nav>

          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <Badge variant="primary">{item.category}</Badge>
              <time
                dateTime={formatTanggalWIBISO(item.published_at)}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <CalendarIcon className="h-4 w-4" />
                {formatTanggalWIB(item.published_at)}
              </time>
            </div>
            <h1 className="mt-4 max-w-3xl text-h1 text-foreground">{item.title}</h1>
            <p className="mt-3 text-sm text-muted-foreground">Oleh {item.author}</p>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {item.excerpt}
            </p>
          </header>

          <figure className="mt-8 overflow-hidden rounded-card shadow-card">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={gambar}
                alt={item.image_alt}
                fill
                priority
                sizes="(min-width: 1024px) 75vw, 100vw"
                className="object-cover"
              />
            </div>
          </figure>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2" aria-label="Isi berita">
              <h2 className="text-h3 text-foreground">Isi Berita</h2>
              <div className="mt-4 max-w-prose space-y-5">
                {item.content.map((paragraph, index) => (
                  <p key={index} className="leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <aside aria-label="Navigasi berita">
              <div className="rounded-card border border-border bg-muted p-6 lg:sticky lg:top-24">
                <h2 className="text-h4 text-foreground">Navigasi</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Jelajahi kabar lainnya atau lihat dokumentasi kegiatan
                  Karang Taruna.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <LinkButton href="/berita" variant="outline" size="md">
                    Kembali ke Berita
                  </LinkButton>
                  <LinkButton href="/kegiatan" variant="accent" size="md">
                    Lihat Kegiatan
                  </LinkButton>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </article>
  );
}