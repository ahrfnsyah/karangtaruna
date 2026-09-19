"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { NewsFormState } from "@/components/admin/news-form";
import { getCurrentUser, isAdminEmail } from "@/lib/auth";
import { NEWS_CATEGORIES } from "@/lib/news-categories";
import { createClient } from "@/lib/supabase/server";

const CATEGORY_SET = new Set<string>(NEWS_CATEGORIES);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_PARAGRAPHS = 50;
const MAX_PARAGRAPH_LENGTH = 2000;

// Konsisten dengan pola seed: tanggal date-only disimpan tengah malam WIB.
const WIB_MIDNIGHT_SUFFIX = "T00:00:00+07:00";

type NewsFields = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string[];
  author: string;
  published_at: string;
  image_path: string | null;
  image_alt: string;
  is_featured: boolean;
  is_published: boolean;
};

type ParseResult = { ok: true; values: NewsFields } | { ok: false; error: string };

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseNewsForm(formData: FormData): ParseResult {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim().toLowerCase();
  const category = String(formData.get("category") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const contentRaw = String(formData.get("content") ?? "");
  const author = String(formData.get("author") ?? "").trim();
  const published_at = String(formData.get("published_at") ?? "").trim();
  const image_path = String(formData.get("image_path") ?? "").trim();
  const image_alt = String(formData.get("image_alt") ?? "").trim();
  const is_featured = formData.get("is_featured") === "on";
  const is_published = formData.get("is_published") === "on";

  if (!title) {
    return { ok: false, error: "Judul berita wajib diisi." };
  }
  if (title.length > 160) {
    return { ok: false, error: "Judul berita terlalu panjang (maksimal 160 karakter)." };
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
  if (!excerpt) {
    return { ok: false, error: "Ringkasan (excerpt) berita wajib diisi." };
  }
  if (excerpt.length > 500) {
    return { ok: false, error: "Ringkasan terlalu panjang (maksimal 500 karakter)." };
  }

  const content = contentRaw
    .split(/\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
  if (content.length === 0) {
    return { ok: false, error: "Isi berita wajib diisi minimal satu paragraf." };
  }
  if (content.length > MAX_PARAGRAPHS) {
    return { ok: false, error: `Isi berita terlalu banyak paragraf (maksimal ${MAX_PARAGRAPHS}).` };
  }
  const tooLong = content.find((paragraph) => paragraph.length > MAX_PARAGRAPH_LENGTH);
  if (tooLong) {
    return {
      ok: false,
      error: `Ada paragraf terlalu panjang (maksimal ${MAX_PARAGRAPH_LENGTH} karakter per paragraf).`,
    };
  }

  if (author.length > 100) {
    return { ok: false, error: "Penulis terlalu panjang (maksimal 100 karakter)." };
  }
  if (!DATE_PATTERN.test(published_at)) {
    return { ok: false, error: "Tanggal terbit wajib diisi dengan format yang valid." };
  }
  if (image_path.length > 500) {
    return { ok: false, error: "Path gambar terlalu panjang (maksimal 500 karakter)." };
  }
  if (image_alt.length > 300) {
    return { ok: false, error: "Alt gambar terlalu panjang (maksimal 300 karakter)." };
  }

  return {
    ok: true,
    values: {
      title,
      slug,
      category,
      excerpt,
      content,
      author,
      published_at: `${published_at}${WIB_MIDNIGHT_SUFFIX}`,
      image_path: image_path || null,
      image_alt,
      is_featured,
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
  const { data } = await supabase.from("news").select("id").eq("slug", slug).limit(1);
  const rows = (data ?? []) as { id: string }[];
  const conflicting = excludeId ? rows.filter((row) => row.id !== excludeId) : rows;
  return conflicting.length > 0;
}

export async function createNewsItem(
  _prevState: NewsFormState,
  formData: FormData,
): Promise<NewsFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const parsed = parseNewsForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();

  if (await slugExists(supabase, parsed.values.slug)) {
    return { error: "Slug sudah dipakai berita lain. Gunakan slug yang berbeda." };
  }

  const { error } = await supabase.from("news").insert({
    slug: parsed.values.slug,
    title: parsed.values.title,
    category: parsed.values.category,
    excerpt: parsed.values.excerpt,
    content: parsed.values.content,
    author: parsed.values.author,
    published_at: parsed.values.published_at,
    image_path: parsed.values.image_path,
    image_alt: parsed.values.image_alt,
    is_featured: parsed.values.is_featured,
    is_published: parsed.values.is_published,
  });

  if (error) {
    console.error("Gagal menambah berita:", error.message);
    return { error: "Berita gagal disimpan. Silakan coba lagi." };
  }

  revalidatePath("/berita");
  revalidatePath("/berita/[slug]");
  redirect("/admin/berita");
}

export async function updateNewsItem(
  _prevState: NewsFormState,
  formData: FormData,
): Promise<NewsFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Data tidak lengkap. Silakan muat ulang halaman." };
  }

  const parsed = parseNewsForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("news")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Berita tidak ditemukan. Silakan muat ulang halaman." };
  }

  if (await slugExists(supabase, parsed.values.slug, id)) {
    return { error: "Slug sudah dipakai berita lain. Gunakan slug yang berbeda." };
  }

  const { error } = await supabase
    .from("news")
    .update({
      slug: parsed.values.slug,
      title: parsed.values.title,
      category: parsed.values.category,
      excerpt: parsed.values.excerpt,
      content: parsed.values.content,
      author: parsed.values.author,
      published_at: parsed.values.published_at,
      image_path: parsed.values.image_path,
      image_alt: parsed.values.image_alt,
      is_featured: parsed.values.is_featured,
      is_published: parsed.values.is_published,
    })
    .eq("id", id);

  if (error) {
    console.error("Gagal memperbarui berita:", error.message);
    return { error: "Berita gagal diperbarui. Silakan coba lagi." };
  }

  revalidatePath("/berita");
  revalidatePath("/berita/[slug]");
  redirect("/admin/berita");
}

export async function deleteNewsItem(
  _prevState: NewsFormState,
  formData: FormData,
): Promise<NewsFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Data tidak lengkap. Silakan muat ulang halaman." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("news")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Berita tidak ditemukan. Silakan muat ulang halaman." };
  }

  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus berita:", error.message);
    return { error: "Berita gagal dihapus. Silakan coba lagi." };
  }

  revalidatePath("/berita");
  revalidatePath("/berita/[slug]");
  redirect("/admin/berita");
}