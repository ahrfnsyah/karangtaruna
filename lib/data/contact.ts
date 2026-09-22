/*
 * Data kontak di bawah ini adalah PLACEHOLDER yang dipertahankan sebagai
 * CADANGAN / referensi, sekaligus bahan baku skrip seed
 * (scripts/seed-supabase.ts). Aplikasi /kontak kini membaca data runtime dari
 * Supabase: `site_settings` (alamat/email/telepon) dan `social_links`
 * (media sosial). File ini bukan runtime source.
 *
 * Email, nomor telepon, dan akun media sosial BUKAN kontak resmi
 * dan tidak boleh dipublikasikan sebagai kontak asli.
 */

export const contactInfo = {
  title: "Karang Taruna RT 04 RW 08 Srengseng Sawah",
  address: "RT 04 RW 08, Srengseng Sawah, Jagakarsa, Jakarta Selatan",
  email: "email@karangtaruna.example",
  phone: "+62 8XX-XXXX-XXXX",
  instagram: "@karangtaruna_rt04rw08",
} as const;

export const socialMedia = [
  { name: "Instagram", status: "Segera tersedia" },
  { name: "Facebook", status: "Segera tersedia" },
  { name: "TikTok", status: "Segera tersedia" },
] as const;