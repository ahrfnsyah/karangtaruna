-- =============================================================================
-- Karang Taruna RT 04 RW 08 Srengseng Sawah
-- STEP 21 — Initial schema
--
-- Membuat 11 tabel publik, constraint, index, dan trigger updated_at.
-- TIDAK ada data konten yang di-seed di sini (itu tugas STEP 22).
-- Satu-satunya baris yang dibuat adalah singleton site_settings (id = 1),
-- karena tabel ini hanya punya policy UPDATE sehingga barisnya harus ada.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Reusable trigger: set updated_at
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role text not null default 'editor',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('admin', 'editor'))
);

create index if not exists profiles_role_idx on public.profiles (role);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- site_settings (singleton)
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id smallint primary key default 1,
  org_name text not null default '',
  short_name text not null default '',
  tagline text,
  address text not null default '',
  email text not null default '',
  phone text not null default '',
  vision text,
  about_paragraphs text[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- stats
-- -----------------------------------------------------------------------------
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stats_sort_order_idx on public.stats (sort_order);

drop trigger if exists set_stats_updated_at on public.stats;
create trigger set_stats_updated_at
  before update on public.stats
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- social_links
-- -----------------------------------------------------------------------------
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null unique,
  label text not null,
  url text,
  is_active boolean not null default false,
  sort_order integer not null default 0
);

create index if not exists social_links_sort_order_idx on public.social_links (sort_order);

-- -----------------------------------------------------------------------------
-- programs (Program Kerja)
-- -----------------------------------------------------------------------------
create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  description text not null,
  status text,
  target text,
  icon text not null default 'users',
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint programs_category_check check (
    category in (
      'Kepemudaan',
      'Kreativitas & Kewirausahaan',
      'Sosial & Masyarakat',
      'Olahraga',
      'Lingkungan'
    )
  )
);

create index if not exists programs_category_idx on public.programs (category);
create index if not exists programs_sort_order_idx on public.programs (sort_order);

drop trigger if exists set_programs_updated_at on public.programs;
create trigger set_programs_updated_at
  before update on public.programs
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- activities (Kegiatan)
-- -----------------------------------------------------------------------------
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  event_date date not null,
  location text,
  excerpt text,
  description text not null,
  status text,
  image_path text,
  image_alt text not null default '',
  program_id uuid references public.programs (id) on delete set null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint activities_category_check check (
    category in (
      'Kepemudaan',
      'Sosial',
      'Olahraga',
      'Lingkungan',
      'Kreativitas',
      'Masyarakat'
    )
  )
);

create index if not exists activities_event_date_idx on public.activities (event_date desc);
create index if not exists activities_category_idx on public.activities (category);
create index if not exists activities_program_id_idx on public.activities (program_id);

drop trigger if exists set_activities_updated_at on public.activities;
create trigger set_activities_updated_at
  before update on public.activities
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- news (Berita)
-- -----------------------------------------------------------------------------
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text[] not null default '{}',
  category text not null,
  author text not null default '',
  published_at timestamptz not null default now(),
  image_path text,
  image_alt text not null default '',
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint news_category_check check (
    category in (
      'Informasi',
      'Kegiatan',
      'Pengumuman',
      'Kepemudaan',
      'Masyarakat'
    )
  )
);

create index if not exists news_published_at_idx on public.news (published_at desc);
create index if not exists news_category_idx on public.news (category);

drop trigger if exists set_news_updated_at on public.news;
create trigger set_news_updated_at
  before update on public.news
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- gallery_items (Galeri)
-- -----------------------------------------------------------------------------
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text,
  image_path text,
  image_alt text not null default '',
  taken_at date,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gallery_items_category_check check (
    category in (
      'Kegiatan',
      'Sosial',
      'Olahraga',
      'Kepemudaan',
      'Lingkungan',
      'Kreativitas'
    )
  )
);

create index if not exists gallery_items_category_idx on public.gallery_items (category);
create index if not exists gallery_items_taken_at_idx on public.gallery_items (taken_at desc);

drop trigger if exists set_gallery_items_updated_at on public.gallery_items;
create trigger set_gallery_items_updated_at
  before update on public.gallery_items
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- about_items (Tentang Kami: misi / nilai / peran)
-- -----------------------------------------------------------------------------
create table if not exists public.about_items (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  title text not null default '',
  description text not null,
  icon text not null default 'users',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint about_items_section_check check (
    section in ('mission', 'value', 'role')
  )
);

create index if not exists about_items_section_sort_idx on public.about_items (section, sort_order);

drop trigger if exists set_about_items_updated_at on public.about_items;
create trigger set_about_items_updated_at
  before update on public.about_items
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- team_members (Pengurus)
-- -----------------------------------------------------------------------------
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Nama Pengurus',
  position text not null,
  group_name text not null default 'pengurus',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint team_members_group_check check (
    group_name in ('pengurus', 'divisi')
  )
);

create index if not exists team_members_group_sort_idx on public.team_members (group_name, sort_order);

drop trigger if exists set_team_members_updated_at on public.team_members;
create trigger set_team_members_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- contact_messages (Pesan Kontak)
-- -----------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  user_agent text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_is_read_idx on public.contact_messages (is_read);

-- -----------------------------------------------------------------------------
-- Trigger: buat profil otomatis saat user auth baru dibuat
--
-- Signup publik dinonaktifkan (dikonfigurasi di dashboard Supabase), jadi user
-- hanya dibuat oleh admin. Default role = 'editor', is_active = true agar akun
-- yang baru dibuat admin langsung bisa dipakai.
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, is_active)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'editor',
    true
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
