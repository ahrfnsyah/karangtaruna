alter table public.site_settings
  add column if not exists hero_image_path text,
  add column if not exists hero_image_alt text;

comment on column public.site_settings.hero_image_path
  is 'Public URL/path gambar hero homepage dari Supabase Storage bucket media.';

comment on column public.site_settings.hero_image_alt
  is 'Alt text untuk gambar hero homepage.';