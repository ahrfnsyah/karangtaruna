import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon, CameraIcon } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";

import { ActivityForm } from "@/components/admin/activity-form";

import { updateActivity } from "../../actions";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Edit Kegiatan",
    description: "Perbarui kegiatan Karang Taruna RT 04 RW 08 Srengseng Sawah.",
    path: "/admin/kegiatan/edit",
  }),
  robots: { index: false, follow: false },
};

type EditActivityParams = {
  params: Promise<{ id: string }>;
};

type ProgramOption = {
  id: string;
  title: string;
};

export default async function EditActivityPage({ params }: EditActivityParams) {
  const { id } = await params;

  const supabase = await createClient();

  const [activityResult, programsResult] = await Promise.all([
    supabase
      .from("activities")
      .select(
        "id, slug, title, category, event_date, location, excerpt, description, status, image_path, image_alt, program_id, is_published",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("programs")
      .select("id, title")
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
  ]);

  const { data: activity, error } = activityResult;
  const programs = ((programsResult.data ?? []) as ProgramOption[]) ?? [];

  if (error) {
    console.error("Gagal memuat kegiatan untuk edit:", error.message);
  }

  if (!activity) {
    return (
      <div>
        <LinkButton href="/admin/kegiatan" variant="ghost" size="sm" className="-ml-3">
          <ArrowLeftIcon className="h-4 w-4" />
          Kembali
        </LinkButton>

        <div className="mt-8 rounded-card border border-dashed border-slate-300 bg-background px-6 py-12 text-center">
          <CameraIcon className="mx-auto h-8 w-8 text-slate-500" />
          <h1 className="mt-4 text-h4 text-foreground">Kegiatan tidak ditemukan</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Kegiatan yang ingin diedit tidak ada atau sudah dihapus.
          </p>
          <LinkButton href="/admin/kegiatan" variant="primary" className="mt-5">
            Kembali ke Daftar Kegiatan
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <LinkButton href="/admin/kegiatan" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </LinkButton>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Kegiatan</p>
      <h1 className="mt-2 text-h2 text-foreground">Edit Kegiatan</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Perubahan yang disimpan langsung tercermin di halaman publik, termasuk URL jika slug
        diubah.
      </p>

      <Card className="mt-6 max-w-3xl p-6 md:p-8">
        <ActivityForm
          id={activity.id}
          action={updateActivity}
          programs={programs}
          submitLabel="Simpan Perubahan"
          initial={{
            title: activity.title,
            slug: activity.slug,
            category: activity.category,
            event_date: activity.event_date,
            location: activity.location ?? "",
            excerpt: activity.excerpt ?? "",
            description: activity.description,
            status: activity.status ?? "",
            image_path: activity.image_path ?? "",
            image_alt: activity.image_alt ?? "",
            program_id: activity.program_id ?? "",
            is_published: activity.is_published,
          }}
        />
      </Card>
    </div>
  );
}