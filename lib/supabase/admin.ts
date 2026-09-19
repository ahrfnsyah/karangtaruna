// =============================================================================
// SERVER ONLY — JANGAN IMPORT DARI CLIENT COMPONENT.
//
// File ini memakai SUPABASE_SERVICE_ROLE_KEY yang MELEWATI SELURUH kebijakan RLS.
// Hanya boleh dipakai oleh kode server tepercaya: Server Actions, Route Handlers,
// dan script seed/migrasi STEP 22. Jangan pernah mengimpor file ini dari file
// ber-"use client", karena akan membocorkan service role key ke browser.
// =============================================================================

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
