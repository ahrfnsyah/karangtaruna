"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/app/admin/(protected)/actions";
import {
  CalendarIcon,
  CameraIcon,
  ClipboardListIcon,
  ExternalLinkIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  NewspaperIcon,
  ShieldCheckIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

import { SubmitButton } from "./submit-button";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/admin/program-kerja", label: "Program Kerja", icon: ClipboardListIcon },
  { href: "/admin/kegiatan", label: "Kegiatan", icon: CalendarIcon },
  { href: "/admin/berita", label: "Berita", icon: NewspaperIcon },
  { href: "/admin/galeri", label: "Galeri", icon: CameraIcon },
  { href: "/admin/tentang", label: "Tentang", icon: ShieldCheckIcon },
] as const;

type AdminShellProps = {
  email: string;
  children: ReactNode;
};

function isActive(href: string, pathname: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname.startsWith(href);
}

function navLinkClass(active: boolean): string {
  return cn(
    "flex items-center gap-3 rounded-control px-3 py-2 text-sm font-medium transition-colors",
    active
      ? "bg-primary-50 text-primary-700"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}

/*
 * Kerangka area admin: sidebar (desktop) + header bernavigasi (mobile).
 * Menampilkan email user yang login dan tombol Keluar. Frontend shell ini
 * TIDAK menggantikan pengamanan server-side di layout (getAdminSession).
 */
export function AdminShell({ email, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted lg:flex">
      <aside className="w-64 shrink-0 border-r border-border bg-background lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="flex items-center gap-3 px-6 pb-4 pt-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-primary-600 text-white">
            <ShieldCheckIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">Area Admin</p>
            <p className="truncate text-xs text-muted-foreground">Karang Taruna RT 04 RW 08</p>
          </div>
        </div>

        <nav aria-label="Menu admin" className="flex flex-col gap-1 px-4 py-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href, pathname);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={navLinkClass(active)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            );
          })}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={navLinkClass(false)}
          >
            <ExternalLinkIcon className="h-5 w-5 shrink-0" />
            Lihat Situs
          </Link>
        </nav>

        <div className="mt-auto space-y-3 border-t border-border px-4 py-5">
          <p className="truncate text-xs text-muted-foreground" title={email}>
            {email}
          </p>
          <form action={logout}>
            <SubmitButton variant="outline" className="w-full" pendingLabel="Keluar...">
              <LogOutIcon className="h-4 w-4" />
              Keluar
            </SubmitButton>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="border-b border-border bg-background lg:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-primary-600 text-white">
                <ShieldCheckIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">Area Admin</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
            <form action={logout}>
              <SubmitButton variant="ghost" className="px-3" pendingLabel="Keluar...">
                <LogOutIcon className="h-4 w-4" />
                Keluar
              </SubmitButton>
            </form>
          </div>
          <nav aria-label="Menu admin" className="flex gap-1 overflow-x-auto px-3 pb-3">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = isActive(href, pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={navLinkClass(active)}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}