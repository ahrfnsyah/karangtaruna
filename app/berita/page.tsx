import { FeaturedNews } from "@/components/berita/featured-news";
import { NewsList } from "@/components/berita/news-list";
import { Container } from "@/components/ui/container";
import { NewspaperIcon } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import type { BeritaItem } from "@/lib/types";

export const metadata = pageMetadata({
  title: "Berita",
  description:
    "Informasi, cerita kegiatan, dan kabar terbaru dari Karang Taruna RT 04 RW 08 Srengseng Sawah.",
  path: "/berita",
});

/*
 * Supabase Server Client berbasis cookie => halaman tidak bisa di-prerender
 * statis. force-dynamic membuat data selalu dirender server-side dan segar,
 * konsisten dengan /program-kerja dan /kegiatan.
 */
export const dynamic = "force-dynamic";

const NEWS_SELECT =
  "id, slug, title, excerpt, content, category, author, published_at, image_path, image_alt, is_featured, is_published";

async function getBerita(): Promise<{
  items: BeritaItem[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select(NEWS_SELECT)
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil berita dari Supabase:", error.message);
      return { items: [], error: "Berita sementara tidak dapat ditampilkan." };
    }

    return {
      items: (data ?? []) as BeritaItem[],
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengambil berita dari Supabase:", message);
    return { items: [], error: "Berita sementara tidak dapat ditampilkan." };
  }
}

export default async function BeritaPage() {
  const { items, error } = await getBerita();

  if (error) {
    return (
      <>
        <PageHero
          eyebrow="Berita"
          title="Kabar Terbaru Karang Taruna"
          description="Informasi, cerita kegiatan, dan kabar terbaru dari Karang Taruna RT 04 RW 08."
        />
        <Section>
          <Container>
            <div className="rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
              <NewspaperIcon className="mx-auto h-10 w-10 text-slate-500" />
              <h3 className="mt-4 text-h4 text-foreground">Berita tidak dapat ditampilkan</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Terjadi kendala saat mengambil data. Silakan coba kembali beberapa
                saat lagi.
              </p>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  const featuredNews = items.filter((item) => item.is_featured);

  return (
    <>
      <PageHero
        eyebrow="Berita"
        title="Kabar Terbaru Karang Taruna"
        description="Informasi, cerita kegiatan, dan kabar terbaru dari Karang Taruna RT 04 RW 08."
      />
      {featuredNews.length > 0 ? (
        <Section>
          <Container>
            <h2 className="sr-only">Berita Utama</h2>
            <FeaturedNews news={featuredNews} />
          </Container>
        </Section>
      ) : null}
      <NewsList initialNews={items} />
    </>
  );
}