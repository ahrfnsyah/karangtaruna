import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icons";

import { pageMetadata } from "@/lib/metadata";

import { TeamMemberForm } from "@/components/admin/tentang-team-form";

import { createTeamMember } from "../../actions";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Tambah Pengurus",
    description: "Tambah pengurus atau anggota divisi Karang Taruna.",
    path: "/admin/tentang/team/new",
  }),
  robots: { index: false, follow: false },
};

export default function NewTeamMemberPage() {
  return (
    <div>
      <LinkButton href="/admin/tentang" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Tentang</p>
      <h1 className="mt-2 text-h2 text-foreground">Tambah Pengurus</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Pengurus baru langsung tampil di bagian &ldquo;Pengurus&rdquo; halaman publik.
      </p>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <TeamMemberForm
          action={createTeamMember}
          submitLabel="Simpan Pengurus"
        />
      </Card>
    </div>
  );
}
