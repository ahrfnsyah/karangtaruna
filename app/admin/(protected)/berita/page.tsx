import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NewspaperIcon, PencilIcon, PlusIcon, SparklesIcon } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import { formatTanggalWIB, formatTanggalWIBISO } from "@/lib/utils";

import { ConfirmDelete } from "@/components/admin/confirm-delete";

import { deleteNewsItem } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Berita",
    description: "Kelola berita Karang Taruna RT 04 RW 08 Srengseng Sawah.",
    path: "/admin/berita",
  }),
  robots: { index: false, follow: false },
};

type AdminNewsRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  published_at: string;
  is_featured: boolean;
  is_published: boolean;
};

async function getNews(): Promise<{ items: AdminNewsRow[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("id, slug, title, category, published_at, is_featured, is_published")
      .order("published_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return { items: (data ?? []) as AdminNewsRow[], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengambil berita (admin):", message);
    return { items: [], error: "Data berita tidak dapat dimuat. Silakan coba lagi." };
  }
}

export default async function AdminBeritaPage() {
  const { items, error } = await getNews();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
            Manajemen Konten
          </p>
          <h1 className="mt-2 text-h2 text-foreground">Berita</h1>
          <p className="mt-2 text-muted-foreground">
            Daftar berita yang ditampilkan di halaman publik &ldquo;Berita&rdquo;.
          </p>
        </div>
        <LinkButton href="/admin/berita/new" variant="primary">
          <PlusIcon className="h-4 w-4" />
          Tambah Berita
        </LinkButton>
      </div>

      {error ? (
        <div className="mt-8 rounded-card border border-dashed border-slate-300 bg-background px-6 py-12 text-center">
          <SparklesIcon className="mx-auto h-8 w-8 text-accent-600" />
          <h2 className="mt-4 text-h4 text-foreground">Data tidak dapat dimuat</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {error}
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-card border border-dashed border-slate-300 bg-background px-6 py-12 text-center">
          <NewspaperIcon className="mx-auto h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-h4 text-foreground">Belum ada berita</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Tambah berita pertama untuk mulai mengelola konten.
          </p>
          <LinkButton href="/admin/berita/new" variant="primary" className="mt-5">
            <PlusIcon className="h-4 w-4" />
            Tambah Berita
          </LinkButton>
        </div>
      ) : (
        <div className="mt-8">
          <Card className="hidden overflow-hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Berita
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Kategori
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Terbit
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">/berita/{item.slug}</p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="primary">{item.category}</Badge>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {formatTanggalWIB(item.published_at)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {item.is_featured ? <Badge variant="accent">Utama</Badge> : null}
                          {item.is_published ? (
                            <Badge variant="neutral">Tayang</Badge>
                          ) : (
                            <Badge variant="outline">Draf</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <LinkButton
                            href={`/admin/berita/${item.id}/edit`}
                            variant="outline"
                            size="sm"
                          >
                            <PencilIcon className="h-4 w-4" />
                            Edit
                          </LinkButton>
                          <ConfirmDelete action={deleteNewsItem} id={item.id} title={item.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <ul className="mt-6 space-y-4 md:hidden">
            {items.map((item) => (
              <li key={item.id}>
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Badge variant="primary">{item.category}</Badge>
                        {item.is_featured ? <Badge variant="accent">Utama</Badge> : null}
                        {item.is_published ? (
                          <Badge variant="neutral">Tayang</Badge>
                        ) : (
                          <Badge variant="outline">Draf</Badge>
                        )}
                      </div>
                    </div>
                    <ConfirmDelete action={deleteNewsItem} id={item.id} title={item.title} />
                  </div>
                  <dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-muted-foreground">Terbit</dt>
                      <dd className="text-foreground">
                        <time dateTime={formatTanggalWIBISO(item.published_at)}>
                          {formatTanggalWIB(item.published_at)}
                        </time>
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-4">
                    <LinkButton href={`/admin/berita/${item.id}/edit`} variant="outline" size="sm">
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </LinkButton>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}