import type { Metadata } from "next";

import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { ArrowLeftIcon, PlusIcon } from "@/components/ui/icons";

import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/metadata";

import { deleteAboutItem } from "../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Misi, Nilai & Peran",
    description: "Kelola konten Misi, Nilai, dan Peran Karang Taruna.",
    path: "/admin/tentang/about",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

const SECTIONS = [
  {
    value: "mission",
    label: "Misi",
    description: "Kelola daftar misi organisasi.",
  },
  {
    value: "value",
    label: "Nilai",
    description: "Kelola nilai-nilai organisasi.",
  },
  {
    value: "role",
    label: "Peran",
    description: "Kelola peran Karang Taruna.",
  },
] as const;

export default async function AboutAdminPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("about_items")
    .select(
      "id, section, title, description, icon, sort_order, is_published",
    )
    .order("section")
    .order("sort_order");

  if (error) {
    throw new Error("Gagal mengambil data Misi, Nilai, dan Peran.");
  }

  const items = data ?? [];

  return (
    <div>
      <LinkButton
        href="/admin/tentang"
        variant="ghost"
        size="sm"
        className="-ml-3"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
            Tentang
          </p>

          <h1 className="mt-2 text-h2 text-foreground">
            Misi, Nilai &amp; Peran
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Kelola konten Misi, Nilai, dan Peran yang ditampilkan pada halaman
            publik Tentang.
          </p>
        </div>

        <LinkButton href="/admin/tentang/about/new">
          <PlusIcon className="h-4 w-4" />
          Tambah Item
        </LinkButton>
      </div>

      <div className="mt-8 space-y-8">
        {SECTIONS.map((section) => {
          const sectionItems = items.filter(
            (item) => item.section === section.value,
          );

          return (
            <section key={section.value}>
              <Card>
                <CardHeader>
                  <CardTitle>{section.label}</CardTitle>
                  <CardDescription>
                    {section.description}
                  </CardDescription>
                </CardHeader>

                <div className="px-6 pb-6">
                  {sectionItems.length === 0 ? (
                    <div className="rounded-control border border-dashed border-border px-5 py-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        Belum ada data {section.label.toLowerCase()}.
                      </p>

                      <LinkButton
                        href={`/admin/tentang/about/new?section=${section.value}`}
                        variant="outline"
                        size="sm"
                        className="mt-4"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Tambah {section.label}
                      </LinkButton>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sectionItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-4 rounded-control border border-border p-4 sm:flex-row sm:items-start sm:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-foreground">
                                {item.title}
                              </h3>

                              <span
                                className={
                                  item.is_published
                                    ? "inline-flex items-center rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700"
                                    : "inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                                }
                              >
                                {item.is_published ? "Tayang" : "Draft"}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.description}
                            </p>

                            <p className="mt-2 text-xs text-muted-foreground">
                              Urutan: {item.sort_order}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <Link
                              href={`/admin/tentang/about/${item.id}/edit`}
                              className="inline-flex h-9 items-center justify-center rounded-control border border-border px-3 text-sm font-medium text-foreground transition hover:bg-muted"
                            >
                              Edit
                            </Link>

                            <ConfirmDelete
                              id={item.id}
                              title={item.title}
                              action={deleteAboutItem}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </section>
          );
        })}
      </div>
    </div>
  );
}