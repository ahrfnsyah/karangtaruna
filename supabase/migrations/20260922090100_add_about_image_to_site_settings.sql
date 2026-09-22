alter table public.site_settings
  add column if not exists about_image_path text,
  add column if not exists about_image_alt text;

comment on column public.site_settings.about_image_path
  is 'Public URL/path gambar section Tentang Kami di homepage dari Supabase Storage bucket media.';

comment on column public.site_settings.about_image_alt
  is 'Alt text untuk gambar section Tentang Kami di homepage.';