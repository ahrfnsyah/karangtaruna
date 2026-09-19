/*
 * Kategori program kerja — sama dengan constraint `programs_category_check`
 * pada migration schema. Berada di file terpisah yang dijamin client-safe
 * (tanpa "use server") agar bisa dipakai oleh Server Action maupun
 * Client Component form admin tanpa kesalahan impor "use server".
 */
export const PROGRAM_CATEGORIES = [
  "Kepemudaan",
  "Kreativitas & Kewirausahaan",
  "Sosial & Masyarakat",
  "Olahraga",
  "Lingkungan",
] as const;