import { Cta } from "@/components/program-kerja/cta";
import { DaftarProgram } from "@/components/program-kerja/daftar-program";
import { ProgramUnggulan } from "@/components/program-kerja/program-unggulan";
import { PageHero } from "@/components/ui/page-hero";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import type { ProgramKerjaItem } from "@/lib/types";

/*
 * Halaman ini memakai Supabase Server Client berbasis cookie, yang membaca
 * request cookies sehingga tidak bisa di-prerender statis. force-dynamic
 * membuat Next.js selalu merender server-side saat request: data selalu
 * segar tanpa cache manual — strategi yang cocok untuk konten yang nantinya
 * dikelola admin. Tambahkan revalidatePath/revalidateTag belakangan hanya
 * jika pola render dinamis ini perlu dioptimalkan.
 */
export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Program Kerja",
  description:
    "Program dan bidang kegiatan Karang Taruna RT 04 RW 08 Srengseng Sawah: kepemudaan, sosial, olahraga, kreativitas, dan peduli lingkungan.",
  path: "/program-kerja",
});

/*
 * Ambil program kerja langsung dari public.programs (source of truth).
 * Hanya kolom yang dipakai halaman yang di-select.
 *
 * Caching: client server berbasis cookie membuat halaman ini dirender secara
 * dinamis setiap request, sehingga data selalu segar tanpa perlu cache manual.
 * Saat data mulai dikelola admin, revalidation (revalidatePath/revalidateTag)
 * hanya perlu ditambahkan jika memang diperlukan.
 */
async function getProgramKerja(): Promise<{
  programs: ProgramKerjaItem[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("programs")
      .select("title, category, description, status, target, icon, is_featured, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Gagal mengambil program kerja dari Supabase:", error.message);
      return {
        programs: [],
        error: "Program kerja sementara tidak dapat ditampilkan.",
      };
    }

    return {
      programs: (data ?? []) as ProgramKerjaItem[],
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengambil program kerja dari Supabase:", message);
    return {
      programs: [],
      error: "Program kerja sementara tidak dapat ditampilkan.",
    };
  }
}

export default async function ProgramKerjaPage() {
  const { programs, error } = await getProgramKerja();

  return (
    <>
      <PageHero
        eyebrow="Program Kerja"
        title="Program untuk Pemuda dan Masyarakat"
        description="Bidang dan program kerja yang menjadi fokus Karang Taruna RT 04 RW 08 untuk membangun lingkungan yang aktif dan saling peduli."
      />
      <DaftarProgram programs={programs} error={error} />
      <ProgramUnggulan programs={programs} />
      <Cta />
    </>
  );
}