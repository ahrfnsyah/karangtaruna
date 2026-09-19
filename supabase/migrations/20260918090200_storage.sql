-- =============================================================================
-- Karang Taruna RT 04 RW 08 Srengseng Sawah
-- STEP 21 — Storage
--
-- Satu bucket publik "media" untuk gambar berita, kegiatan, galeri, dan site.
--   * Baca: publik (bucket public + policy SELECT).
--   * Tulis: hanya admin/editor (policy INSERT/UPDATE/DELETE + public.is_admin()).
--   * Batas: 5 MB, hanya JPEG/PNG/WebP/AVIF. SVG SENGAJA tidak diizinkan
--     (SVG bisa berisi script), sehingga gambar placeholder SVG tetap lokal
--     di public/images/placeholders dan tidak diunggah ke Storage.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- storage.objects policies
-- -----------------------------------------------------------------------------
drop policy if exists "Media is publicly readable" on storage.objects;
create policy "Media is publicly readable"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "Admins can upload media" on storage.objects;
create policy "Admins can upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins can update media" on storage.objects;
create policy "Admins can update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admins can delete media" on storage.objects;
create policy "Admins can delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
