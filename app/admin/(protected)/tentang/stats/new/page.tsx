import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icons";

import { pageMetadata } from "@/lib/metadata";

import { TentangStatForm } from "@/components/admin/tentang-stat-form";

import { createStat } from "../../actions";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Tambah Statistik",
    description: "Tambah angka statistik baru untuk halaman Tentang.",
    path: "/admin/tentang/stats/new",
  }),
  robots: { index: false, follow: false },
};

export default function NewStatPage() {
  return (
    <div>
      <LinkButton href="/admin/tentang" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Tentang</p>
      <h1 className="mt-2 text-h2 text-foreground">Tambah Statistik</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Statistik baru langsung tampil di bagian &ldquo;Statistik&rdquo; halaman publik.
      </p>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <TentangStatForm action={createStat} submitLabel="Simpan" />
      </Card>
    </div>
  );
}
