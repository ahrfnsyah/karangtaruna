# Karang Taruna RT 04 RW 08 Srengseng Sawah

Website profil untuk Karang Taruna RT 04 RW 08 Srengseng Sawah, Jagakarsa, Jakarta Selatan. Berisi informasi organisasi, kegiatan, berita, galeri, dan kontak.

> **Catatan penting:** seluruh konten (statistik, kegiatan, berita, galeri, pengurus, dan kontak) masih berupa **placeholder pengembangan**. Data belum merupakan fakta resmi organisasi dan ditandai dengan komentar di masing-masing file `lib/data/*.ts`. Formulir kontak juga belum terhubung ke backend.

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) — `next@16.3.5`
- React 19
- TypeScript (strict)
- Tailwind CSS v4 (CSS-first, konfigurasi tema di `app/globals.css`)
- ESLint 9 (`eslint-config-next`)
- Tanpa dependency tambahan di luar stack di atas.

## Menjalankan Project

Prasyarat: Node.js 20+ dan npm.

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Perintah lain:

```bash
npm run build   # build produksi + type checking
npm run start   # menjalankan hasil build
npm run lint    # ESLint
npx tsc --noEmit  # type checking tanpa build
```

## Variabel Lingkungan

Tidak ada variabel yang wajib untuk pengembangan lokal. Untuk build produksi, isi:

```bash
NEXT_PUBLIC_SITE_URL=https://domain-anda.example
```

Nilai ini dipakai sebagai `metadataBase` untuk canonical dan Open Graph, serta untuk `sitemap.xml` dan `robots.txt`. Tanpa variabel ini, URL fallback `http://localhost:3000` digunakan (hanya untuk pengembangan). File `.env*` tidak ikut di-commit.

### Auth admin (server-only)

```bash
ADMIN_EMAILS=admin@contoh.com
```

Allowlist email admin (dipisahkan koma) yang boleh mengakses `/admin`. Hanya dibaca di server; jangan beri prefix `NEXT_PUBLIC_`. Jika kosong/tidak diatur, akses admin ditolak (fail-closed). Akun dibuat/dikelola melalui Supabase Auth (Dashboard), bukan lewat halaman registrasi publik.

## Autentikasi Admin

- `/admin/login` — login email + password via Supabase Auth (Server Action, sesi di cookie).
- `/admin` — halaman placeholder "Admin Panel" (authentication + authorization). Belum ada CRUD.
- Proteksi: `proxy.ts` (Next 16) menangani refresh sesi dan redirect untuk `/admin/*`; `app/admin/(protected)/layout.tsx` memverifikasi sesi + keanggotaan admin server-side.
- `SUPABASE_SERVICE_ROLE_KEY` tidak dipakai untuk autentikasi/sesi; hanya untuk operasi server (sitemap, seed/migrasi).

## Struktur Halaman

| Route | Deskripsi | Tipe |
| --- | --- | --- |
| `/` | Beranda: hero, profil singkat, statistik, program, kegiatan terbaru, galeri, CTA | Statis |
| `/tentang` | Profil, visi, misi, nilai, struktur, peran | Statis |
| `/program-kerja` | Daftar bidang/program dan program unggulan | Statis |
| `/kegiatan` | Daftar kegiatan + filter kategori | Statis |
| `/kegiatan/[slug]` | Detail kegiatan | SSG (8 slug) |
| `/berita` | Berita utama + daftar berita + filter kategori | Statis |
| `/berita/[slug]` | Detail berita | SSG (8 slug) |
| `/galeri` | Galeri foto + filter kategori | Statis |
| `/kontak` | Informasi kontak, formulir, lokasi, media sosial | Statis |
| `*` | Halaman 404 | Statis |

`/kegiatan/[slug]` dan `/berita/[slug]` memakai `generateStaticParams`, `generateMetadata`, dan `notFound()`.

## Struktur Folder

```
app/                 # Routing, layout, metadata, sitemap/robots, globals.css
components/
  layout/            # Navbar, footer
  ui/                # Design system (button, card, badge, section, icons, dll.)
  home/ tentang/ program-kerja/ kegiatan/ berita/ galeri/ kontak/
lib/
  data/              # Sumber data placeholder per halaman
  icons.ts           # Registry ikon
  metadata.ts        # Helper metadata halaman
  navigation.ts      # Item navigasi
  site.ts            # Konfigurasi situs (nama, URL, deskripsi)
  utils.ts           # cn() dan formatTanggal()
public/images/placeholders/  # Gambar SVG placeholder
```

## Design System

- Tema Tailwind v4 didefinisikan di `app/globals.css` melalui `@theme` (warna primer hijau, aksen merah, tipografi `text-display`/`text-h1`–`h4`, radius, shadow).
- Komponen reusable: `Button`/`LinkButton`, `Card` (+ bagiannya), `Badge`, `Container`, `Section`, `SectionHeading`, `PageHero`.
- Ikon berupa SVG inline di `components/ui/icons.tsx`, dipetakan lewat `lib/icons.ts`.
- Tidak ada `tailwind.config.*`; konfigurasi dilakukan di CSS.

## Status Fitur

Sudah selesai (frontend, konten placeholder):

- Design system dan app shell (navbar, footer, skip link).
- Semua halaman publik beserta metadata SEO (title, description, canonical, Open Graph), `sitemap.xml`, dan `robots.txt`.
- Filter kategori di sisi klien pada Kegiatan, Berita, dan Galeri.
- Aksesibilitas dasar: hierarki heading, focus state, alt gambar, validasi formulir dengan `aria-invalid`/`aria-describedby`.
- Halaman 404 global dan per-segmen.
- Autentikasi admin email + password via Supabase Auth (`/admin/login`) dengan authorized admin area `/admin` (placeholder authentication verification, belum ada CRUD).

## Fitur yang Belum Menggunakan Backend

- **Formulir kontak** (`/kontak`): validasi berjalan di sisi klien dan hanya menampilkan pesan konfirmasi. Data tidak dikirim, tidak disimpan, dan tidak dikirim melalui email.
- **Seluruh data konten** (`lib/data/*.ts`): masih statis/placeholder, belum diambil dari database.
- **Media sosial dan peta lokasi**: belum aktif, masih berupa tampilan "segera tersedia" dan placeholder peta.
- **Autentikasi dan admin dashboard**: autentikasi admin (`/admin/login`) dan area admin terlindungi sudah ada sebagai placeholder verification. Admin dashboard CRUD belum ada.

## Roadmap Berikutnya

1. Integrasi Supabase sebagai sumber data (menggantikan data statis di `lib/data`).
2. Admin dashboard untuk mengelola konten.
3. Testing (mis. Playwright) dan deploy produksi.
