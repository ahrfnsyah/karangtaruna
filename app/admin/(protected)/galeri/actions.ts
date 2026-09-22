"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { GalleryFormState } from "@/components/admin/gallery-form";
import { getCurrentUser, isAdminEmail } from "@/lib/auth";
import { GALLERY_CATEGORIES } from "@/lib/gallery-categories";
import {
  ALLOWED_IMAGE_TYPES,
  buildMediaUrl,
  MAX_IMAGE_BYTES,
  mediaObjectPathFromUrl,
  MEDIA_BUCKET,
  newMediaObjectPath,
} from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

const CATEGORY_SET = new Set<string>(GALLERY_CATEGORIES);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type GalleryFields = {
  title: string;
  category: string;
  description: string | null;
  image_alt: string;
  taken_at: string | null;
  sort_order: number;
  is_published: boolean;
};

type ParseResult = { ok: true; values: GalleryFields } | { ok: false; error: string };

function parseGalleryForm(formData: FormData): ParseResult {
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image_alt = String(formData.get("image_alt") ?? "").trim();
  const taken_at = String(formData.get("taken_at") ?? "").trim();
  const sort_order = String(formData.get("sort_order") ?? "").trim();
  const is_published = formData.get("is_published") === "on";

  if (!title) {
    return { ok: false, error: "Judul galeri wajib diisi." };
  }
  if (title.length > 120) {
    return { ok: false, error: "Judul galeri terlalu panjang (maksimal 120 karakter)." };
  }

  if (!CATEGORY_SET.has(category)) {
    return { ok: false, error: "Kategori yang dipilih tidak valid." };
  }
  if (description.length > 2000) {
    return { ok: false, error: "Deskripsi terlalu panjang (maksimal 2000 karakter)." };
  }
  if (image_alt.length > 300) {
    return { ok: false, error: "Alt gambar terlalu panjang (maksimal 300 karakter)." };
  }
  if (taken_at && !DATE_PATTERN.test(taken_at)) {
    return { ok: false, error: "Tanggal pengambilan tidak valid." };
  }

  if (!sort_order) {
    return { ok: false, error: "Urutan tampil wajib diisi berupa angka." };
  }
  if (!/^-?\d{1,6}$/.test(sort_order)) {
    return { ok: false, error: "Urutan tampil harus berupa bilangan bulat." };
  }
  const sortOrder = Number(sort_order);
  if (!Number.isSafeInteger(sortOrder)) {
    return { ok: false, error: "Urutan tampil harus berupa bilangan bulat." };
  }

  return {
    ok: true,
    values: {
      title,
      category,
      description: description || null,
      image_alt,
      taken_at: taken_at || null,
      sort_order: sortOrder,
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

/*
 * Baca file dari input "image_file". Form memakai multipart biasa dan diterima
 * Server Action sebagai File; hasil divalidasi: hanya JPEG/PNG/WebP/AVIF dan
 * maksimal 5 MB (selaras dengan config bucket media).
 */
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
  const objectPath = newMediaObjectPath(image.contentType);

  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(objectPath, Buffer.from(image.buffer), {
      contentType: image.contentType,
      upsert: false,
    });

  if (error || !data) {
    const detail = error?.message ?? "terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengunggah gambar ke Storage:", detail);
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

/**
 * Hapus file Storage milik gambar (best-effort). Hanya dieksekusi jika URL
 * benar-benar menunjuk bucket media — placeholder/URL lain tidak disentuh.
 */
async function removeMediaImageIfAny(imagePath: string | null): Promise<void> {
  if (typeof imagePath !== "string" || imagePath.trim() === "") {
    return;
  }
  const objectPath = mediaObjectPathFromUrl(imagePath);
  if (objectPath) {
    await removeMediaObject(objectPath);
  }
}

export async function createGalleryItem(
  _prevState: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const parsed = parseGalleryForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const imageResult = await extractImageFile(formData);
  if (!imageResult.ok) {
    return { error: imageResult.error };
  }

  let imagePath: string | null = null;
  if (imageResult.hasFile) {
    const upload = await uploadMediaImage(imageResult.file);
    if (!upload.ok) {
      return { error: upload.error };
    }
    imagePath = upload.url;
  }

  const supabase = await createClient();

  const { error } = await supabase.from("gallery_items").insert({
    title: parsed.values.title,
    category: parsed.values.category,
    description: parsed.values.description,
    image_path: imagePath,
    image_alt: parsed.values.image_alt,
    taken_at: parsed.values.taken_at,
    sort_order: parsed.values.sort_order,
    is_published: parsed.values.is_published,
  });

  if (error) {
    console.error("Gagal menambah galeri:", error.message);
    if (imagePath) {
      await removeMediaImageIfAny(imagePath);
    }
    return { error: "Item galeri gagal disimpan. Silakan coba lagi." };
  }

  revalidatePath("/galeri");
  redirect("/admin/galeri");
}

export async function updateGalleryItem(
  _prevState: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Data tidak lengkap. Silakan muat ulang halaman." };
  }

  const parsed = parseGalleryForm(formData);
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
    .from("gallery_items")
    .select("id, image_path")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Item galeri tidak ditemukan. Silakan muat ulang halaman." };
  }

  const oldImagePath = existing.image_path as string | null;

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
    .from("gallery_items")
    .update({
      title: parsed.values.title,
      category: parsed.values.category,
      description: parsed.values.description,
      image_path: newImagePath,
      image_alt: parsed.values.image_alt,
      taken_at: parsed.values.taken_at,
      sort_order: parsed.values.sort_order,
      is_published: parsed.values.is_published,
    })
    .eq("id", id);

  if (error) {
    console.error("Gagal memperbarui galeri:", error.message);
    if (uploadedUrl) {
      await removeMediaImageIfAny(uploadedUrl);
    }
    return { error: "Item galeri gagal diperbarui. Silakan coba lagi." };
  }

  /*
   * Update DB sukses: hapus gambar lama (replaced/removed) setelahnya.
   * Best-effort — kalau gagal hanya orfan file, data tetap konsisten.
   */
  if (imageResult.hasFile || removeImage) {
    await removeMediaImageIfAny(oldImagePath);
  }

  revalidatePath("/galeri");
  redirect("/admin/galeri");
}

export async function deleteGalleryItem(
  _prevState: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Data tidak lengkap. Silakan muat ulang halaman." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("gallery_items")
    .select("id, image_path")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Item galeri tidak ditemukan. Silakan muat ulang halaman." };
  }

  const oldImagePath = existing.image_path as string | null;

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus galeri:", error.message);
    return { error: "Item galeri gagal dihapus. Silakan coba lagi." };
  }

  await removeMediaImageIfAny(oldImagePath);

  revalidatePath("/galeri");
  redirect("/admin/galeri");
}