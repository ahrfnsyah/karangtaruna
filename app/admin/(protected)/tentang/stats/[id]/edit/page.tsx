import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icons";

import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

import { TentangStatForm } from "@/components/admin/tentang-stat-form";

import { updateStat } from "../../../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Ubah Statistik",
    description: "Perbarui angka statistik Karang Taruna.",
    path: "/admin/tentang/stats/edit",
  }),
  robots: { index: false, follow: false },
};

type EditStatPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditStatPage({ params }: EditStatPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stats")
    .select("id, label, value, sort_order, is_published")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  return (
    <div>
      <LinkButton href="/admin/tentang" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Tentang</p>
      <h1 className="mt-2 text-h2 text-foreground">Ubah Statistik</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Perubahan langsung tampil di bagian &ldquo;Statistik&rdquo; halaman publik.
      </p>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <TentangStatForm
          action={updateStat}
          submitLabel="Simpan Perubahan"
          id={data.id}
          initial={{
            label: data.label,
            value: data.value,
            sort_order: String(data.sort_order),
            is_published: data.is_published,
          }}
        />
      </Card>
    </div>
  );
}
