import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icons";

import { TentangItemForm } from "@/components/admin/tentang-item-form";
import { pageMetadata } from "@/lib/metadata";

import { createAboutItem } from "../../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Tambah Peran",
    description: "Tambah peran Karang Taruna.",
    path: "/admin/tentang/role/new",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewRolePage() {
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
          Tambah Peran
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Tambahkan peran baru yang akan ditampilkan pada halaman Tentang.
        </p>
      </div>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <TentangItemForm
          action={createAboutItem}
          submitLabel="Simpan Peran"
          initial={{
            section: "role",
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