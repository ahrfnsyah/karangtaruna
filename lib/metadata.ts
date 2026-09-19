import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

type PageMetadataInput = {
  title: string;
  description: string;
  // Path relatif terhadap metadataBase, contoh: "/kegiatan".
  path: string;
  // Diisi hanya untuk halaman detail yang bersifat artikel.
  publishedTime?: string;
  authors?: string[];
};

/*
 * Helper metadata agar setiap halaman memiliki title, description,
 * canonical, dan Open Graph yang konsisten tanpa mengulang objek panjang.
 */
export function pageMetadata({
  title,
  description,
  path,
  publishedTime,
  authors,
}: PageMetadataInput): Metadata {
  const openGraph = publishedTime
    ? {
        type: "article" as const,
        title,
        description,
        url: path,
        siteName: siteConfig.name,
        locale: siteConfig.locale,
        publishedTime,
        authors,
      }
    : {
        type: "website" as const,
        title,
        description,
        url: path,
        siteName: siteConfig.name,
        locale: siteConfig.locale,
      };

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
