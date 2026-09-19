import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon, ClipboardListIcon } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

import { ProgramForm } from "@/components/admin/program-form";

import { updateProgram } from "../../actions";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Edit Program Kerja",
    description: "Perbarui program kerja Karang Taruna RT 04 RW 08 Srengseng Sawah.",
    path: "/admin/program-kerja/edit",
  }),
  robots: { index: false, follow: false },
};

type EditProgramParams = {
  params: Promise<{ id: string }>;
};

export default async function EditProgramPage({ params }: EditProgramParams) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: program, error } = await supabase
    .from("programs")
    .select("id, title, category, description, status, target")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Gagal memuat program kerja untuk edit:", error.message);
  }

  if (!program) {
    return (
      <div>
        <LinkButton href="/admin/program-kerja" variant="ghost" size="sm" className="-ml-3">
          <ArrowLeftIcon className="h-4 w-4" />
          Kembali
        </LinkButton>

        <div className="mt-8 rounded-card border border-dashed border-slate-300 bg-background px-6 py-12 text-center">
          <ClipboardListIcon className="mx-auto h-8 w-8 text-slate-500" />
          <h1 className="mt-4 text-h4 text-foreground">Program tidak ditemukan</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Program yang ingin diedit tidak ada atau sudah dihapus.
          </p>
          <LinkButton href="/admin/program-kerja" variant="primary" className="mt-5">
            Kembali ke Daftar Program
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <LinkButton href="/admin/program-kerja" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
        Program Kerja
      </p>
      <h1 className="mt-2 text-h2 text-foreground">Edit Program Kerja</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Perubahan yang disimpan langsung tercermin di halaman publik.
      </p>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <ProgramForm
          id={program.id}
          action={updateProgram}
          submitLabel="Simpan Perubahan"
          initial={{
            title: program.title,
            category: program.category,
            description: program.description,
            status: program.status ?? "",
            target: program.target ?? "",
          }}
        />
      </Card>
    </div>
  );
}