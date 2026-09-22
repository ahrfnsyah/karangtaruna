import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icons";

import { TentangItemForm } from "@/components/admin/tentang-item-form";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

import { updateAboutItem } from "../../../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Edit Misi",
    description: "Edit misi Karang Taruna.",
    path: "/admin/tentang/mission/edit",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

type EditMissionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditMissionPage({
  params,
}: EditMissionPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("about_items")
    .select(
      "id, section, title, description, icon, sort_order, is_published",
    )
    .eq("id", id)
    .eq("section", "mission")
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

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

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
          Tentang
        </p>

        <h1 className="mt-2 text-h2 text-foreground">
          Edit Misi
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Perbarui informasi misi Karang Taruna.
        </p>
      </div>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <TentangItemForm
          action={updateAboutItem}
          submitLabel="Simpan Perubahan"
          id={data.id}
          initial={{
            section: data.section,
            title: data.title,
            description: data.description,
            icon: data.icon,
            sort_order: data.sort_order,
            is_published: data.is_published,
          }}
        />
      </Card>
    </div>
  );
}