/*
 * File Proxy (Next.js 16). Konvensi `middleware.ts` sudah deprecated dan
 * diganti nama menjadi `proxy.ts`. File ini berada di root project, sejajar
 * dengan folder app/.
 *
 * Hanya mencakup area /admin/* — public routes (/, /berita, dan lainnya)
 * TIDAK tersentuh oleh proxy ini.
 *
 * Behavior:
 * - belum login         -> /admin* diarahkan ke /admin/login
 * - sudah login         -> /admin/login diarahkan ke /admin
 * - sudah login         -> area /admin* diizinkan (authorization dilakukan
 *                          server-side di app/admin/(protected)/layout.tsx)
 */

import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!user) {
    if (!isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return response;
  }

  if (isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};