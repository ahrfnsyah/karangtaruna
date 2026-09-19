/*
 * SERVER ONLY — jangan diimpor dari Client Component.
 *
 * Authorization admin memakai allowlist email dari environment server
 * (ADMIN_EMAILS, dipisahkan koma). Tidak ada credential/password yang
 * disimpan; Supabase Auth tetap menjadi source of truth untuk autentikasi.
 *
 * Jika ADMIN_EMAILS kosong/tidak diatur, tidak ada akun yang dianggap admin
 * (fail-closed) sampai pengelola mengisinya.
 */

import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) {
    return false;
  }
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return allowlist.includes(email.toLowerCase());
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("Gagal membaca sesi pengguna:", error.message);
    return null;
  }
  return user;
}

export type AdminSession = {
  user: User | null;
  isAdmin: boolean;
};

export async function getAdminSession(): Promise<AdminSession> {
  const user = await getCurrentUser();
  return { user, isAdmin: isAdminEmail(user?.email) };
}