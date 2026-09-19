/*
 * Kategori berita — sama dengan constraint `news_category_check`
 * pada migration schema. Berada di file terpisah (tanpa "use server") agar
 * aman dipakai Server Action maupun Client Component form admin.
 */
export const NEWS_CATEGORIES = [
  "Informasi",
  "Kegiatan",
  "Pengumuman",
  "Kepemudaan",
  "Masyarakat",
] as const;