import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Batas body Server Action (maksimal upload 5 MB). Default Next.js = 1MB,
   * yang lebih kecil dari foto galeri maksimal 5 MB sehingga upload bakal
   * ditolak. 6MB = 5MB file + ruang headroom multipart/form-data yang wajar.
   * Tetap berbatas (bukan "tanpa batas") demi mencegah DDoS/request raksasa.
   */
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },

  /*
   * Gambar dari Supabase Storage bucket "media" (public) dipakai lewat
   * next/image. Remote pattern dibuat dari URL Supabase supaya tidak perlu
   * menuliskan host beserta secret. Tanpa ini teknikal seaman tidak ada
   * remotePatterns: gambar Storage tidak bisa dirender sama sekali.
   */
  images: {
    remotePatterns: [],
  },
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  try {
    const hostname = new URL(supabaseUrl).hostname;
    nextConfig.images = {
      remotePatterns: [
        {
          protocol: "https",
          hostname,
          pathname: "/storage/v1/object/public/media/**",
        },
      ],
    };
  } catch {
    /* Biarkan kosong bila env URL tidak valid. */
  }
}

export default nextConfig;
