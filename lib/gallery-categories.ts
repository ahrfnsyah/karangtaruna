/*
 * Kategori galeri — sama dengan constraint `gallery_items_category_check`
 * pada migration schema. Berada di file terpisah (tanpa "use server") agar
 * aman dipakai Server Action maupun Client Component form admin.
 */
export const GALLERY_CATEGORIES = [
  "Kegiatan",
  "Sosial",
  "Olahraga",
  "Kepemudaan",
  "Lingkungan",
  "Kreativitas",
] as const;