import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { LinkButton } from "@/components/ui/button";
import { pageMetadata } from "@/lib/metadata";

import { ProgramForm } from "@/components/admin/program-form";

import { createProgram } from "../actions";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Tambah Program Kerja",
    description: "Tambah program kerja baru Karang Taruna RT 04 RW 08 Srengseng Sawah.",
    path: "/admin/program-kerja/new",
  }),
  robots: { index: false, follow: false },
};

export default function NewProgramPage() {
  return (
    <div>
      <LinkButton href="/admin/program-kerja" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
        Program Kerja
      </p>
      <h1 className="mt-2 text-h2 text-foreground">Tambah Program Kerja</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Program yang disimpan langsung ditampilkan di halaman publik &ldquo;Program Kerja&rdquo;.
      </p>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <ProgramForm action={createProgram} submitLabel="Simpan Program" />
      </Card>
    </div>
  );
}