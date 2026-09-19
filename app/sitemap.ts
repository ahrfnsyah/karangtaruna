import type { MetadataRoute } from "next";

import { createAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/lib/site";

/*
 * Sitemap adalah route server-only yang tidak pernah mengekspos apa pun ke
 * client. Slug dinamis /kegiatan/[slug] dan /berita/[slug] dibaca langsung
 * dari Supabase (source of truth), bukan lagi dari lib/data/*.
 *
 * createAdminClient dipakai hanya untuk query READ-ONLY slug; ia membaca
 * SUPABASE_SERVICE_ROLE_KEY dari env server dan tidak bergantung pada
 * next/headers (aman untuk metadata route).
 *
 * Kegagalan salah satu query tidak menjatuhkan sitemap: kelompok URL yang
 * gagal dilewati, URL statis tetap dikembalikan. Tidak ada fallback ke
 * data static.
 */
export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  "/",
  "/tentang",
  "/program-kerja",
  "/kegiatan",
  "/berita",
  "/galeri",
  "/kontak",
];

type SitemapEntry = MetadataRoute.Sitemap[number];

async function fetchKegiatanSlugs(): Promise<{ slug: string }[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("activities")
    .select("slug")
    .eq("is_published", true)
    .order("event_date", { ascending: false });

  if (error) {
    console.error("Sitemap gagal mengambil slug kegiatan dari Supabase:", error.message);
    return [];
  }

  return (data ?? []) as { slug: string }[];
}

async function fetchBeritaSlugs(): Promise<{ slug: string; published_at: string }[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("news")
    .select("slug, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Sitemap gagal mengambil slug berita dari Supabase:", error.message);
    return [];
  }

  return (data ?? []) as { slug: string; published_at: string }[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const lastModified = new Date();

  const [kegiatan, berita] = await Promise.allSettled([
    fetchKegiatanSlugs(),
    fetchBeritaSlugs(),
  ]);

  const kegiatanItems = kegiatan.status === "fulfilled" ? kegiatan.value : [];
  const beritaItems = berita.status === "fulfilled" ? berita.value : [];

  return [
    ...STATIC_ROUTES.map((path): SitemapEntry => ({
      url: `${baseUrl}${path === "/" ? "" : path}`,
      lastModified,
    })),
    ...kegiatanItems.map((item): SitemapEntry => ({
      url: `${baseUrl}/kegiatan/${item.slug}`,
      lastModified,
    })),
    ...beritaItems.map((item): SitemapEntry => ({
      url: `${baseUrl}/berita/${item.slug}`,
      lastModified: item.published_at,
    })),
  ];
}