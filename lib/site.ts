/*
 * Konfigurasi dasar situs.
 *
 * `url` dipakai sebagai metadataBase untuk canonical dan Open Graph.
 * Isi NEXT_PUBLIC_SITE_URL saat deploy (contoh: https://domain-anda.example).
 * Fallback localhost hanya untuk pengembangan lokal dan tidak dipakai
 * sebagai klaim alamat resmi.
 */
export const siteConfig = {
  name: "Karang Taruna RT 04 RW 08 Srengseng Sawah",
  shortName: "Karang Taruna RT 04 RW 08",
  locale: "id_ID",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Profil Karang Taruna RT 04 RW 08 Srengseng Sawah, Jagakarsa, Jakarta Selatan — informasi kegiatan, berita, galeri, dan program kerja organisasi kepemudaan. Konten saat ini masih berupa placeholder pengembangan.",
} as const;
