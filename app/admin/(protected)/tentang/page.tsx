import type { Metadata } from "next";

import {
  Card,

} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";

import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

import { ConfirmDelete } from "@/components/admin/confirm-delete";

import { deleteAboutItem, deleteTeamMember } from "./actions";

import { TentangStatsSection } from "@/components/admin/tentang-stats-section";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Manajemen Tentang",
    description: "Kelola halaman Tentang Karang Taruna: misi, visi, nilai, dan pengurus.",
    path: "/admin/tentang",
  }),
  robots: { index: false, follow: false },
};

type SectionSet = "mission" | "value" | "role";

const SECTION_META: Record<SectionSet, { label: string; hint: string }> = {
  mission: { label: "Misi", hint: "Misi-misi Karang Taruna." },
  value: { label: "Nilai", hint: "Nilai yang dijunjung." },
  role: { label: "Peran", hint: "Peran dalam masyarakat." },
};

type AboutRow = {
  id: string;
  section: SectionSet;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  is_published: boolean;
};

type SettingsRow = {
  vision: string | null;
  about_paragraphs: string[];
};

async function getSettings(): Promise<{ data: SettingsRow | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("vision, about_paragraphs")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return { data: (data as SettingsRow | null) ?? null, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan tak diketahui";
    console.error("Gagal memuat pengaturan tentang:", message);
    return { data: null, error: "Pengaturan tentang tidak dapat dimuat." };
  }
}

async function getAboutItems(): Promise<{ items: AboutRow[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("about_items")
      .select(
        "id, section, title, description, icon, sort_order, is_published",
      )
      .order("section", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return { items: (data as AboutRow[]) ?? [], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan tak diketahui";
    console.error("Gagal memuat item tentang:", message);
    return { items: [], error: "Item tentang tidak dapat dimuat." };
  }
}

async function getTeam(): Promise<{ items: TeamRow[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("id, name, position, group_name, sort_order, is_active")
      .order("group_name", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return { items: (data as TeamRow[]) ?? [], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan tak diketahui";
    console.error("Gagal memuat pengurus:", message);
    return { items: [], error: "Pengurus tidak dapat dimuat." };
  }
}

type TeamRow = {
  id: string;
  name: string;
  position: string;
  group_name: "pengurus" | "divisi";
  sort_order: number;
  is_active: boolean;
};

const GROUP_META: Record<"pengurus" | "divisi", { label: string; hint: string }> = {
  pengurus: { label: "Pengurus", hint: "Pengurus inti Karang Taruna." },
  divisi: { label: "Divisi", hint: "Anggota per divisi." },
};

export default async function AdminTentangPage() {
  const [settings, about, team] = await Promise.all([
    getSettings(),
    getAboutItems(),
    getTeam(),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
            Manajemen Konten
          </p>
          <h1 className="mt-2 text-h2 text-foreground">Tentang</h1>
          <p className="mt-2 text-muted-foreground">
            Kelola visi, misi, nilai, peran, dan pengurus yang tampil di halaman publik
            &ldquo;Tentang&rdquo;.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href="/admin/tentang/settings" variant="outline" size="sm">
            Pengaturan
          </LinkButton>
        </div>
      </div>

      {settings.error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-accent-700">
          {settings.error}
        </p>
      ) : null}
      {about.error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-accent-700">
          {about.error}
        </p>
      ) : null}
      {team.error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-accent-700">
          {team.error}
        </p>
      ) : null}

      <div className="mt-8 space-y-8">
        <section aria-labelledby="visi-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="visi-heading" className="text-h3 text-foreground">
                Visi &amp; Paragraf
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Visi dan paragraf pembuka halaman publik.
              </p>
            </div>
            <LinkButton href="/admin/tentang/settings" variant="outline" size="sm">
              Ubah
            </LinkButton>
          </div>

          <Card className="mt-3 p-6">
            {settings.data ? (
              <div className="prose-sm max-w-2xl">
                <h3 className="text-sm font-semibold text-foreground">Visi</h3>
                <p className={cn("mt-1 text-sm text-muted-foreground", !settings.data?.vision && "italic")}>
                  {settings.data.vision || "Belum diisi."}
                </p>
                <h3 className="mt-4 text-sm font-semibold text-foreground">Paragraf Tentang</h3>
                {settings.data.about_paragraphs?.length
                  ? settings.data.about_paragraphs.map((paragraph, index) => (
                      <p key={index} className="mt-2 text-sm text-muted-foreground">
                        {paragraph}
                      </p>
                    ))
                  : <p className="mt-1 text-sm italic text-muted-foreground">Belum diisi.</p>}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Pengaturan belum tersedia.</p>
            )}
          </Card>
        </section>

        {(Object.keys(SECTION_META) as SectionSet[]).map((section) => {
          const items = about.items.filter((item) => item.section === section);
          return (
            <section key={section} aria-labelledby={`section-${section}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 id={`section-${section}`} className="text-h3 text-foreground">
                    {SECTION_META[section].label}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{SECTION_META[section].hint}</p>
                </div>
                <LinkButton
                  href={`/admin/tentang/${section}/new`}
                  size="sm"
                >
                  <PlusIcon className="h-4 w-4" />
                  Tambah
                </LinkButton>
              </div>

              {about.error ? (
                <p role="alert" className="mt-4 text-sm text-accent-700">
                  {about.error}
                </p>
              ) : null}

              <Card className="mt-3 overflow-hidden">
                {items.length === 0 ? (
                  <p className="p-6 text-sm text-muted-foreground">
                    Belum ada item untuk bagian ini.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Urutan {item.sort_order}
                            {item.is_published ? (
                              <Badge className="ml-2 bg-primary-50 text-primary-700">Tayang</Badge>
                            ) : (
                              <Badge className="ml-2 bg-muted text-muted-foreground">
                                Draf
                              </Badge>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <LinkButton
                            href={`/admin/tentang/${section}/${item.id}/edit`}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </LinkButton>
                          <ConfirmDelete
                            id={item.id}
                            title={item.title}
                            action={deleteAboutItem}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </section>
          );
        })}

        <section aria-labelledby="team-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="team-heading" className="text-h3 text-foreground">
                Pengurus
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pengurus dan divisi Karang Taruna.
              </p>
            </div>
            <LinkButton href="/admin/tentang/team/new" size="sm">
              <PlusIcon className="h-4 w-4" />
              Tambah
            </LinkButton>
          </div>

          {team.error ? (
            <p role="alert" className="mt-4 text-sm text-accent-700">
              {team.error}
            </p>
          ) : null}

          <Card className="mt-3 overflow-hidden">
            {team.items.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                Belum ada pengurus yang dicatat.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {team.items.map((member) => (
                  <li
                    key={member.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {member.position} &middot; {GROUP_META[member.group_name]?.label ?? member.group_name}
                        {member.is_active ? (
                          <Badge className="ml-2 bg-primary-50 text-primary-700">Aktif</Badge>
                        ) : (
                          <Badge className="ml-2 bg-muted text-muted-foreground">Nonaktif</Badge>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <LinkButton
                        href={`/admin/tentang/team/${member.id}/edit`}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </LinkButton>
                      <ConfirmDelete id={member.id} title={member.name} action={deleteTeamMember} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        <TentangStatsSection />
      </div>
    </div>
  );
}
