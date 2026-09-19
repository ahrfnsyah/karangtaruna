import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRightIcon,
  ClipboardListIcon,
  ExternalLinkIcon,
} from "@/components/ui/icons";
import { getAdminSession } from "@/lib/auth";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Dashboard",
    description: "Panel admin Karang Taruna RT 04 RW 08 Srengseng Sawah.",
    path: "/admin",
  }),
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const { user, isAdmin } = await getAdminSession();

  if (!user || !isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Dashboard</p>
      <h1 className="mt-2 text-h2 text-foreground">Halo, selamat datang!</h1>
      <p className="mt-2 text-muted-foreground">
        Anda masuk sebagai{" "}
        <strong className="font-semibold text-foreground">{user.email}</strong>.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Card className="flex flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-h4 text-foreground">Program Kerja</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Kelola daftar program kerja yang ditampilkan di halaman publik.
              </p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-primary-50 text-primary-700">
              <ClipboardListIcon className="h-5 w-5" />
            </span>
          </div>
          <LinkButton href="/admin/program-kerja" variant="primary" size="sm" className="mt-5 self-start">
            Kelola
            <ArrowRightIcon className="h-4 w-4" />
          </LinkButton>
        </Card>

        <Card className="flex flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-h4 text-foreground">Lihat Situs</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Buka halaman publik website Karang Taruna di tab baru.
              </p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-accent-50 text-accent-700">
              <ExternalLinkIcon className="h-5 w-5" />
            </span>
          </div>
          <LinkButton
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="sm"
            className="mt-5 self-start"
          >
            Buka Beranda
            <ExternalLinkIcon className="h-4 w-4" />
          </LinkButton>
        </Card>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Modul manajemen lain (Kegiatan, Berita, Galeri, dan pengaturan situs) akan tersedia pada
        tahap berikutnya.
      </p>
    </div>
  );
}