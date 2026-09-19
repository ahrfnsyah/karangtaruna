"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser, isAdminEmail } from "@/lib/auth";
import {
  ABOUT_ICON_SET,
  ABOUT_SECTION_SET,
  SORT_ORDER_PATTERN,
  TEAM_GROUP_SET,
  parseStatForm,
} from "@/lib/tentang-admin";
import { iconMap } from "@/lib/icons";
import { createClient } from "@/lib/supabase/server";

/* =============================================================================
 * Server Actions CRUD halaman "Tentang Kami" (/tentang).
 *
 * Mencakup empat tabel yang membentuk halaman publik:
 *   - site_settings (singleton id=1) → profil + visi + bagian paragraf
 *   - about_items                    → misi / nilai / peran (section)
 *   - team_members                   → pengurus (grup "pengurus" / "divisi")
 *
 * Setiap aksi menerapkan pola yang sudah dipakai modul kegiatan/galeri:
 * 1) Validasi sesi admin server-side (requireAdmin) sebelum apa pun.
 * 2) Parse + validasi input (title/description/icon/section/sort_order,
 *    is_published) secara ketat.
 * 3) Insert/update/delete ke Supabase; error → return pesan.
 * 4) revalidatePath("/tentang") + redirect("/admin/tentang") pada sukses.
 * ========================================================================== */

type TentangFormState = {
  error: string | null;
};

function formatError(error: string): TentangFormState {
  return { error };
}

async function requireAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null && isAdminEmail(user.email);
}

/* ----------------------------------------------------------------------------
 * site_settings (singleton)
 * ------------------------------------------------------------------------- */

type SiteSettingsValues = {
  vision: string;
  about_paragraphs: string[];
};

function parseSiteSettings(formData: FormData): { ok: true; values: SiteSettingsValues } | { ok: false; error: string } {
  const vision = String(formData.get("vision") ?? "").trim();
  if (vision.length > 2000) {
    return { ok: false, error: "Visi terlalu panjang (maksimal 2000 karakter)." };
  }

  const about_paragraphs = String(formData.get("about_paragraphs") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (about_paragraphs.length < 1) {
    return { ok: false, error: "Paragraf profil wajib diisi." };
  }
  if (about_paragraphs.length > 20) {
    return { ok: false, error: "Paragraf profil terlalu banyak (maksimal 20 paragraf)." };
  }

  return { ok: true, values: { vision, about_paragraphs } };
}

export async function updateSiteSettings(
  _prevState: TentangFormState,
  formData: FormData,
): Promise<TentangFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const parsed = parseSiteSettings(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("site_settings")
    .update({
      vision: parsed.values.vision,
      about_paragraphs: parsed.values.about_paragraphs,
    })
    .eq("id", 1);

  if (error) {
    console.error("Gagal memperbarui pengaturan situs:", error.message);
    return { error: "Pengaturan gagal disimpan. Silakan coba lagi." };
  }

  revalidatePath("/tentang");
  redirect("/admin/tentang");
}

/* ----------------------------------------------------------------------------
 * about_items
 * ------------------------------------------------------------------------- */

type AboutItemValues = {
  section: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  is_published: boolean;
};

function parseSortOrder(raw: string): number | null {
  const value = raw.trim();
  if (!SORT_ORDER_PATTERN.test(value)) {
    return null;
  }
  const number = Number(value);
  return Number.isSafeInteger(number) ? number : null;
}

function parseAboutItem(formData: FormData): { ok: true; values: AboutItemValues } | { ok: false; error: string } {
  const section = String(formData.get("section") ?? "").trim();
  if (!ABOUT_SECTION_SET.has(section)) {
    return { ok: false, error: "Section yang dipilih tidak valid." };
  }

  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return { ok: false, error: "Judul wajib diisi." };
  }
  if (title.length > 200) {
    return { ok: false, error: "Judul terlalu panjang (maksimal 200 karakter)." };
  }

  const description = String(formData.get("description") ?? "").trim();
  if (!description) {
    return { ok: false, error: "Deskripsi wajib diisi." };
  }
  if (description.length > 5000) {
    return { ok: false, error: "Deskripsi terlalu panjang (maksimal 5000 karakter)." };
  }

  const icon = String(formData.get("icon") ?? "").trim();
  if (!ABOUT_ICON_SET.has(icon)) {
    return { ok: false, error: "Ikon yang dipilih tidak valid." };
  }

  const sort_order = parseSortOrder(String(formData.get("sort_order") ?? ""));
  if (sort_order === null) {
    return { ok: false, error: "Urutan harus berupa bilangan bulat." };
  }

  return {
    ok: true,
    values: {
      section,
      title,
      description,
      icon,
      sort_order,
      is_published: formData.get("is_published") === "on",
    },
  };
}

export async function createAboutItem(
  _prevState: TentangFormState,
  formData: FormData,
): Promise<TentangFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const parsed = parseAboutItem(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("about_items").insert(parsed.values);

  if (error) {
    console.error("Gagal menambah item tentang:", error.message);
    return { error: "Item gagal disimpan. Silakan coba lagi." };
  }

  revalidatePath("/tentang");
  redirect("/admin/tentang");
}

export async function updateAboutItem(
  _prevState: TentangFormState,
  formData: FormData,
): Promise<TentangFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Data tidak lengkap. Silakan muat ulang halaman." };
  }

  const parsed = parseAboutItem(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("about_items")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Item tidak ditemukan. Silakan muat ulang halaman." };
  }

  const { error } = await supabase
    .from("about_items")
    .update(parsed.values)
    .eq("id", id);

  if (error) {
    console.error("Gagal memperbarui item tentang:", error.message);
    return { error: "Item gagal diperbarui. Silakan coba lagi." };
  }

  revalidatePath("/tentang");
  redirect("/admin/tentang");
}

