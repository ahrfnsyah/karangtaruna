export type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function formatTanggal(iso: string): string {
  const [tahun, bulan, hari] = iso.split("-").map(Number);
  return `${hari} ${BULAN[bulan - 1]} ${tahun}`;
}

/*
 * Format tanggal dari kolom timestamptz menjadi "H BULAN TAHUN" dalam zona
 * waktu Asia/Jakarta (WIB). Data berita disimpan pada tengah malam WIB, jadi
 * memotong string ISO UTC (mis. slice) bisa menampilkan hari sebelumnya.
 */
export function formatTanggalWIB(iso: string): string {
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const hari = Number(value("day"));
  const bulan = Number(value("month"));
  const tahun = value("year");
  return `${hari} ${BULAN[bulan - 1]} ${tahun}`;
}

/** Ambil bagian tanggal (yyyy-mm-dd) dalam WIB dari nilai timestamptz. */
export function formatTanggalWIBISO(iso: string): string {
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

const FALLBACK_GAMBAR = "/images/placeholders/kegiatan-1.svg";

/*
 * Kembalikan path gambar yang aman untuk next/image.
 * Jika image_path NULL/kosong (data awal memakai placeholder lokal,
 * Storage dipakai nanti saat admin mengunggah), gunakan placeholder lokal.
 */
export function resolveGambar(path: string | null | undefined): string {
  if (typeof path === "string" && path.trim() !== "") {
    return path;
  }
  return FALLBACK_GAMBAR;
}