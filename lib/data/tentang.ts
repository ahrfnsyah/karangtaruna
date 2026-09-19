/*
 * Konten halaman /tentang di bawah ini adalah PLACEHOLDER (dummy) yang
 * dipertahankan sebagai CADANGAN / referensi, sekaligus bahan baku skrip seed
 * (scripts/seed-supabase.ts). Aplikasi /tentang kini membaca data runtime dari
 * Supabase: `site_settings` (profil & visi), `about_items` (misi/nilai/peran),
 * dan `team_members` (pengurus). File ini bukan runtime source.
 */

import type { IconName } from "@/lib/icons";

export type Mission = {
  icon: IconName;
  title: string;
  description: string;
};

export type ValueItem = {
  icon: IconName;
  title: string;
  description: string;
};

export type RoleItem = {
  icon: IconName;
  title: string;
  description: string;
};

export const aboutProfile = [
  "Karang Taruna adalah wadah pembinaan dan pengembangan generasi muda yang tumbuh dan berkembang dalam kehidupan masyarakat. Organisasi ini hadir sebagai ruang bagi pemuda untuk berkegiatan, berorganisasi, dan belajar bersama.",
  "Di RT 04 RW 08 Srengseng Sawah, Karang Taruna berperan aktif dalam kegiatan sosial, pengembangan potensi pemuda, kreativitas, kebersamaan, serta kontribusi nyata kepada masyarakat sekitar.",
  "Melalui berbagai program dan kegiatan, kami berusaha menghadirkan lingkungan yang hidup, saling peduli, dan penuh semangat gotong royong.",
];

// PLACEHOLDER visi — dapat disesuaikan dengan hasil musyawarah organisasi.
export const vision =
  "Menjadi wadah kepemudaan yang aktif, kreatif, solid, dan memberikan kontribusi positif bagi masyarakat.";

export const missions: Mission[] = [
  {
    icon: "users",
    title: "Meningkatkan Partisipasi Pemuda",
    description:
      "Mendorong keikutsertaan aktif pemuda dalam berbagai kegiatan masyarakat di lingkungan sekitar.",
  },
  {
    icon: "lightbulb",
    title: "Mengembangkan Kreativitas, Keterampilan, dan Potensi Pemuda",
    description:
      "Memberi ruang bagi pemuda untuk mengasah bakat, keterampilan, dan kemampuan dirinya masing-masing.",
  },
  {
    icon: "heart",
    title: "Membangun Kepedulian Sosial dan Semangat Gotong Royong",
    description:
      "Menumbuhkan kepekaan untuk saling membantu sesama dan menjaga semangat kebersamaan.",
  },
  {
    icon: "thumbs-up",
    title: "Menciptakan Kegiatan Positif, Produktif, dan Inklusif",
    description:
      "Menghadirkan kegiatan yang bermanfaat, terbuka, dan dapat diikuti semua kalangan.",
  },
  {
    icon: "sparkles",
    title: "Memperkuat Kebersamaan Antarpemuda dan Masyarakat",
    description:
      "Mempererat persaudaraan antar pemuda serta hubungan yang erat dengan masyarakat.",
  },
];

export const values: ValueItem[] = [
  {
    icon: "users",
    title: "Kebersamaan",
    description:
      "Menyelesaikan segala hal secara bersama dan membangun hubungan yang hangat antaranggota dan warga.",
  },
  {
    icon: "heart",
    title: "Gotong Royong",
    description:
      "Saling bahu-membahu dalam setiap kegiatan demi kepentingan lingkungan.",
  },
  {
    icon: "lightbulb",
    title: "Kreativitas",
    description:
      "Terbuka terhadap ide baru dan mendorong lahirnya karya dari pemuda.",
  },
  {
    icon: "sparkles",
    title: "Kepedulian",
    description:
      "Peka dan tanggap terhadap kebutuhan serta kesulitan sesama.",
  },
  {
    icon: "shield-check",
    title: "Tanggung Jawab",
    description:
      "Menjaga amanah, komitmen, dan integritas organisasi.",
  },
];

export const roles: RoleItem[] = [
  {
    icon: "heart",
    title: "Kegiatan Sosial",
    description: "Menggerakkan bantuan dan kepedulian bagi warga yang membutuhkan.",
  },
  {
    icon: "map-pin",
    title: "Kegiatan Lingkungan",
    description: "Menjaga kebersihan dan kelestarian lingkungan sekitar.",
  },
  {
    icon: "trophy",
    title: "Olahraga",
    description: "Menghidupkan semangat olahraga dan hidup sehat di kalangan pemuda.",
  },
  {
    icon: "lightbulb",
    title: "Kreativitas",
    description: "Menyalurkan daya cipta pemuda lewat pelatihan dan karya.",
  },
  {
    icon: "users",
    title: "Kegiatan Masyarakat",
    description: "Terlibat aktif dalam kegiatan kemasyarakatan dan kerja bakti.",
  },
];

export type Position = {
  jabatan: string;
  nama: string;
};

/*
 * Struktur organisasi — nama pengurus masih PLACEHOLDER ("Nama Pengurus").
 * Ganti kolom "nama" dengan data pengurus sebenarnya saat tersedia,
 * tanpa mengubah urutan hierarki di bawah ini.
 */
export const struktur: { kepengurusan: Position[]; divisi: Position[] } = {
  kepengurusan: [
    { jabatan: "Ketua", nama: "Nama Pengurus" },
    { jabatan: "Wakil Ketua", nama: "Nama Pengurus" },
    { jabatan: "Sekretaris", nama: "Nama Pengurus" },
    { jabatan: "Bendahara", nama: "Nama Pengurus" },
  ],
  divisi: [
    { jabatan: "Divisi Kegiatan", nama: "Nama Pengurus" },
    { jabatan: "Divisi Sosial", nama: "Nama Pengurus" },
    { jabatan: "Divisi Humas", nama: "Nama Pengurus" },
    { jabatan: "Divisi Kreatif & Dokumentasi", nama: "Nama Pengurus" },
  ],
};