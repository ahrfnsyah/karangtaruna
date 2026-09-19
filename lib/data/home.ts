/*
 * Data homepage — CADANGAN / REFERENSI.
 *
 * Statistik (stats) dan foto galeri (galleryPreviews) kini dibaca dari
 * Supabase saat render. `featuredPrograms` masih dipakai oleh komponen
 * Programs di homepage karena salinan "Empat Pilar" tidak tersedia di
 * tabel programs — ia merupakan konten UI/presentasional, bukan data
 * basis data.
 *
 * Jangan gunakan array ini sebagai sumber data runtime homepage.
 */

export type Stat = {
  value: string;
  label: string;
};

// PLACEHOLDER statistik organisasi — ganti dengan angka sebenarnya.
export const stats: Stat[] = [
  { value: "150+", label: "Anggota Aktif" },
  { value: "6", label: "Program Kerja" },
  { value: "30+", label: "Kegiatan per Tahun" },
  { value: "2009", label: "Tahun Berdiri" },
];

export type Program = {
  icon: "users" | "heart" | "trophy" | "lightbulb";
  title: string;
  description: string;
};

// PLACEHOLDER program unggulan.
export const featuredPrograms: Program[] = [
  {
    icon: "users",
    title: "Kepemudaan",
    description:
      "Mengembangkan potensi dan kepemimpinan pemuda melalui pelatihan, diskusi, dan kegiatan yang membangun karakter.",
  },
  {
    icon: "heart",
    title: "Sosial & Masyarakat",
    description:
      "Menghadirkan kepedulian kepada warga lewat gotong royong, santunan, dan aksi sosial bersama masyarakat.",
  },
  {
    icon: "trophy",
    title: "Olahraga",
    description:
      "Menggelar kompetisi dan latihan olahraga untuk menumbuhkan kebugaran, sportivitas, dan kebersamaan.",
  },
  {
    icon: "lightbulb",
    title: "Kreativitas & Kewirausahaan",
    description:
      "Mendorong ide kreatif dan semangat wirausaha pemuda agar mandiri dan memberi manfaat untuk lingkungan.",
  },
];

// PLACEHOLDER foto galeri — ganti dengan foto dari Supabase Storage.
export const galleryPreviews: string[] = [
  "/images/placeholders/galeri-1.svg",
  "/images/placeholders/galeri-2.svg",
  "/images/placeholders/galeri-3.svg",
  "/images/placeholders/galeri-4.svg",
  "/images/placeholders/galeri-5.svg",
];