import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { Unauthorized } from "@/components/admin/unauthorized";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/*
 * Melindungi SEMUA route di dalam group (protected): /admin dan route admin
 * lain di masa depan. /admin/login berada di group (auth) sehingga tidak
 * di-protect oleh layout ini (tidak terjadi redirect loop).
 *
 * Security boundary tetap server-side: layout ini memverifikasi langsung
 * sesi (autentikasi) dan keanggotaan admin (authorization) pada setiap
 * request, tidak hanya mengandalkan proxy.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin } = await getAdminSession();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAdmin) {
    return <Unauthorized email={user.email ?? ""} />;
  }

  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>;
}