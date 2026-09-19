/*
 * Data kegiatan di bawah ini adalah PLACEHOLDER (dummy) yang dipertahankan
 * sebagai CADANGAN / referensi. Sumber data sebenarnya kini adalah tabel
 * `public.activities` di Supabase; file ini tidak lagi dipakai saat render.
 * Kategori filter (activityCategories) tetap dipakai oleh UI kegiatan.
 */

export type Activity = {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  location: string;
  excerpt: string;
  description: string;
  image: string;
  alt: string;
  // Status placeholder — sesuaikan (misal: Tahunan, Berkala, Rutin).
  status: string;
};

export const activityCategories = [
  "Semua",
  "Kepemudaan",
  "Sosial",
  "Olahraga",
  "Lingkungan",
  "Kreativitas",
  "Masyarakat",
] as const;

export const activities: Activity[] = [
  {
    id: "1",
    slug: "peringatan-hut-kemerdekaan-ri",
    title: "Peringatan HUT Kemerdekaan RI",
    category: "Masyarakat",
    date: "17 Agustus 2026",
    location: "Lapangan RT 04 RW 08",
    excerpt:
      "Perayaan kemerdekaan bersama warga, mulai dari upacara hingga lomba-lomba khas tujuh belasan.",
    description:
      "Kegiatan peringatan HUT Kemerdekaan RI dilakukan bersama warga, meliputi upacara bendera, lomba, dan penutupan dengan kegiatan kebersamaan lainnya.",
    image: "/images/placeholders/kegiatan-1.svg",
    alt: "Dokumentasi peringatan HUT Kemerdekaan RI (foto placeholder)",
    status: "Tahunan",
  },
  {
    id: "2",
    slug: "kerja-bakti-lingkungan",
    title: "Kerja Bakti Lingkungan",
    category: "Lingkungan",
    date: "5 Juli 2026",
    location: "Sepanjang jalan RT 04 RW 08",
    excerpt:
      "Bersih-bersih saluran air dan fasilitas umum bersama warga setempat.",
    description:
      "Anggota Karang Taruna bersama warga melakukan pembersihan saluran air, fasilitas umum, dan area sekitar lingkungan.",
    image: "/images/placeholders/kegiatan-2.svg",
    alt: "Dokumentasi kerja bakti lingkungan (foto placeholder)",
    status: "Berkala",
  },
  {
    id: "3",
    slug: "kegiatan-olahraga-pemuda",
    title: "Kegiatan Olahraga Pemuda",
    category: "Olahraga",
    date: "18 Juli 2026",
    location: "Lapangan olahraga Srengseng Sawah",
    excerpt:
      "Latihan bersama dan pertandingan persahabatan untuk menyalurkan energi positif pemuda.",
    description:
      "Kegiatan olahraga berupa latihan bersama dan pertandingan persahabatan futsal atau badminton untuk menumbuhkan kebugaran dan sportivitas.",
    image: "/images/placeholders/kegiatan-3.svg",
    alt: "Dokumentasi kegiatan olahraga pemuda (foto placeholder)",
    status: "Tahunan",
  },
  {
    id: "4",
    slug: "bakti-sosial-masyarakat",
    title: "Bakti Sosial Masyarakat",
    category: "Sosial",
    date: "2 Agustus 2026",
    location: "Balai RW 08",
    excerpt:
      "Aksi berbagi dan bantuan sosial bagi warga yang membutuhkan.",
    description:
      "Bakti sosial berupa pembagian bantuan dan santunan kepada warga yang membutuhkan di lingkungan sekitar.",
    image: "/images/placeholders/galeri-1.svg",
    alt: "Dokumentasi bakti sosial masyarakat (foto placeholder)",
    status: "Berkala",
  },
  {
    id: "5",
    slug: "pelatihan-kreativitas-pemuda",
    title: "Pelatihan Kreativitas Pemuda",
    category: "Kreativitas",
    date: "30 Agustus 2026",
    location: "Aula RT 04",
    excerpt:
      "Workshop kreatif untuk mengasah keterampilan dan ide pemuda.",
    description:
      "Pelatihan kreativitas berupa workshop keterampilan praktis untuk mengasah bakat dan ide kreatif pemuda.",
    image: "/images/placeholders/galeri-2.svg",
    alt: "Dokumentasi pelatihan kreativitas pemuda (foto placeholder)",
    status: "Berkala",
  },
  {
    id: "6",
    slug: "latihan-kepemimpinan-pemuda",
    title: "Latihan Kepemimpinan Pemuda",
    category: "Kepemudaan",
    date: "13 September 2026",
    location: "Aula RT 04",
    excerpt:
      "Pembekalan kepemimpinan, komunikasi, dan kerja tim untuk pengurus muda.",
    description:
      "Latihan kepemimpinan membekali pemuda dengan kemampuan organisasi, komunikasi, dan kerja sama tim.",
    image: "/images/placeholders/galeri-3.svg",
    alt: "Dokumentasi latihan kepemimpinan pemuda (foto placeholder)",
    status: "Berkala",
  },
  {
    id: "7",
    slug: "senam-bersama-warga",
    title: "Senam Bersama Warga",
    category: "Olahraga",
    date: "20 September 2026",
    location: "Lapangan RT 04 RW 08",
    excerpt:
      "Senam pagi bersama untuk menjaga kebugaran dan mempererat silaturahmi.",
    description:
      "Senam bersama yang rutin dilakukan setiap pekan untuk menjaga kebugaran warga dan mempererat kebersamaan.",
    image: "/images/placeholders/galeri-4.svg",
    alt: "Dokumentasi senam bersama warga (foto placeholder)",
    status: "Rutin",
  },
  {
    id: "8",
    slug: "penataan-taman-dan-penghijauan",
    title: "Penataan Taman dan Penghijauan",
    category: "Lingkungan",
    date: "27 September 2026",
    location: "Taman lingkungan RT 04",
    excerpt:
      "Menata taman dan menanam tanaman hijau untuk lingkungan yang asri.",
    description:
      "Kegiatan menata taman lingkungan dan menanam tanaman sebagai upaya penghijauan dan keasrian lingkungan.",
    image: "/images/placeholders/galeri-5.svg",
    alt: "Dokumentasi penataan taman dan penghijauan (foto placeholder)",
    status: "Berkala",
  },
];