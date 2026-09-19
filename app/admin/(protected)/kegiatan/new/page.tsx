import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

import { ActivityForm } from "@/components/admin/activity-form";

import { createActivity } from "../actions";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Tambah Kegiatan",
    description: "Tambah kegiatan baru Karang Taruna RT 04 RW 08 Srengseng Sawah.",
    path: "/admin/kegiatan/new",
  }),
  robots: { index: false, follow: false },
};

type ProgramOption = {
  id: string;
  title: string;
};

async function getPublishedPrograms(): Promise<ProgramOption[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("programs")
      .select("id, title")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    return (data ?? []) as ProgramOption[];
  } catch (err) {
    console.error("Gagal mengambil program untuk pilihan kegiatan:", err);
    return [];
  }
}

export default async function NewActivityPage() {
  const programs = await getPublishedPrograms();

  return (
    <div>
      <LinkButton href="/admin/kegiatan" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Kegiatan</p>
      <h1 className="mt-2 text-h2 text-foreground">Tambah Kegiatan</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Kegiatan yang ditayangkan langsung muncul di halaman publik &ldquo;Kegiatan&rdquo;.
      </p>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <ActivityForm action={createActivity} programs={programs} submitLabel="Simpan Kegiatan" />
      </Card>
    </div>
  );
}