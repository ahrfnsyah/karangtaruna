import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CalendarIcon,
  CameraIcon,
  PencilIcon,
  PlusIcon,
} from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import { formatTanggal } from "@/lib/utils";

import { ConfirmDelete } from "@/components/admin/confirm-delete";

import { deleteActivity } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Kegiatan",
    description: "Kelola kegiatan Karang Taruna RT 04 RW 08 Srengseng Sawah.",
    path: "/admin/kegiatan",
  }),
  robots: { index: false, follow: false },
};

type AdminActivityRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  event_date: string;
  status: string | null;
  is_published: boolean;
};

async function getActivities(): Promise<{ items: AdminActivityRow[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("activities")
      .select("id, slug, title, category, event_date, status, is_published")
      .order("event_date", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return { items: (data ?? []) as AdminActivityRow[], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengambil kegiatan (admin):", message);
    return { items: [], error: "Data kegiatan tidak dapat dimuat. Silakan coba lagi." };
  }
}

export default async function AdminKegiatanPage() {
  const { items, error } = await getActivities();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
            Manajemen Konten
          </p>
          <h1 className="mt-2 text-h2 text-foreground">Kegiatan</h1>
          <p className="mt-2 text-muted-foreground">
            Daftar kegiatan yang ditampilkan di halaman publik &ldquo;Kegiatan&rdquo;.
          </p>
        </div>
        <LinkButton href="/admin/kegiatan/new" variant="primary">
          <PlusIcon className="h-4 w-4" />
          Tambah Kegiatan
        </LinkButton>
      </div>

      {error ? (
        <div className="mt-8 rounded-card border border-dashed border-slate-300 bg-background px-6 py-12 text-center">
          <CameraIcon className="mx-auto h-8 w-8 text-accent-600" />
          <h2 className="mt-4 text-h4 text-foreground">Data tidak dapat dimuat</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {error}
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-card border border-dashed border-slate-300 bg-background px-6 py-12 text-center">
          <CameraIcon className="mx-auto h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-h4 text-foreground">Belum ada kegiatan</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Tambah kegiatan pertama untuk mulai mengelola konten.
          </p>
          <LinkButton href="/admin/kegiatan/new" variant="primary" className="mt-5">
            <PlusIcon className="h-4 w-4" />
            Tambah Kegiatan
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
                      Kegiatan
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Kategori
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Tanggal
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Publikasi
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((activity) => (
                    <tr key={activity.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          /kegiatan/{activity.slug}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="primary">{activity.category}</Badge>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {formatTanggal(activity.event_date)}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {activity.status ?? <span className="text-slate-400">&mdash;</span>}
                      </td>
                      <td className="px-5 py-4">
                        {activity.is_published ? (
                          <Badge variant="neutral">Tayang</Badge>
                        ) : (
                          <Badge variant="accent">Draf</Badge>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <LinkButton
                            href={`/admin/kegiatan/${activity.id}/edit`}
                            variant="outline"
                            size="sm"
                          >
                            <PencilIcon className="h-4 w-4" />
                            Edit
                          </LinkButton>
                          <ConfirmDelete
                            action={deleteActivity}
                            id={activity.id}
                            title={activity.title}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <ul className="mt-6 space-y-4 md:hidden">
            {items.map((activity) => (
              <li key={activity.id}>
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{activity.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant="primary">{activity.category}</Badge>
                        {activity.is_published ? (
                          <Badge variant="neutral">Tayang</Badge>
                        ) : (
                          <Badge variant="accent">Draf</Badge>
                        )}
                      </div>
                    </div>
                    <ConfirmDelete
                      action={deleteActivity}
                      id={activity.id}
                      title={activity.title}
                    />
                  </div>
                  <dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-muted-foreground">Tanggal</dt>
                      <dd className="flex items-center gap-1.5 text-foreground">
                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        {formatTanggal(activity.event_date)}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-muted-foreground">Status</dt>
                      <dd className="text-foreground">
                        {activity.status ?? <span className="text-slate-400">&mdash;</span>}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-4">
                    <LinkButton
                      href={`/admin/kegiatan/${activity.id}/edit`}
                      variant="outline"
                      size="sm"
                    >
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