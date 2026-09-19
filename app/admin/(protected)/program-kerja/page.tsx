import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ClipboardListIcon,
  PencilIcon,
  PlusIcon,
  SparklesIcon,
} from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

import { ConfirmDelete } from "@/components/admin/confirm-delete";

import { deleteProgram } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Program Kerja",
    description: "Kelola program kerja Karang Taruna RT 04 RW 08 Srengseng Sawah.",
    path: "/admin/program-kerja",
  }),
  robots: { index: false, follow: false },
};

type AdminProgramRow = {
  id: string;
  title: string;
  category: string;
  status: string | null;
  target: string | null;
  is_published: boolean;
  sort_order: number;
};

async function getPrograms(): Promise<{ programs: AdminProgramRow[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("programs")
      .select("id, title, category, status, target, is_published, sort_order")
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return { programs: (data ?? []) as AdminProgramRow[], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengambil program kerja (admin):", message);
    return { programs: [], error: "Data program tidak dapat dimuat. Silakan coba lagi." };
  }
}

export default async function AdminProgramKerjaPage() {
  const { programs, error } = await getPrograms();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
            Manajemen Konten
          </p>
          <h1 className="mt-2 text-h2 text-foreground">Program Kerja</h1>
          <p className="mt-2 text-muted-foreground">
            Daftar program kerja yang ditampilkan di halaman publik &ldquo;Program Kerja&rdquo;.
          </p>
        </div>
        <LinkButton href="/admin/program-kerja/new" variant="primary">
          <PlusIcon className="h-4 w-4" />
          Tambah Program
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
      ) : programs.length === 0 ? (
        <div className="mt-8 rounded-card border border-dashed border-slate-300 bg-background px-6 py-12 text-center">
          <ClipboardListIcon className="mx-auto h-8 w-8 text-primary-600" />
          <h2 className="mt-4 text-h4 text-foreground">Belum ada program kerja</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Tambah program kerja pertama untuk mulai mengelola konten.
          </p>
          <LinkButton href="/admin/program-kerja/new" variant="primary" className="mt-5">
            <PlusIcon className="h-4 w-4" />
            Tambah Program
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
                      Program
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Kategori
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Target
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => (
                    <tr key={program.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground">{program.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Urutan tampil: {program.sort_order}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="primary">{program.category}</Badge>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {program.status ?? <span className="text-slate-400">&mdash;</span>}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {program.target ?? <span className="text-slate-400">&mdash;</span>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <LinkButton
                            href={`/admin/program-kerja/${program.id}/edit`}
                            variant="outline"
                            size="sm"
                          >
                            <PencilIcon className="h-4 w-4" />
                            Edit
                          </LinkButton>
                          <ConfirmDelete action={deleteProgram} id={program.id} title={program.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <ul className="mt-6 space-y-4 md:hidden">
            {programs.map((program) => (
              <li key={program.id}>
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{program.title}</p>
                      <div className="mt-2">
                        <Badge variant="primary">{program.category}</Badge>
                      </div>
                    </div>
                    <ConfirmDelete action={deleteProgram} id={program.id} title={program.title} />
                  </div>
                  <dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-muted-foreground">Status</dt>
                      <dd className="text-foreground">
                        {program.status ?? <span className="text-slate-400">&mdash;</span>}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-muted-foreground">Target</dt>
                      <dd className="text-foreground">
                        {program.target ?? <span className="text-slate-400">&mdash;</span>}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-muted-foreground">Urutan</dt>
                      <dd className="text-foreground">{program.sort_order}</dd>
                    </div>
                  </dl>
                  <div className="mt-4">
                    <LinkButton
                      href={`/admin/program-kerja/${program.id}/edit`}
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