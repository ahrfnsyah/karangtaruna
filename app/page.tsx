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

import type {
  ActivityPreviewItem,
  GalleryPreviewItem,
  StatItem,
} from "@/lib/types";

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
  title: {
    absolute: siteConfig.name,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
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

type HomeSettings = {
  hero_description: string;
  hero_image_path: string | null;
  hero_image_alt: string;
  about_image_path: string | null;
  about_image_alt: string;
};

/**
 * Mengambil pengaturan Hero dari site_settings.
 *
 * Jika gambar belum tersedia atau query gagal, Hero akan menggunakan
 * placeholder lokal sebagai fallback.
 */
async function getHomeSettings(): Promise<HomeSettings> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("site_settings")
      .select(
      "hero_description, hero_image_path, hero_image_alt, about_image_path, about_image_alt",
    )
    .eq("id", 1)
    .maybeSingle();

    if (error || !data) {
  console.error(
    "Gagal mengambil pengaturan homepage:",
    error?.message ?? "Data site_settings tidak ditemukan.",
  );

  return {
    hero_description: "",
    hero_image_path: null,
    hero_image_alt: "",
    about_image_path: null,
    about_image_alt: "",
  };
}

return {
  hero_description: data.hero_description ?? "",
  hero_image_path: data.hero_image_path ?? null,
  hero_image_alt: data.hero_image_alt ?? "",
  about_image_path: data.about_image_path ?? null,
  about_image_alt: data.about_image_alt ?? "",
};
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan yang tidak diketahui";

    console.error(
      "Gagal mengambil pengaturan homepage:",
      message,
    );

    return {
      hero_description: "",
      hero_image_path: null,
      hero_image_alt: "",
      about_image_path: null,
      about_image_alt: "",
    };
  }
}

async function getHomeStats(): Promise<SectionResult<StatItem>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("stats")
      .select("value, label")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(
        "Gagal mengambil statistik dari Supabase:",
        error.message,
      );

      return {
        data: [],
        error:
          "Data statistik sementara tidak dapat ditampilkan.",
      };
    }

    return {
      data: (data ?? []) as StatItem[],
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan yang tidak diketahui";

    console.error(
      "Gagal mengambil statistik dari Supabase:",
      message,
    );

    return {
      data: [],
      error:
        "Data statistik sementara tidak dapat ditampilkan.",
    };
  }
}

async function getLatestActivities(): Promise<
  SectionResult<ActivityPreviewItem>
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("activities")
      .select(
        "slug, title, category, event_date, excerpt, image_path, image_alt",
      )
      .eq("is_published", true)
      .order("event_date", { ascending: false })
      .limit(3);

    if (error) {
      console.error(
        "Gagal mengambil kegiatan terbaru dari Supabase:",
        error.message,
      );

      return {
        data: [],
        error:
          "Kegiatan terbaru sementara tidak dapat ditampilkan.",
      };
    }

    return {
      data: (data ?? []) as ActivityPreviewItem[],
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan yang tidak diketahui";

    console.error(
      "Gagal mengambil kegiatan terbaru dari Supabase:",
      message,
    );

    return {
      data: [],
      error:
        "Kegiatan terbaru sementara tidak dapat ditampilkan.",
    };
  }
}

async function getGalleryPreview(): Promise<
  SectionResult<GalleryPreviewItem>
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("gallery_items")
      .select("image_path, image_alt")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .limit(5);

    if (error) {
      console.error(
        "Gagal mengambil pratinjau galeri dari Supabase:",
        error.message,
      );

      return {
        data: [],
        error:
          "Pratinjau galeri sementara tidak dapat ditampilkan.",
      };
    }

    return {
      data: (data ?? []) as GalleryPreviewItem[],
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan yang tidak diketahui";

    console.error(
      "Gagal mengambil pratinjau galeri dari Supabase:",
      message,
    );

    return {
      data: [],
      error:
        "Pratinjau galeri sementara tidak dapat ditampilkan.",
    };
  }
}

export default async function Home() {
  const [
    settingsResult,
    statsResult,
    activitiesResult,
    galleryResult,
  ] = await Promise.allSettled([
    getHomeSettings(),
    getHomeStats(),
    getLatestActivities(),
    getGalleryPreview(),
  ]);

 const settings =
  settingsResult.status === "fulfilled"
    ? settingsResult.value
    : {
        hero_description: "",
        hero_image_path: null,
        hero_image_alt: "",
        about_image_path: null,
        about_image_alt: "",
      };

  const stats =
    statsResult.status === "fulfilled"
      ? statsResult.value
      : {
          data: [],
          error:
            "Data statistik sementara tidak dapat ditampilkan.",
        };

  const activities =
    activitiesResult.status === "fulfilled"
      ? activitiesResult.value
      : {
          data: [],
          error:
            "Kegiatan terbaru sementara tidak dapat ditampilkan.",
        };

  const gallery =
    galleryResult.status === "fulfilled"
      ? galleryResult.value
      : {
          data: [],
          error:
            "Pratinjau galeri sementara tidak dapat ditampilkan.",
        };

  return (
    <>
      <Hero
  description={settings.hero_description}
  imagePath={settings.hero_image_path}
  imageAlt={settings.hero_image_alt}
/>

      <AboutPreview
  imagePath={settings.about_image_path}
  imageAlt={settings.about_image_alt}
/>

      <Statistics
        stats={stats.data}
        error={stats.error}
      />

      <Programs />

      <LatestActivities
        items={activities.data}
        error={activities.error}
      />

      <GalleryPreview
        items={gallery.data}
        error={gallery.error}
      />

      <Cta />
    </>
  );
}