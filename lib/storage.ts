/*
 * SERVER ONLY — helper untuk Supabase Storage bucket `media` (public,
 * file_size_limit 5 MB, mime JPEG/PNG/WebP/AVIF; RLS tulis hanya admin).
 * Dipakai oleh Server Action galeri. Jangan diimpor dari Client Component,
 * dan jangan pernah memakai SUPABASE_SERVICE_ROLE_KEY di sini — upload
 * berjalan dengan anon key + sesi cookie admin (RLS `public.is_admin()`).
 */

export const MEDIA_BUCKET = "media";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** Base URL objek publik bucket media, mis. https://xxx.supabase.co/storage/v1/object/public/media */
export function storageBaseUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    return null;
  }
  return `${url}/storage/v1/object/public/${MEDIA_BUCKET}`;
}

/**
 * Ambil object path ("<folder>/<nama>.<ext>") dari URL gambar Storage media.
 * Return null jika URL bukan milik bucket media (mis. placeholder lokal) —
 * file semacam itu TIDAK boleh dihapus dari Storage.
 */
export function mediaObjectPathFromUrl(url: string): string | null {
  const base = storageBaseUrl();
  if (!base) {
    return null;
  }
  const prefix = `${base}/`;
  if (!url.startsWith(prefix)) {
    return null;
  }
  const path = url.slice(prefix.length);
  if (!path || path.includes("..") || path.startsWith("/")) {
    return null;
  }
  return path;
}

/** Bangun URL publik objek dari object path. */
export function buildMediaUrl(objectPath: string): string | null {
  const base = storageBaseUrl();
  return base ? `${base}/${objectPath}` : null;
}

/** Object path baru berbentuk "galeri/<uuid>.<ext>". */
export function newMediaObjectPath(
  contentType: string,
  folder = "galeri",
): string {
  const ext = IMAGE_EXTENSIONS[contentType] ?? "jpg";
  return `${folder}/${crypto.randomUUID()}.${ext}`;
}