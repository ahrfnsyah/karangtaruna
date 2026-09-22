"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { NewsFormState } from "@/components/admin/news-form";
import { getCurrentUser, isAdminEmail } from "@/lib/auth";
import { NEWS_CATEGORIES } from "@/lib/news-categories";
import {
  ALLOWED_IMAGE_TYPES,
  buildMediaUrl,
  MAX_IMAGE_BYTES,
  mediaObjectPathFromUrl,
  MEDIA_BUCKET,
  newMediaObjectPath,
} from "@/lib/storage";
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

type UploadedImage = {
  buffer: ArrayBuffer;
  contentType: string;
};

type ImageExtractResult =
  | { ok: true; hasFile: false }
  | { ok: true; hasFile: true; file: UploadedImage }
  | { ok: false; error: string };

async function extractImageFile(formData: FormData): Promise<ImageExtractResult> {
  const value = formData.get("image_file");
  if (value === null || (typeof value === "string" && value.trim() === "")) {
    return { ok: true, hasFile: false };
  }
  if (typeof value !== "object" || value === null || !("arrayBuffer" in value)) {
    return { ok: false, error: "File gambar tidak valid." };
  }

  const file = value as File;
  // Browser bisa mengirim File kosong (size 0, tanpa nama) saat admin tidak
  // memilih file sama sekali. Bukan file baru — bawa sebagai "tidak ada file".
  if (file.size === 0) {
    return { ok: true, hasFile: false };
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return {
      ok: false,
      error: "Format file tidak didukung. Hanya JPEG, PNG, WebP, atau AVIF.",
    };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Ukuran file melebihi batas maksimal 5 MB." };
  }

  return {
    ok: true,
    hasFile: true,
    file: { buffer: await file.arrayBuffer(), contentType: file.type },
  };
}

async function uploadMediaImage(
  image: UploadedImage,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const supabase = await createClient();
  const objectPath = newMediaObjectPath(image.contentType, "berita");

  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(objectPath, Buffer.from(image.buffer), {
      contentType: image.contentType,
      upsert: false,
    });

  if (error || !data) {
    const detail = error?.message ?? "terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengunggah gambar berita ke Storage:", detail);
    return { ok: false, error: `Gambar gagal diunggah. Silakan coba lagi (${detail}).` };
  }

  const url = buildMediaUrl(data.path);
  if (!url) {
    await removeMediaObject(objectPath);
    return { ok: false, error: "Gambar gagal diproses. Silakan coba lagi." };
  }

  return { ok: true, url };
}

async function removeMediaObject(objectPath: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([objectPath]);
    if (error) {
      console.error("Gagal menghapus file Storage:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Gagal menghapus file Storage:", message);
    return false;
  }
}

async function removeMediaImageIfAny(imagePath: string | null): Promise<void> {
  if (typeof imagePath !== "string" || imagePath.trim() === "") {
    return;
  }
  const objectPath = mediaObjectPathFromUrl(imagePath);
  if (objectPath) {
    await removeMediaObject(objectPath);
  }
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

  const imageResult = await extractImageFile(formData);
  if (!imageResult.ok) {
    return { error: imageResult.error };
  }

  const supabase = await createClient();

  if (await slugExists(supabase, parsed.values.slug)) {
    return { error: "Slug sudah dipakai berita lain. Gunakan slug yang berbeda." };
  }

  let imagePath: string | null = null;
  if (imageResult.hasFile) {
    const upload = await uploadMediaImage(imageResult.file);
    if (!upload.ok) {
      return { error: upload.error };
    }
    imagePath = upload.url;
  }

  const { error } = await supabase.from("news").insert({
    slug: parsed.values.slug,
    title: parsed.values.title,
    category: parsed.values.category,
    excerpt: parsed.values.excerpt,
    content: parsed.values.content,
    author: parsed.values.author,
    published_at: parsed.values.published_at,
    image_path: imagePath,
    image_alt: parsed.values.image_alt,
    is_featured: parsed.values.is_featured,
    is_published: parsed.values.is_published,
  });

  if (error) {
    console.error("Gagal menambah berita:", error.message);
    if (imagePath) {
      await removeMediaImageIfAny(imagePath);
    }
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

  const imageResult = await extractImageFile(formData);
  if (!imageResult.ok) {
    return { error: imageResult.error };
  }

  const removeImage = formData.get("remove_image") === "on";

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("news")
    .select("id, image_path")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Berita tidak ditemukan. Silakan muat ulang halaman." };
  }

  const oldImagePath = existing.image_path as string | null;

  if (await slugExists(supabase, parsed.values.slug, id)) {
    return { error: "Slug sudah dipakai berita lain. Gunakan slug yang berbeda." };
  }

  let newImagePath: string | null = null;
  let uploadedUrl: string | null = null;

  if (imageResult.hasFile) {
    const upload = await uploadMediaImage(imageResult.file);
    if (!upload.ok) {
      return { error: upload.error };
    }
    uploadedUrl = upload.url;
    newImagePath = upload.url;
  } else if (removeImage) {
    newImagePath = null;
  } else {
    newImagePath = oldImagePath;
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
      image_path: newImagePath,
      image_alt: parsed.values.image_alt,
      is_featured: parsed.values.is_featured,
      is_published: parsed.values.is_published,
    })
    .eq("id", id);

  if (error) {
    console.error("Gagal memperbarui berita:", error.message);
    if (uploadedUrl) {
      await removeMediaImageIfAny(uploadedUrl);
    }
    return { error: "Berita gagal diperbarui. Silakan coba lagi." };
  }

  if (imageResult.hasFile || removeImage) {
    await removeMediaImageIfAny(oldImagePath);
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
    .select("id, image_path")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Berita tidak ditemukan. Silakan muat ulang halaman." };
  }

  const oldImagePath = existing.image_path as string | null;

  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus berita:", error.message);
    return { error: "Berita gagal dihapus. Silakan coba lagi." };
  }

  await removeMediaImageIfAny(oldImagePath);

  revalidatePath("/berita");
  revalidatePath("/berita/[slug]");
  redirect("/admin/berita");
}