import { ActivityList } from "@/components/kegiatan/activity-list";
import { Cta } from "@/components/kegiatan/cta";
import { Container } from "@/components/ui/container";
import { CameraIcon } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import type { KegiatanItem } from "@/lib/types";

export const metadata = pageMetadata({
  title: "Kegiatan",
  description:
    "Dokumentasi dan informasi kegiatan Karang Taruna RT 04 RW 08 Srengseng Sawah: kepemudaan, sosial, olahraga, lingkungan, dan kreativitas.",
  path: "/kegiatan",
});

/*
 * Supabase Server Client berbasis cookie => halaman tidak bisa di-prerender
 * statis. force-dynamic membuat data selalu dirender server-side dan segar,
 * konsisten dengan /program-kerja. Filter kategori tetap ditangani client-side
 * oleh ActivityList terhadap data yang dikirim sebagai props.
 */
export const dynamic = "force-dynamic";

async function getKegiatan(): Promise<{
  items: KegiatanItem[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("activities")
      .select("slug, title, category, event_date, location, excerpt, image_path, image_alt")
      .eq("is_published", true)
      .order("event_date", { ascending: false });

    if (error) {
      console.error("Gagal mengambil kegiatan dari Supabase:", error.message);
      return {
        items: [],
        error: "Kegiatan sementara tidak dapat ditampilkan.",
      };
    }

    return {
      items: (data ?? []) as KegiatanItem[],
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengambil kegiatan dari Supabase:", message);
    return {
      items: [],
      error: "Kegiatan sementara tidak dapat ditampilkan.",
    };
  }
}

export default async function KegiatanPage() {
  const { items, error } = await getKegiatan();

  if (error) {
    return (
      <>
        <PageHero
          eyebrow="Kegiatan"
          title="Kegiatan Karang Taruna"
          description="Dokumentasi kegiatan kepemudaan dan kemasyarakatan yang kami lakukan bersama warga."
        />
        <Section>
          <Container>
            <div className="mt-6 rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
              <CameraIcon className="mx-auto h-10 w-10 text-slate-500" />
              <h3 className="mt-4 text-h4 text-foreground">Kegiatan tidak dapat ditampilkan</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Terjadi kendala saat mengambil data. Silakan coba kembali beberapa
                saat lagi.
              </p>
            </div>
          </Container>
        </Section>
        <Cta />
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Kegiatan"
        title="Kegiatan Karang Taruna"
        description="Dokumentasi kegiatan kepemudaan dan kemasyarakatan yang kami lakukan bersama warga."
      />
      <ActivityList initialActivities={items} />
      <Cta />
    </>
  );
}