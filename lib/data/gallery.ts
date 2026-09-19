/*
 * Data foto galeri di bawah ini adalah PLACEHOLDER (dummy) yang dipertahankan
 * sebagai CADANGAN / referensi. Sumber data sebenarnya kini adalah tabel
 * `public.gallery_items` di Supabase; file ini tidak lagi dipakai saat render.
 * Kategori filter (galleryCategories) tetap dipakai oleh UI galeri.
 */

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  alt: string;
  description: string;
};

export const galleryCategories = [
  "Semua",
  "Kegiatan",
  "Sosial",
  "Olahraga",
  "Kepemudaan",
  "Lingkungan",
  "Kreativitas",
] as const;

export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "Suasana Saat Kerja Bakti",
    category: "Lingkungan",
    date: "5 Juli 2026",
    image: "/images/placeholders/kegiatan-2.svg",
    alt: "Dokumentasi kerja bakti membersihkan lingkungan (foto placeholder)",
    description: "Dokumentasi saat pemuda dan warga membersihkan lingkungan.",
  },
  {
    id: "2",
    title: "Warga Berolahraga Bersama",
    category: "Olahraga",
    date: "12 Juli 2026",
    image: "/images/placeholders/kegiatan-3.svg",
    alt: "Dokumentasi warga berolahraga bersama (foto placeholder)",
    description: "Momen kebersamaan warga saat berolahraga di lapangan.",
  },
  {
    id: "3",
    title: "Berbagi Demi Sesama",
    category: "Sosial",
    date: "2 Agustus 2026",
    image: "/images/placeholders/galeri-1.svg",
    alt: "Ilustrasi berbagi dan berdonasi bersama warga (foto placeholder)",
    description: "Aksi berbagi yang direncanakan bersama warga setempat.",
  },
  {
    id: "4",
    title: "Pemuda Berkumpul dan Berdiskusi",
    category: "Kepemudaan",
    date: "15 Agustus 2026",
    image: "/images/placeholders/about.svg",
    alt: "Ilustrasi pemuda berkumpul dan berdiskusi (foto placeholder)",
    description: "Kebersamaan pemuda dalam kegiatan berkumpul dan berdiskusi.",
  },
  {
    id: "5",
    title: "Lingkungan Asri dan Hijau",
    category: "Lingkungan",
    date: "27 September 2026",
    image: "/images/placeholders/galeri-5.svg",
    alt: "Ilustrasi lingkungan asri dan penghijauan (foto placeholder)",
    description: "Upaya penghijauan agar lingkungan semakin asri.",
  },
  {
    id: "6",
    title: "Hari Bahagia Bersama Warga",
    category: "Sosial",
    date: "17 Agustus 2026",
    image: "/images/placeholders/kegiatan-1.svg",
    alt: "Ilustrasi perayaan bersama warga (foto placeholder)",
    description: "Kebersamaan warga dalam perayaan hari bahagia.",
  },
  {
    id: "7",
    title: "Momen Latihan Keterampilan",
    category: "Kreativitas",
    date: "30 Agustus 2026",
    image: "/images/placeholders/galeri-2.svg",
    alt: "Ilustrasi pelatihan keterampilan pemuda (foto placeholder)",
    description: "Pemuda mengasah keterampilan dalam pelatihan kreativitas.",
  },
  {
    id: "8",
    title: "Bersaing Secara Sehat",
    category: "Olahraga",
    date: "18 Juli 2026",
    image: "/images/placeholders/galeri-3.svg",
    alt: "Ilustrasi pertandingan olahraga pemuda (foto placeholder)",
    description: "Semangat sportivitas dalam kegiatan olahraga pemuda.",
  },
  {
    id: "9",
    title: "Aktivitas Bersama di Lingkungan",
    category: "Kegiatan",
    date: "20 September 2026",
    image: "/images/placeholders/galeri-4.svg",
    alt: "Ilustrasi aktivitas bersama warga (foto placeholder)",
    description: "Momen aktivitas bersama warga di lingkungan sekitar.",
  },
  {
    id: "10",
    title: "Senam Pagi Bersama",
    category: "Kegiatan",
    date: "20 September 2026",
    image: "/images/placeholders/hero.svg",
    alt: "Ilustrasi senam pagi bersama warga (foto placeholder)",
    description: "Senam pagi bersama untuk menjaga kebugaran dan silaturahmi.",
  },
  {
    id: "11",
    title: "Rapat Koordinasi Pengurus",
    category: "Kepemudaan",
    date: "13 September 2026",
    image: "/images/placeholders/kegiatan-1.svg",
    alt: "Ilustrasi rapat koordinasi pengurus (foto placeholder)",
    description: "Koordinasi pengurus dalam merencanakan program kegiatan.",
  },
  {
    id: "12",
    title: "Kegiatan Kreatif Pemuda",
    category: "Kreativitas",
    date: "30 Agustus 2026",
    image: "/images/placeholders/galeri-5.svg",
    alt: "Ilustrasi kegiatan kreatif pemuda (foto placeholder)",
    description: "Pemuda berkreasi dalam kegiatan pengembangan diri.",
  },
];