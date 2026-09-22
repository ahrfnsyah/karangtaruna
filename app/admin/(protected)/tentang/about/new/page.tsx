import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icons";

import { pageMetadata } from "@/lib/metadata";

import { TentangItemForm } from "@/components/admin/tentang-item-form";

import { createAboutItem } from "../../actions";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Tambah Misi, Nilai atau Peran",
    description: "Tambah konten Misi, Nilai, atau Peran.",
    path: "/admin/tentang/about/new",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

type NewAboutItemPageProps = {
  searchParams: Promise<{
    section?: string;
  }>;
};

export default async function NewAboutItemPage({
  searchParams,
}: NewAboutItemPageProps) {
  const params = await searchParams;

  const section =
    params.section === "mission" ||
    params.section === "value" ||
    params.section === "role"
      ? params.section
      : "mission";

  return (
    <div>
      <LinkButton
        href="/admin/tentang/about"
        variant="ghost"
        size="sm"
        className="-ml-3"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
        Tentang
      </p>

      <h1 className="mt-2 text-h2 text-foreground">
        Tambah{" "}
        {section === "mission"
          ? "Misi"
          : section === "value"
            ? "Nilai"
            : "Peran"}
      </h1>

      <p className="mt-2 max-w-2xl text-muted-foreground">
        Tambahkan konten baru untuk halaman publik Tentang.
      </p>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <TentangItemForm
          action={createAboutItem}
          submitLabel="Simpan"
          initial={{
            section,
            title: "",
            description: "",
            icon: "users",
            sort_order: "1",
            is_published: true,
          }}
        />
      </Card>
    </div>
  );
}