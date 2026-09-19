import type { Metadata } from "next";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CameraIcon, PlusIcon, SparklesIcon } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal, resolveGambar } from "@/lib/utils";

import { ConfirmDelete } from "@/components/admin/confirm-delete";

import { deleteGalleryItem } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Galeri",
    description: "Kelola dokumentasi foto Karang Taruna RT 04 RW 08 Srengseng Sawah.",
    path: "/admin/galeri",
  }),
  robots: { index: false, follow: false },
};

type AdminGalleryRow = {
  id: string;
  title: string;
  category: string;
  image_path: string | null;
  image_alt: string;
  taken_at: string | null;
  sort_order: number;
  is_published: boolean;
};

async function getGallery(): Promise<{ items: AdminGalleryRow[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("id, title, category, image_path, image_alt, taken_at, sort_order, is_published")
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return { items: (data ?? []) as AdminGalleryRow[], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengambil galeri (admin):", message);
    return { items: [], error: "Data galeri tidak dapat dimuat. Silakan coba lagi." };
  }
}

export default async function AdminGaleriPage() {
  const { items, error } = await getGallery();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
            Manajemen Konten
          </p>
          <h1 className="mt-2 text-h2 text-foreground">Galeri</h1>
          <p className="mt-2 text-muted-foreground">
            Dokumentasi foto yang ditampilkan di halaman publik &ldquo;Galeri&rdquo;.
          </p>
        </div>
        <LinkButton href="/admin/galeri/new" variant="primary">
          <PlusIcon className="h-4 w-4" />
          Tambah Foto
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
          <CameraIcon className="mx-auto h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-h4 text-foreground">Belum ada foto</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Tambah foto pertama untuk mulai mengelola dokumentasi galeri.
          </p>
          <LinkButton href="/admin/galeri/new" variant="primary" className="mt-5">
            <PlusIcon className="h-4 w-4" />
            Tambah Foto
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
                      Foto
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Judul
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Diambil
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Urutan
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
                      <td className="px-5 py-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-control border border-border bg-muted">
                          <Image
                            src={resolveGambar(item.image_path)}
                            alt={item.image_alt || item.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="mt-0.5">
                          <Badge variant="primary">{item.category}</Badge>
                        </p>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {item.taken_at ? (
                          <time dateTime={item.taken_at}>{formatTanggal(item.taken_at)}</time>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{item.sort_order}</td>
                      <td className="px-5 py-4">
                        {item.is_published ? (
                          <Badge variant="neutral">Tayang</Badge>
                        ) : (
                          <Badge variant="outline">Draf</Badge>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <LinkButton
                            href={`/admin/galeri/${item.id}/edit`}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </LinkButton>
                          <ConfirmDelete action={deleteGalleryItem} id={item.id} title={item.title} />
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
                <Card className="flex items-start gap-4 p-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-control border border-border bg-muted">
                    <Image
                      src={resolveGambar(item.image_path)}
                      alt={item.image_alt || item.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="primary">{item.category}</Badge>
                      {item.is_published ? (
                        <Badge variant="neutral">Tayang</Badge>
                      ) : (
                        <Badge variant="outline">Draf</Badge>
                      )}
                    </div>
                    <h3 className="mt-1.5 truncate text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.taken_at
                        ? `${formatTanggal(item.taken_at)} · Urutan ${item.sort_order}`
                        : `Urutan ${item.sort_order}`}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <LinkButton href={`/admin/galeri/${item.id}/edit`} variant="outline" size="sm">
                        Edit
                      </LinkButton>
                      <ConfirmDelete
                        action={deleteGalleryItem}
                        id={item.id}
                        title={item.title}
                      />
                    </div>
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