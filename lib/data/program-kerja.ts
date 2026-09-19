/*
 * Back-up / referensi selama migrasi data ke Supabase (STEP 22-23).
 * Halaman /program-kerja sekarang membaca public.programs.
 * File ini tidak dihapus dan tetap dipertahankan sebagai referensi;
 * jangan digunakan sebagai sumber data runtime pada halaman /program-kerja.
 *
 * Daftar program kerja di bawah ini adalah CONTENT PLACEHOLDER.
 * Jangan dianggap sebagai program resmi yang sudah dijalankan
 * Karang Taruna. Ganti dengan program kerja resmi saat tersedia.
 */

import type { IconName } from "@/lib/icons";

export type ProgramKerja = {
  icon: IconName;
  kategori: string;
  judul: string;
  deskripsi: string;
  // Status placeholder — sesuaikan dengan program kerja resmi.
  status: string;
  // Penerima manfaat / target.
  target: string;
  unggulan: boolean;
};

export const programKerja: ProgramKerja[] = [
  {
    icon: "users",
    kategori: "Kepemudaan",
    judul: "Wadah Kepemudaan & Kepeloporan",
    deskripsi:
      "Menghidupkan peran pemuda sebagai pelopor kegiatan positif dan agen perubahan di lingkungan.",
    status: "Program Tahunan",
    target: "Pemuda RT 04 RW 08",
    unggulan: false,
  },
  {
    icon: "lightbulb",
    kategori: "Kreativitas & Kewirausahaan",
    judul: "Pengembangan Kreativitas Pemuda",
    deskripsi:
      "Melatih daya cipta dan inovasi pemuda melalui pelatihan, lokakarya, dan kegiatan karya kreatif.",
    status: "Program Tahunan",
    target: "Pemuda dan pelajar sekitar",
    unggulan: true,
  },
  {
    icon: "heart",
    kategori: "Sosial & Masyarakat",
    judul: "Kegiatan Sosial Masyarakat",
    deskripsi:
      "Kegiatan peduli sosial seperti santunan, bantuan warga, dan aksi berbagi bersama masyarakat.",
    status: "Program Berkala",
    target: "Warga yang membutuhkan",
    unggulan: true,
  },
  {
    icon: "trophy",
    kategori: "Olahraga",
    judul: "Pembinaan Olahraga Pemuda",
    deskripsi:
      "Latihan rutin dan turnamen untuk menumbuhkan kebugaran, sportivitas, dan kebersamaan.",
    status: "Program Tahunan",
    target: "Pemuda dan warga",
    unggulan: false,
  },
  {
    icon: "shield-check",
    kategori: "Kreativitas & Kewirausahaan",
    judul: "Pelatihan Keterampilan",
    deskripsi:
      "Pelatihan keterampilan praktis yang membekali pemuda dengan kemampuan kerja dan berwirausaha.",
    status: "Program Berkala",
    target: "Pemuda sekitar RT 04 RW 08",
    unggulan: true,
  },
  {
    icon: "leaf",
    kategori: "Lingkungan",
    judul: "Kegiatan Peduli Lingkungan",
    deskripsi:
      "Aksi kebersihan, penghijauan, dan kampanye lingkungan untuk menjaga lingkungan tetap asri.",
    status: "Program Berkala",
    target: "Lingkungan dan warga",
    unggulan: false,
  },
];