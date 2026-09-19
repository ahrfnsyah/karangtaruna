import { Cta } from "@/components/tentang/cta";
import { Mission } from "@/components/tentang/mission";
import { Profile } from "@/components/tentang/profile";
import { Roles } from "@/components/tentang/roles";
import { Struktur } from "@/components/tentang/struktur";
import { Values } from "@/components/tentang/values";
import { Vision } from "@/components/tentang/vision";
import { Container } from "@/components/ui/container";
import { UsersIcon } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import type { TentangData } from "@/lib/types";

export const metadata = pageMetadata({
  title: "Tentang Kami",
  description:
    "Mengenal Karang Taruna RT 04 RW 08 Srengseng Sawah: wadah kepemudaan yang aktif dalam kegiatan sosial, pengembangan potensi pemuda, kreativitas, dan kontribusi kepada masyarakat.",
  path: "/tentang",
});

/*
 * Supabase Server Client berbasis cookie => halaman tidak bisa di-prerender
 * statis. force-dynamic membuat data selalu dirender server-side dan segar,
 * konsisten dengan /program-kerja, /kegiatan, /berita, dan /galeri.
 */
export const dynamic = "force-dynamic";

async function getTentang(): Promise<{
  data: TentangData | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const [settingsResult, aboutResult, teamResult, statsResult] = await Promise.all([
      supabase
        .from("site_settings")
        .select("vision, about_paragraphs")
        .eq("id", 1)
        .maybeSingle(),
      supabase
        .from("about_items")
        .select("title, description, icon, section, sort_order")
        .eq("is_published", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("team_members")
        .select("name, position, group_name, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("stats")
        .select("label, value, sort_order")
        .eq("is_published", true)
        .order("sort_order", { ascending: true }),
    ]);

    if (settingsResult.error || aboutResult.error || teamResult.error) {
      const message =
        settingsResult.error?.message ??
        aboutResult.error?.message ??
        teamResult.error?.message;
      console.error("Gagal mengambil data /tentang dari Supabase:", message);
      return { data: null, error: "Konten halaman sementara tidak dapat ditampilkan." };
    }

    const aboutRows = (aboutResult.data ?? []) as Array<{
      title: string;
      description: string;
      icon: string;
      section: "mission" | "value" | "role";
    }>;

    const teamRows = (teamResult.data ?? []) as Array<{
      name: string;
      position: string;
      group_name: "pengurus" | "divisi";
    }>;

    const bySection = (section: "mission" | "value" | "role") =>
      aboutRows
        .filter((row) => row.section === section)
        .map((row) => ({ title: row.title, description: row.description, icon: row.icon }));

    return {
      data: {
        profile: [...(settingsResult.data?.about_paragraphs ?? [])],
        vision: settingsResult.data?.vision ?? null,
        missions: bySection("mission"),
        values: bySection("value"),
        roles: bySection("role"),
        team: {
          kepengurusan: teamRows
            .filter((row) => row.group_name === "pengurus")
            .map((row) => ({ jabatan: row.position, nama: row.name })),
          divisi: teamRows
            .filter((row) => row.group_name === "divisi")
            .map((row) => ({ jabatan: row.position, nama: row.name })),
        },
        stats: (statsResult.data ?? []).map((row) => ({
          value: row.value,
          label: row.label,
        })),
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui";
    console.error("Gagal mengambil data /tentang dari Supabase:", message);
    return { data: null, error: "Konten halaman sementara tidak dapat ditampilkan." };
  }
}

export default async function TentangPage() {
  const { data, error } = await getTentang();

  if (error || !data) {
    return (
      <>
        <PageHero
          eyebrow="Tentang Kami"
          title="Mengenal Karang Taruna RT 04 RW 08"
          description="Wadah kepemudaan yang berperan dalam kegiatan sosial, pengembangan potensi pemuda, kreativitas, kebersamaan, dan kontribusi kepada masyarakat."
        />
        <Section>
          <Container>
            <div className="rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
              <UsersIcon className="mx-auto h-10 w-10 text-slate-500" />
              <h3 className="mt-4 text-h4 text-foreground">
                Konten tidak dapat ditampilkan
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Terjadi kendala saat mengambil data. Silakan coba kembali
                beberapa saat lagi.
              </p>
            </div>
          </Container>
        </Section>
        <Cta />
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title="Mengenal Karang Taruna RT 04 RW 08"
        description="Wadah kepemudaan yang berperan dalam kegiatan sosial, pengembangan potensi pemuda, kreativitas, kebersamaan, dan kontribusi kepada masyarakat."
      />
      {data.stats.length > 0 ? (
        <div className="grid gap-8 border-y border-border bg-accent-50 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {data.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-h3 font-bold text-accent-700">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      ) : null}
      <Profile paragraphs={data.profile} />
      <Vision vision={data.vision} />
      <Mission items={data.missions} />
      <Values items={data.values} />
      <Struktur struktur={data.team} />
      <Roles items={data.roles} />
      <Cta />
    </>
  );
}