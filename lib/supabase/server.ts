import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/*
 * Server Supabase client.
 * Dipakai di Server Components, Server Actions, dan Route Handlers.
 * Sesi berbasis cookie sehingga tetap memakai anon key + RLS, bukan service role.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    );
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          /*
           * Dipanggil dari Server Component yang cookie-nya read-only.
           * Aman diabaikan; refresh sesi ditangani oleh Server Action/proxy.
           */
        }
      },
    },
  });
}
