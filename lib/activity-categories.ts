/*
 * Kategori kegiatan — sama dengan constraint `activities_category_check`
 * pada migration schema. Berada di file terpisah (tanpa "use server") agar
 * aman dipakai Server Action maupun Client Component form admin.
 */
export const ACTIVITY_CATEGORIES = [
  "Kepemudaan",
  "Sosial",
  "Olahraga",
  "Lingkungan",
  "Kreativitas",
  "Masyarakat",
] as const;