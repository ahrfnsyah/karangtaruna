import { Cta } from "@/components/galeri/cta";
import { GalleryGrid } from "@/components/galeri/gallery-grid";
import { Container } from "@/components/ui/container";
import { CameraIcon } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/lib/types";

export const metadata = pageMetadata({
  title: "Galeri",
  description:
    "Dokumentasi visual kegiatan dan kebersamaan Karang Taruna RT 04 RW 08 Srengseng Sawah.",
  path: "/galeri",
});

/*
 * Supabase Server Client berbasis cookie => halaman tidak bisa di-prerender
 * statis. force-dynamic membuat data selalu dirender server-side dan segar,
 * konsisten dengan /program-kerja, /kegiatan, dan /berita.
 */
export const dynamic = "force-dynamic";

async function getGaleri(): Promise<{
  items: GalleryItem[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("id, title, category, image_path, image_alt, taken_at, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Gagal mengambil galeri dari Supabase:", error.message);
      return { items: [], error: "Dokumentasi galeri sementara tidak dapat ditampilkan." };
    }

    return {
      items: (data ?? []) as GalleryItem[],
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengambil galeri dari Supabase:", message);
    return { items: [], error: "Dokumentasi galeri sementara tidak dapat ditampilkan." };
  }
}

export default async function GaleriPage() {
  const { items, error } = await getGaleri();

  return (
    <>
      <PageHero
        eyebrow="Galeri"
        title="Dokumentasi Kegiatan"
        description="Berbagai momen kegiatan dan kebersamaan Karang Taruna RT 04 RW 08."
      />
      {error ? (
        <Section>
          <Container>
            <div className="rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
              <CameraIcon className="mx-auto h-10 w-10 text-slate-500" />
              <h3 className="mt-4 text-h4 text-foreground">
                Dokumentasi tidak dapat ditampilkan
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Terjadi kendala saat mengambil data. Silakan coba kembali
                beberapa saat lagi.
              </p>
            </div>
          </Container>
        </Section>
      ) : (
        <GalleryGrid initialItems={items} />
      )}
      <Cta />
    </>
  );
}