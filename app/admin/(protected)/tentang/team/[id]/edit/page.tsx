import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icons";

import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

import { TeamMemberForm } from "@/components/admin/tentang-team-form";

import { updateTeamMember } from "../../../actions";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Ubah Pengurus",
    description: "Perbarui pengurus atau anggota divisi Karang Taruna.",
    path: "/admin/tentang/team/edit",
  }),
  robots: { index: false, follow: false },
};

type EditTeamMemberPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_members")
    .select("id, name, position, group_name, sort_order, is_active")
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
      <h1 className="mt-2 text-h2 text-foreground">Ubah Pengurus</h1>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <TeamMemberForm
          action={updateTeamMember}
          submitLabel="Simpan Perubahan"
          id={data.id}
          initial={{
            name: data.name,
            position: data.position,
            group_name: data.group_name,
            sort_order: String(data.sort_order),
            is_active: data.is_active,
          }}
        />
      </Card>
    </div>
  );
}
