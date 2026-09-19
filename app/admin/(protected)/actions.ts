"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/*
 * Logout menghapus sesi dari cookie lalu mengarahkan kembali ke /admin/login.
 * Setelah logout, /admin tidak dapat diakses lagi karena proxy dan layout
 * admin membutuhkan sesi aktif.
 */
export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout admin gagal:", error.message);
  }
  redirect("/admin/login");
}