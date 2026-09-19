import { createBrowserClient } from "@supabase/ssr";

/*
 * Browser Supabase client.
 * Dipakai hanya di Client Components. Memakai anon key yang aman untuk publik
 * karena seluruh akses data tetap dibatasi oleh RLS.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    );
  }

  return createBrowserClient(url, anonKey);
}
