"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  error: string | null;
};

/*
 * Login admin via Server Action. Sesi ditulis ke cookie di sisi server
 * sehingga tidak memerlukan browser client untuk membaca/menulis token.
 * Pesan error bersifat generik; detail error Supabase hanya dicatat di log
 * server, tidak pernah dikirim ke klien.
 */
export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Silakan isi email dan password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Login admin gagal:", error.message);
    return { error: "Email atau password salah. Silakan coba lagi." };
  }

  redirect("/admin");
}