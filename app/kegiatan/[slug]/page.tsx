import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CalendarIcon, MapPinIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import type { KegiatanItem } from "@/lib/types";
import { formatTanggal, resolveGambar } from "@/lib/utils";

type KegiatanDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const DETAIL_SELECT =
  "slug, title, category, event_date, location, excerpt, description, status, image_path, image_alt";

/*
 * Data kegiatan kini berasal dari Supabase dan bisa berubah, jadi tidak ada
 * generateStaticParams. Server Client berbasis cookie juga tidak memungkinkan
 * prerender statis => dynamic rendering (konsisten dengan /program-kerja).
 */
export const dynamic = "force-dynamic";

async function getKegiatanBySlug(slug: string): Promise<{
  activity: KegiatanItem | null;
  error: boolean;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("activities")
      .select(DETAIL_SELECT)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error("Gagal mengambil detail kegiatan dari Supabase:", error.message);
      return { activity: null, error: true };
    }

    return {
      activity: (data as KegiatanItem | null) ?? null,
      error: false,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengambil detail kegiatan dari Supabase:", message);
    return { activity: null, error: true };
  }
}

export async function generateMetadata({
  params,
}: KegiatanDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { activity } = await getKegiatanBySlug(slug);

  if (!activity) {
    return {
      title: "Kegiatan Tidak Ditemukan",
      description: "Halaman kegiatan yang Anda cari tidak tersedia atau telah dihapus.",
    };
  }

  return pageMetadata({
    title: activity.title,
    description: activity.excerpt ?? activity.description ?? "",
    path: `/kegiatan/${activity.slug}`,
  });
}

export default async function KegiatanDetailPage({
  params,
}: KegiatanDetailPageProps) {
  const { slug } = await params;
  const { activity, error } = await getKegiatanBySlug(slug);

  // Gagal query Supabase: biarkan error boundary menampilkan pesan yang ramah,
  // BUKAN 404, karena ini bukan berarti data tidak ditemukan.
  if (error) {
    throw new Error("Terjadi kendala saat memuat data kegiatan.");
  }

  if (!activity) {
    notFound();
  }

  const gambar = resolveGambar(activity.image_path);

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
                <Link href="/kegiatan" className="transition-colors hover:text-foreground">
                  Kegiatan
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="truncate font-medium text-foreground">
                {activity.title}
              </li>
            </ol>
          </nav>

          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <Badge variant="primary">{activity.category}</Badge>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <time dateTime={activity.event_date}>{formatTanggal(activity.event_date)}</time>
              </span>
            </div>
            <h1 className="mt-4 max-w-3xl text-h1 text-foreground">{activity.title}</h1>
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPinIcon className="h-4 w-4" />
              {activity.location ?? ""}
            </p>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {activity.excerpt ?? ""}
            </p>
          </header>

          <figure className="mt-8 overflow-hidden rounded-card shadow-card">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={gambar}
                alt={activity.image_alt}
                fill
                priority
                sizes="(min-width: 1024px) 75vw, 100vw"
                className="object-cover"
              />
            </div>
          </figure>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-h3 text-foreground">Deskripsi Kegiatan</h2>
              <p className="mt-4 max-w-prose leading-relaxed text-muted-foreground">
                {activity.description ?? ""}
              </p>
            </div>

            <aside aria-label="Informasi kegiatan">
              <Card className="p-6 lg:sticky lg:top-24">
                <h2 className="text-h4 text-foreground">Informasi Kegiatan</h2>
                <dl className="mt-4 space-y-5">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Kategori
                    </dt>
                    <dd className="mt-1.5">
                      <Badge variant="primary">{activity.category}</Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Tanggal
                    </dt>
                    <dd className="mt-1.5 flex items-center gap-1.5 text-sm text-foreground">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <time dateTime={activity.event_date}>{formatTanggal(activity.event_date)}</time>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Lokasi
                    </dt>
                    <dd className="mt-1.5 flex items-center gap-1.5 text-sm text-foreground">
                      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                      {activity.location ?? ""}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Status
                    </dt>
                    <dd className="mt-1.5 text-sm text-foreground">{activity.status ?? ""}</dd>
                  </div>
                </dl>

                <div className="mt-8 flex flex-col gap-3">
                  <LinkButton href="/kegiatan" variant="outline" size="md">
                    Kembali ke Kegiatan
                  </LinkButton>
                  <LinkButton href="/kontak" variant="accent" size="md">
                    Hubungi Kami
                  </LinkButton>
                </div>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>
    </article>
  );
}