/*
 * Data berita di bawah ini adalah PLACEHOLDER (dummy) yang dipertahankan
 * sebagai CADANGAN / referensi. Sumber data sebenarnya kini adalah tabel
 * `public.news` di Supabase; file ini tidak lagi dipakai saat render.
 * Kategori filter (newsCategories) tetap dipakai oleh UI berita.
 */

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  // Tanggal terbit dalam format ISO (yyyy-mm-dd) agar bisa dipakai <time>.
  publishedAt: string;
  // Penulis placeholder — ganti dengan nama penulis / redaksi resmi.
  author: string;
  excerpt: string;
  // Konten berupa array paragraf.
  content: string[];
  image: string;
  alt: string;
  featured?: boolean;
};

export const newsCategories = [
  "Semua",
  "Informasi",
  "Kegiatan",
  "Pengumuman",
  "Kepemudaan",
  "Masyarakat",
] as const;

export const news: NewsItem[] = [
  {
    id: "1",
    slug: "pembukaan-program-kerja-tahunan",
    title: "Sekilas Program Kerja Karang Taruna RT 04 RW 08",
    category: "Informasi",
    publishedAt: "2026-09-14",
    author: "Pengurus Karang Taruna RT 04 RW 08",
    excerpt:
      "Ringkasan bidang program kerja yang menjadi fokus pengurus periode ini.",
    content: [
      "Karang Taruna RT 04 RW 08 merupakan wadah pembinaan dan pengembangan generasi muda yang bertujuan membangun lingkungan yang aktif, kreatif, dan peduli terhadap sesama.",
      "Program kerja disusun oleh pengurus bersama anggota melalui musyawarah, kemudian dijalankan secara gotong royong bersama warga dan pemuda setempat.",
      "Halaman ini akan diperbarui secara berkala dengan berita dan pengumuman resmi dari pengurus Karang Taruna.",
    ],
    image: "/images/placeholders/hero.svg",
    alt: "Ilustrasi program kerja Karang Taruna (gambar placeholder)",
    featured: true,
  },
  {
    id: "2",
    slug: "kerja-bakti-bersama-warga",
    title: "Kerja Bakti Bersama Warga",
    category: "Kegiatan",
    publishedAt: "2026-09-05",
    author: "Pengurus Karang Taruna RT 04 RW 08",
    excerpt:
      "Pemuda bersama warga membersihkan lingkungan sebagai bentuk kepedulian bersama.",
    content: [
      "Kegiatan kerja bakti dilakukan oleh pemuda bersama warga untuk membersihkan saluran air dan fasilitas umum di lingkungan sekitar.",
      "Kegiatan semacam ini direncanakan berjalan secara berkala sesuai jadwal yang disepakati bersama warga.",
    ],
    image: "/images/placeholders/kegiatan-2.svg",
    alt: "Dokumentasi kerja bakti bersama warga (gambar placeholder)",
  },
  {
    id: "3",
    slug: "pengumuman-jadwal-senam-bersama",
    title: "Jadwal Senam Bersama Warga",
    category: "Pengumuman",
    publishedAt: "2026-08-28",
    author: "Pengurus Karang Taruna RT 04 RW 08",
    excerpt:
      "Senam bersama direncanakan berjalan rutin untuk menjaga kebugaran warga.",
    content: [
      "Senam bersama warga merupakan salah satu kegiatan rutin yang diagendakan untuk menjaga kebugaran dan mempererat silaturahmi.",
      "Jadwal pelaksanaan akan diumumkan lebih lanjut oleh pengurus melalui papan informasi dan media sosial.",
    ],
    image: "/images/placeholders/galeri-4.svg",
    alt: "Ilustrasi senam bersama warga (gambar placeholder)",
  },
  {
    id: "4",
    slug: "pelatihan-kepemimpinan-pemuda",
    title: "Pelatihan Kepemimpinan untuk Pemuda",
    category: "Kepemudaan",
    publishedAt: "2026-08-15",
    author: "Pengurus Karang Taruna RT 04 RW 08",
    excerpt:
      "Pembekalan kepemimpinan untuk membentuk pemuda yang siap berorganisasi.",
    content: [
      "Pelatihan kepemimpinan dirancang untuk membekali pemuda dengan kemampuan organisasi, komunikasi, dan kerja sama tim.",
      "Materi dan jadwal pelaksanaan pelatihan akan disusun oleh pengurus bersama pendamping pemuda.",
    ],
    image: "/images/placeholders/galeri-3.svg",
    alt: "Ilustrasi pelatihan kepemimpinan pemuda (gambar placeholder)",
  },
  {
    id: "5",
    slug: "bakti-sosial-bersama-warga",
    title: "Bakti Sosial Bersama Warga",
    category: "Masyarakat",
    publishedAt: "2026-07-30",
    author: "Pengurus Karang Taruna RT 04 RW 08",
    excerpt:
      "Rencana aksi berbagi dan bantuan sosial bagi warga yang membutuhkan.",
    content: [
      "Bakti sosial direncanakan sebagai wujud kepedulian Karang Taruna kepada warga yang membutuhkan di lingkungan sekitar.",
      "Pengurus akan mengkoordinasikan penggalangan dan penyaluran bantuan bersama warga secara transparan.",
    ],
    image: "/images/placeholders/galeri-1.svg",
    alt: "Ilustrasi bakti sosial bersama warga (gambar placeholder)",
  },
  {
    id: "6",
    slug: "olahraga-persahabatan-pemuda",
    title: "Olahraga Persahabatan Antar Pemuda",
    category: "Kegiatan",
    publishedAt: "2026-07-18",
    author: "Pengurus Karang Taruna RT 04 RW 08",
    excerpt:
      "Pertandingan persahabatan untuk menumbuhkan sportivitas dan kebersamaan.",
    content: [
      "Kegiatan olahraga di lingkungan kami bertujuan menyalurkan energi positif pemuda dan mempererat persaudaraan antarwarga.",
      "Lokasi dan waktu pelaksanaan akan ditentukan bersama pemuda setempat.",
    ],
    image: "/images/placeholders/kegiatan-3.svg",
    alt: "Ilustrasi olahraga persahabatan pemuda (gambar placeholder)",
  },
  {
    id: "7",
    slug: "tips-aktif-berorganisasi",
    title: "Tips Aktif Berorganisasi untuk Pemuda",
    category: "Informasi",
    publishedAt: "2026-07-02",
    author: "Sekretariat Karang Taruna RT 04 RW 08",
    excerpt:
      "Catatan ringan tentang cara pemuda dapat berperan aktif di lingkungannya.",
    content: [
      "Berorganisasi di lingkungan tidak selalu harus bersifat formal. Kegiatan kecil seperti berkenalan dengan tetangga dan ikut serta kerja bakti sudah menjadi langkah awal yang baik.",
      "Karang Taruna membuka ruang bagi pemuda yang ingin belajar berorganisasi, berkolaborasi, dan mengembangkan diri di lingkungannya masing-masing.",
      "Artikel ini hanya catatan pengembangan dan akan diperbarui seiring dengan berjalannya program resmi.",
    ],
    image: "/images/placeholders/about.svg",
    alt: "Ilustrasi pemuda aktif berorganisasi (gambar placeholder)",
  },
  {
    id: "8",
    slug: "pengumuman-kegiatan-lomba-agustusan",
    title: "Rencana Perayaan dan Lomba HUT Kemerdekaan",
    category: "Pengumuman",
    publishedAt: "2026-06-20",
    author: "Pengurus Karang Taruna RT 04 RW 08",
    excerpt:
      "Persiapan perayaan kemerdekaan bersama warga dengan berbagai kegiatan kebersamaan.",
    content: [
      "Perayaan HUT Kemerdekaan RI direncanakan dirayakan bersama warga melalui berbagai kegiatan kebersamaan dan lomba-lomba khas.",
      "Detail jadwal dan pendaftaran lomba akan diumumkan oleh panitia menjelang pelaksanaan.",
    ],
    image: "/images/placeholders/kegiatan-1.svg",
    alt: "Ilustrasi perayaan HUT kemerdekaan (gambar placeholder)",
  },
];