/*
 * Helper sesi untuk file Proxy (Next.js 16 — konvensi `middleware` sudah
 * diganti nama menjadi `proxy`). Membaca sesi dari cookie request dan
 * me-refresh access token bila diperlukan, lalu menulis kembali cookie
 * yang baru ke response.
 *
 * Hanya dipanggil untuk /admin/* (lihat matcher di proxy.ts), sehingga
 * public routes tidak tersentuh oleh logic auth ini.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { User } from "@supabase/supabase-js";

export type UpdateSessionResult = {
  response: NextResponse;
  user: User | null;
};

export async function updateSession(request: NextRequest): Promise<UpdateSessionResult> {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error("Proxy: NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY belum diatur.");
    return { response: supabaseResponse, user: null };
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // Jangan menjalankan kode lain antara createServerClient dan getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response: supabaseResponse, user };
}