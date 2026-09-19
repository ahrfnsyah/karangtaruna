"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActivityFormState } from "@/components/admin/activity-form";
import { ACTIVITY_CATEGORIES } from "@/lib/activity-categories";
import { getCurrentUser, isAdminEmail } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const CATEGORY_SET = new Set<string>(ACTIVITY_CATEGORIES);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ActivityFields = {
  title: string;
  slug: string;
  category: string;
  event_date: string;
  location: string | null;
  excerpt: string | null;
  description: string;
  status: string | null;
  image_path: string | null;
  image_alt: string;
  program_id: string | null;
  is_published: boolean;
};

type ParseResult = { ok: true; values: ActivityFields } | { ok: false; error: string };

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseActivityForm(formData: FormData): ParseResult {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim().toLowerCase();
  const category = String(formData.get("category") ?? "").trim();
  const event_date = String(formData.get("event_date") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const image_path = String(formData.get("image_path") ?? "").trim();
  const image_alt = String(formData.get("image_alt") ?? "").trim();
  const program_id = String(formData.get("program_id") ?? "").trim();
  const is_published = formData.get("is_published") === "on";

  if (!title) {
    return { ok: false, error: "Judul kegiatan wajib diisi." };
  }
  if (title.length > 120) {
    return { ok: false, error: "Judul kegiatan terlalu panjang (maksimal 120 karakter)." };
  }

  const slug = slugInput || slugify(title);
  if (!SLUG_PATTERN.test(slug)) {
    return {
      ok: false,
      error: "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-) sebagai pemisah kata.",
    };
  }

  if (!CATEGORY_SET.has(category)) {
    return { ok: false, error: "Kategori yang dipilih tidak valid." };
  }
  if (!DATE_PATTERN.test(event_date)) {
    return { ok: false, error: "Tanggal kegiatan wajib diisi dengan format yang valid." };
  }
  if (!description) {
    return { ok: false, error: "Deskripsi kegiatan wajib diisi." };
  }
  if (description.length > 5000) {
    return { ok: false, error: "Deskripsi terlalu panjang (maksimal 5000 karakter)." };
  }
  if (location.length > 200) {
    return { ok: false, error: "Lokasi terlalu panjang (maksimal 200 karakter)." };
  }
  if (excerpt.length > 500) {
    return { ok: false, error: "Ringkasan terlalu panjang (maksimal 500 karakter)." };
  }
  if (status.length > 100) {
    return { ok: false, error: "Status terlalu panjang (maksimal 100 karakter)." };
  }
  if (image_path.length > 500) {
    return { ok: false, error: "Path gambar terlalu panjang (maksimal 500 karakter)." };
  }
  if (image_alt.length > 300) {
    return { ok: false, error: "Alt gambar terlalu panjang (maksimal 300 karakter)." };
  }
  if (program_id && !UUID_PATTERN.test(program_id)) {
    return { ok: false, error: "Program terhubung tidak valid." };
  }

  return {
    ok: true,
    values: {
      title,
      slug,
      category,
      event_date,
      location: location || null,
      excerpt: excerpt || null,
      description,
      status: status || null,
      image_path: image_path || null,
      image_alt,
      program_id: program_id || null,
      is_published,
    },
  };
}

async function requireAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null && isAdminEmail(user.email);
}

async function slugExists(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const { data } = await supabase.from("activities").select("id").eq("slug", slug).limit(1);
  const rows = (data ?? []) as { id: string }[];
  const conflicting = excludeId ? rows.filter((row) => row.id !== excludeId) : rows;
  return conflicting.length > 0;
}

export async function createActivity(
  _prevState: ActivityFormState,
  formData: FormData,
): Promise<ActivityFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const parsed = parseActivityForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();

  if (await slugExists(supabase, parsed.values.slug)) {
    return { error: "Slug sudah dipakai kegiatan lain. Gunakan slug yang berbeda." };
  }

  const { error } = await supabase.from("activities").insert({
    slug: parsed.values.slug,
    title: parsed.values.title,
    category: parsed.values.category,
    event_date: parsed.values.event_date,
    location: parsed.values.location,
    excerpt: parsed.values.excerpt,
    description: parsed.values.description,
    status: parsed.values.status,
    image_path: parsed.values.image_path,
    image_alt: parsed.values.image_alt,
    program_id: parsed.values.program_id,
    is_published: parsed.values.is_published,
  });

  if (error) {
    console.error("Gagal menambah kegiatan:", error.message);
    return { error: "Kegiatan gagal disimpan. Silakan coba lagi." };
  }

  revalidatePath("/kegiatan");
  revalidatePath("/kegiatan/[slug]");
  redirect("/admin/kegiatan");
}

export async function updateActivity(
  _prevState: ActivityFormState,
  formData: FormData,
): Promise<ActivityFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Data tidak lengkap. Silakan muat ulang halaman." };
  }

  const parsed = parseActivityForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("activities")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Kegiatan tidak ditemukan. Silakan muat ulang halaman." };
  }

  if (await slugExists(supabase, parsed.values.slug, id)) {
    return { error: "Slug sudah dipakai kegiatan lain. Gunakan slug yang berbeda." };
  }

  const { error } = await supabase
    .from("activities")
    .update({
      slug: parsed.values.slug,
      title: parsed.values.title,
      category: parsed.values.category,
      event_date: parsed.values.event_date,
      location: parsed.values.location,
      excerpt: parsed.values.excerpt,
      description: parsed.values.description,
      status: parsed.values.status,
      image_path: parsed.values.image_path,
      image_alt: parsed.values.image_alt,
      program_id: parsed.values.program_id,
      is_published: parsed.values.is_published,
    })
    .eq("id", id);

  if (error) {
    console.error("Gagal memperbarui kegiatan:", error.message);
    return { error: "Kegiatan gagal diperbarui. Silakan coba lagi." };
  }

  revalidatePath("/kegiatan");
  revalidatePath("/kegiatan/[slug]");
  redirect("/admin/kegiatan");
}

export async function deleteActivity(
  _prevState: ActivityFormState,
  formData: FormData,
): Promise<ActivityFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Data tidak lengkap. Silakan muat ulang halaman." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("activities")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Kegiatan tidak ditemukan. Silakan muat ulang halaman." };
  }

  const { error } = await supabase.from("activities").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus kegiatan:", error.message);
    return { error: "Kegiatan gagal dihapus. Silakan coba lagi." };
  }

  revalidatePath("/kegiatan");
  revalidatePath("/kegiatan/[slug]");
  redirect("/admin/kegiatan");
}