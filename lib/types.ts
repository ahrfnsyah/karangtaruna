/*
 * Type hasil query Supabase yang digunakan lintas halaman.
 * Menyesuaikan kolom tabel public.programs.
 */
export type ProgramKerjaItem = {
  title: string;
  category: string;
  description: string;
  status: string | null;
  target: string | null;
  icon: string;
  is_featured: boolean;
  sort_order: number;
};

/*
 * Type hasil query Supabase untuk halaman kegiatan.
 * Kolom description/status hanya di-select di halaman detail, sehingga dibuat
 * opsional agar hasil query list yang lebih ramping tetap aman secara tipe.
 */
export type KegiatanItem = {
  slug: string;
  title: string;
  category: string;
  event_date: string;
  location: string | null;
  excerpt: string | null;
  image_path: string | null;
  image_alt: string;
  description?: string | null;
  status?: string | null;
};

export type BeritaItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: string;
  published_at: string;
  image_path: string | null;
  image_alt: string;
  is_featured: boolean;
  is_published: boolean;
};

/*
 * Type hasil query Supabase untuk halaman galeri.
 * description tidak dipakai UI, sehingga tidak di-select.
 */
export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image_path: string | null;
  image_alt: string;
  taken_at: string | null;
  sort_order: number;
};

/*
 * Type hasil query Supabase untuk halaman /tentang.
 * tentang_items (about_items) menyimpan misi/nilai/peran dengan icon text;
 * team_members menyimpan pengurus; site_settings menyimpan visi & paragraf profil.
 */
export type TentangSectionItem = {
  title: string;
  description: string;
  icon: string;
};

export type PengurusItem = {
  jabatan: string;
  nama: string;
};

export type TentangData = {
  profile: string[];
  vision: string | null;
  missions: TentangSectionItem[];
  values: TentangSectionItem[];
  roles: TentangSectionItem[];
  stats: StatItem[];
  team: {
    kepengurusan: PengurusItem[];
    divisi: PengurusItem[];
  };
};

/*
 * Type hasil query Supabase untuk halaman /kontak.
 * Informasi kontak dari site_settings; kanal media sosial dari social_links.
 */
export type ContactInfo = {
  address: string;
  email: string;
  phone: string;
  instagram: string | null;
};

export type SocialLink = {
  platform: string;
  label: string;
  url: string | null;
  is_active: boolean;
};

/*
 * Data minimum yang di-select homepage dari Supabase (per section).
 * ActivityPreviewItem & GalleryPreviewItem memang hanya memuat kolom yang
 * dipakai kartu pratinjau — bukan seluruh kolom tabel.
 */
export type StatItem = {
  value: string;
  label: string;
};

export type ActivityPreviewItem = {
  slug: string;
  title: string;
  category: string;
  event_date: string;
  excerpt: string | null;
  image_path: string | null;
  image_alt: string;
};

export type GalleryPreviewItem = {
  image_path: string | null;
  image_alt: string;
};