export async function deleteAboutItem(
  _prevState: TentangFormState,
  formData: FormData,
): Promise<TentangFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Data tidak lengkap. Silakan muat ulang halaman." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("about_items")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Item tidak ditemukan. Silakan muat ulang halaman." };
  }

  const { error } = await supabase.from("about_items").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus item tentang:", error.message);
    return { error: "Item gagal dihapus. Silakan coba lagi." };
  }

  revalidatePath("/tentang");
  redirect("/admin/tentang");
}

/* ----------------------------------------------------------------------------
 * team_members
 * ------------------------------------------------------------------------- */

type TeamMemberValues = {
  name: string;
  position: string;
  group_name: string;
  sort_order: number;
  is_active: boolean;
};

function parseTeamMember(formData: FormData): { ok: true; values: TeamMemberValues } | { ok: false; error: string } {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { ok: false, error: "Nama wajib diisi." };
  }
  if (name.length > 120) {
    return { ok: false, error: "Nama terlalu panjang (maksimal 120 karakter)." };
  }

  const position = String(formData.get("position") ?? "").trim();
  if (!position) {
    return { ok: false, error: "Jabatan wajib diisi." };
  }
  if (position.length > 200) {
    return { ok: false, error: "Jabatan terlalu panjang (maksimal 200 karakter)." };
  }

  const group_name = String(formData.get("group_name") ?? "").trim();
  if (!TEAM_GROUP_SET.has(group_name)) {
    return { ok: false, error: "Kelompok yang dipilih tidak valid." };
  }

  const sort_order = parseSortOrder(String(formData.get("sort_order") ?? ""));
  if (sort_order === null) {
    return { ok: false, error: "Urutan harus berupa bilangan bulat." };
  }

  return {
    ok: true,
    values: {
      name,
      position,
      group_name,
      sort_order,
      is_active: formData.get("is_active") === "on",
    },
  };
}

export async function createTeamMember(
  _prevState: TentangFormState,
  formData: FormData,
): Promise<TentangFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const parsed = parseTeamMember(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("team_members").insert(parsed.values);

  if (error) {
    console.error("Gagal menambah pengurus:", error.message);
    return { error: "Pengurus gagal disimpan. Silakan coba lagi." };
  }

  revalidatePath("/tentang");
  redirect("/admin/tentang");
}

export async function updateTeamMember(
  _prevState: TentangFormState,
  formData: FormData,
): Promise<TentangFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Data tidak lengkap. Silakan muat ulang halaman." };
  }

  const parsed = parseTeamMember(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("team_members")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Pengurus tidak ditemukan. Silakan muat ulang halaman." };
  }

  const { error } = await supabase
    .from("team_members")
    .update(parsed.values)
    .eq("id", id);

  if (error) {
    console.error("Gagal memperbarui pengurus:", error.message);
    return { error: "Pengurus gagal diperbarui. Silakan coba lagi." };
  }

  revalidatePath("/tentang");
  redirect("/admin/tentang");
}

export async function deleteTeamMember(
  _prevState: TentangFormState,
  formData: FormData,
): Promise<TentangFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Data tidak lengkap. Silakan muat ulang halaman." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("team_members")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Pengurus tidak ditemukan. Silakan muat ulang halaman." };
  }

  const { error } = await supabase.from("team_members").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus pengurus:", error.message);
    return { error: "Pengurus gagal dihapus. Silakan coba lagi." };
  }

  revalidatePath("/tentang");
  redirect("/admin/tentang");
}

/*
 * revalidate iconMap agar tidak "unused import" — dipakai validasi ikon lewat
 * ABOUT_ICON_SET yang diimpor dari lib/tentang-admin; iconMap dipertahankan
 * sebagai referensi visual tombol edit.
 */
void iconMap;
export async function createStat(
  prevState: TentangFormState,
  formData: FormData,
): Promise<TentangFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const label = String(formData.get("label") ?? "").trim();
  const value = String(formData.get("value") ?? "").trim();
  const sortOrder = String(formData.get("sort_order") ?? "").trim();
  const isPublished = formData.get("is_published") === "on";

  const parsed = parseStatForm({
    label,
    value,
    sortOrder,
    isPublished,
  });
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("stats").insert(parsed.values);

  if (error) {
    console.error("Gagal menambah statistik:", error.message);
    return { error: "Statistik gagal disimpan. Silakan coba lagi." };
  }

  revalidatePath("/admin/tentang");
  revalidatePath("/tentang");
  redirect("/admin/tentang");
}

export async function updateStat(
  prevState: TentangFormState,
  formData: FormData,
): Promise<TentangFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const id = String(formData.get("id") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const value = String(formData.get("value") ?? "").trim();
  const sortOrder = String(formData.get("sort_order") ?? "").trim();
  const isPublished = formData.get("is_published") === "on";

  const parsed = parseStatForm({ label, value, sortOrder, isPublished });
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("stats")
    .update(parsed.values)
    .eq("id", id);

  if (error) {
    console.error("Gagal memperbarui statistik:", error.message);
    return { error: "Statistik gagal disimpan. Silakan coba lagi." };
  }

  revalidatePath("/admin/tentang");
  revalidatePath("/tentang");
  redirect("/admin/tentang");
}

export async function deleteStat(
  prevState: TentangFormState,
  formData: FormData,
): Promise<TentangFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Data tidak lengkap. Silakan muat ulang halaman." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("stats").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus statistik:", error.message);
    return { error: "Statistik gagal dihapus. Silakan coba lagi." };
  }

  revalidatePath("/admin/tentang");
  revalidatePath("/tentang");
  redirect("/admin/tentang");
}
