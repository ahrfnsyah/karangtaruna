-- =============================================================================
-- Karang Taruna RT 04 RW 08 Srengseng Sawah
-- STEP 21 — Row Level Security
--
-- Prinsip: DEFAULT DENY. RLS diaktifkan di semua tabel publik, lalu dibuka
-- seperlunya:
--   * anon / authenticated  : hanya boleh SELECT data yang sudah dipublikasikan.
--   * authenticated + admin : boleh mengelola seluruh data (CRUD).
--   * authenticated + admin : boleh melihat & mengelola semua pesan kontak,
--                             sedangkan anon hanya boleh INSERT (kirim pesan).
--   * profiles              : hanya boleh dibaca sendiri (atau oleh admin),
--                             dan hanya admin ('owner') yang boleh mengubah.
--
-- Fungsi helper memakai SECURITY DEFINER agar aman dari rekursi RLS saat
-- membaca public.profiles di dalam policy tabel itu sendiri.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Helper functions
-- -----------------------------------------------------------------------------
create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
    and p.is_active = true
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role() in ('admin', 'editor'), false);
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role() = 'admin', false);
$$;

grant execute on function public.current_role() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_owner() to anon, authenticated;

-- -----------------------------------------------------------------------------
-- Aktifkan RLS di semua tabel publik
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.stats enable row level security;
alter table public.social_links enable row level security;
alter table public.programs enable row level security;
alter table public.activities enable row level security;
alter table public.news enable row level security;
alter table public.gallery_items enable row level security;
alter table public.about_items enable row level security;
alter table public.team_members enable row level security;
alter table public.contact_messages enable row level security;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
drop policy if exists "Profiles are viewable by self or admin" on public.profiles;
create policy "Profiles are viewable by self or admin"
  on public.profiles for select to authenticated
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Owners manage profiles" on public.profiles;
create policy "Owners manage profiles"
  on public.profiles for all to authenticated
  using (public.is_owner())
  with check (public.is_owner());

-- -----------------------------------------------------------------------------
-- site_settings (baca publik, hanya admin yang mengubah)
-- -----------------------------------------------------------------------------
drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select to anon, authenticated
  using (true);

drop policy if exists "Admins update site settings" on public.site_settings;
create policy "Admins update site settings"
  on public.site_settings for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- stats
-- -----------------------------------------------------------------------------
drop policy if exists "Public can read published stats" on public.stats;
create policy "Public can read published stats"
  on public.stats for select to anon, authenticated
  using (is_published);

drop policy if exists "Admins manage stats" on public.stats;
create policy "Admins manage stats"
  on public.stats for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- social_links
-- -----------------------------------------------------------------------------
drop policy if exists "Public can read active social links" on public.social_links;
create policy "Public can read active social links"
  on public.social_links for select to anon, authenticated
  using (is_active);

drop policy if exists "Admins manage social links" on public.social_links;
create policy "Admins manage social links"
  on public.social_links for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- programs
-- -----------------------------------------------------------------------------
drop policy if exists "Public can read published programs" on public.programs;
create policy "Public can read published programs"
  on public.programs for select to anon, authenticated
  using (is_published);

drop policy if exists "Admins manage programs" on public.programs;
create policy "Admins manage programs"
  on public.programs for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- activities
-- -----------------------------------------------------------------------------
drop policy if exists "Public can read published activities" on public.activities;
create policy "Public can read published activities"
  on public.activities for select to anon, authenticated
  using (is_published);

drop policy if exists "Admins manage activities" on public.activities;
create policy "Admins manage activities"
  on public.activities for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- news
-- -----------------------------------------------------------------------------
drop policy if exists "Public can read published news" on public.news;
create policy "Public can read published news"
  on public.news for select to anon, authenticated
  using (is_published);

drop policy if exists "Admins manage news" on public.news;
create policy "Admins manage news"
  on public.news for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- gallery_items
-- -----------------------------------------------------------------------------
drop policy if exists "Public can read published gallery items" on public.gallery_items;
create policy "Public can read published gallery items"
  on public.gallery_items for select to anon, authenticated
  using (is_published);

drop policy if exists "Admins manage gallery items" on public.gallery_items;
create policy "Admins manage gallery items"
  on public.gallery_items for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- about_items
-- -----------------------------------------------------------------------------
drop policy if exists "Public can read published about items" on public.about_items;
create policy "Public can read published about items"
  on public.about_items for select to anon, authenticated
  using (is_published);

drop policy if exists "Admins manage about items" on public.about_items;
create policy "Admins manage about items"
  on public.about_items for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- team_members
-- -----------------------------------------------------------------------------
drop policy if exists "Public can read active team members" on public.team_members;
create policy "Public can read active team members"
  on public.team_members for select to anon, authenticated
  using (is_active);

drop policy if exists "Admins manage team members" on public.team_members;
create policy "Admins manage team members"
  on public.team_members for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- contact_messages
--
-- anon HANYA boleh INSERT (kirim pesan). Tidak ada policy SELECT/UPDATE/DELETE
-- untuk anon, sehingga pesan tidak bisa dibaca atau diubah oleh publik.
-- Validasi panjang dilakukan di policy sebagai lapisan pertahanan tambahan.
-- -----------------------------------------------------------------------------
drop policy if exists "Anyone can submit contact messages" on public.contact_messages;
create policy "Anyone can submit contact messages"
  on public.contact_messages for insert to anon, authenticated
  with check (
    char_length(btrim(name)) between 1 and 200
    and char_length(btrim(email)) between 3 and 320
    and char_length(btrim(subject)) between 1 and 300
    and char_length(btrim(message)) between 1 and 5000
    and is_read = false
  );

drop policy if exists "Admins manage contact messages" on public.contact_messages;
create policy "Admins manage contact messages"
  on public.contact_messages for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
