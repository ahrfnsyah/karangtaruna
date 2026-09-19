import type { Metadata } from "next";

import { AboutPreview } from "@/components/home/about-preview";
import { Cta } from "@/components/home/cta";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { Hero } from "@/components/home/hero";
import { LatestActivities } from "@/components/home/latest-activities";
import { Programs } from "@/components/home/programs";
import { Statistics } from "@/components/home/statistics";
import { siteConfig } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import type { ActivityPreviewItem, GalleryPreviewItem, StatItem } from "@/lib/types";

/*
 * Supabase Server Client berbasis cookie => halaman tidak bisa di-prerender
 * statis. force-dynamic membuat data selalu dirender server-side dan segar,
 * konsisten dengan halaman lain yang sudah dimigrasikan.
 *
 * Setiap section mengambil datanya sendiri. Kegagalan satu section tidak
 * menjatuhkan section lain: tiap query punya error state sendiri.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: siteConfig.name },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

type SectionResult<T> = {
  data: T[];
  error: string | null;
};

async function getHomeStats(): Promise<SectionResult<StatItem>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stats")
      .select("value, label")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Gagal mengambil statistik dari Supabase:", error.message);
      return { data: [], error: "Data statistik sementara tidak dapat ditampilkan." };
    }

    return { data: (data ?? []) as StatItem[], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengambil statistik dari Supabase:", message);
    return { data: [], error: "Data statistik sementara tidak dapat ditampilkan." };
  }
}

async function getLatestActivities(): Promise<SectionResult<ActivityPreviewItem>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("activities")
      .select("slug, title, category, event_date, excerpt, image_path, image_alt")
      .eq("is_published", true)
      .order("event_date", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Gagal mengambil kegiatan terbaru dari Supabase:", error.message);
      return { data: [], error: "Kegiatan terbaru sementara tidak dapat ditampilkan." };
    }

    return { data: (data ?? []) as ActivityPreviewItem[], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengambil kegiatan terbaru dari Supabase:", message);
    return { data: [], error: "Kegiatan terbaru sementara tidak dapat ditampilkan." };
  }
}

async function getGalleryPreview(): Promise<SectionResult<GalleryPreviewItem>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("image_path, image_alt")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .limit(5);

    if (error) {
      console.error("Gagal mengambil pratinjau galeri dari Supabase:", error.message);
      return { data: [], error: "Pratinjau galeri sementara tidak dapat ditampilkan." };
    }

    return { data: (data ?? []) as GalleryPreviewItem[], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengambil pratinjau galeri dari Supabase:", message);
    return { data: [], error: "Pratinjau galeri sementara tidak dapat ditampilkan." };
  }
}

export default async function Home() {
  const [statsResult, activitiesResult, galleryResult] = await Promise.allSettled([
    getHomeStats(),
    getLatestActivities(),
    getGalleryPreview(),
  ]);

  const stats =
    statsResult.status === "fulfilled"
      ? statsResult.value
      : { data: [], error: "Data statistik sementara tidak dapat ditampilkan." };
  const activities =
    activitiesResult.status === "fulfilled"
      ? activitiesResult.value
      : { data: [], error: "Kegiatan terbaru sementara tidak dapat ditampilkan." };
  const gallery =
    galleryResult.status === "fulfilled"
      ? galleryResult.value
      : { data: [], error: "Pratinjau galeri sementara tidak dapat ditampilkan." };

  return (
    <>
      <Hero />
      <AboutPreview />
      <Statistics stats={stats.data} error={stats.error} />
      <Programs />
      <LatestActivities items={activities.data} error={activities.error} />
      <GalleryPreview items={gallery.data} error={gallery.error} />
      <Cta />
    </>
  );
}