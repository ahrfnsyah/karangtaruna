"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActivityFormState } from "@/components/admin/activity-form";
import { ACTIVITY_CATEGORIES } from "@/lib/activity-categories";
import { getCurrentUser, isAdminEmail } from "@/lib/auth";
import {
  ALLOWED_IMAGE_TYPES,
  buildMediaUrl,
  MAX_IMAGE_BYTES,
  mediaObjectPathFromUrl,
  MEDIA_BUCKET,
  newMediaObjectPath,
} from "@/lib/storage";
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
  const objectPath = newMediaObjectPath(image.contentType, "kegiatan");

  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(objectPath, Buffer.from(image.buffer), {
      contentType: image.contentType,
      upsert: false,
    });

  if (error || !data) {
    const detail = error?.message ?? "terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengunggah gambar kegiatan ke Storage:", detail);
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

  const imageResult = await extractImageFile(formData);
  if (!imageResult.ok) {
    return { error: imageResult.error };
  }

  const supabase = await createClient();

  if (await slugExists(supabase, parsed.values.slug)) {
    return { error: "Slug sudah dipakai kegiatan lain. Gunakan slug yang berbeda." };
  }

  let imagePath: string | null = null;
  if (imageResult.hasFile) {
    const upload = await uploadMediaImage(imageResult.file);
    if (!upload.ok) {
      return { error: upload.error };
    }
    imagePath = upload.url;
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
    image_path: imagePath,
    image_alt: parsed.values.image_alt,
    program_id: parsed.values.program_id,
    is_published: parsed.values.is_published,
  });

  if (error) {
    console.error("Gagal menambah kegiatan:", error.message);
    if (imagePath) {
      await removeMediaImageIfAny(imagePath);
    }
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

  const imageResult = await extractImageFile(formData);
  if (!imageResult.ok) {
    return { error: imageResult.error };
  }

  const removeImage = formData.get("remove_image") === "on";

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("activities")
    .select("id, image_path")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Kegiatan tidak ditemukan. Silakan muat ulang halaman." };
  }

  const oldImagePath = existing.image_path as string | null;

  if (await slugExists(supabase, parsed.values.slug, id)) {
    return { error: "Slug sudah dipakai kegiatan lain. Gunakan slug yang berbeda." };
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
      image_path: newImagePath,
      image_alt: parsed.values.image_alt,
      program_id: parsed.values.program_id,
      is_published: parsed.values.is_published,
    })
    .eq("id", id);

  if (error) {
    console.error("Gagal memperbarui kegiatan:", error.message);
    if (uploadedUrl) {
      await removeMediaImageIfAny(uploadedUrl);
    }
    return { error: "Kegiatan gagal diperbarui. Silakan coba lagi." };
  }

  if (imageResult.hasFile || removeImage) {
    await removeMediaImageIfAny(oldImagePath);
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
    .select("id, image_path")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Kegiatan tidak ditemukan. Silakan muat ulang halaman." };
  }

  const oldImagePath = existing.image_path as string | null;

  const { error } = await supabase.from("activities").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus kegiatan:", error.message);
    return { error: "Kegiatan gagal dihapus. Silakan coba lagi." };
  }

  await removeMediaImageIfAny(oldImagePath);

  revalidatePath("/kegiatan");
  revalidatePath("/kegiatan/[slug]");
  redirect("/admin/kegiatan");
}