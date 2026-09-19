import { Card } from "@/components/ui/card";
import { LinkButton, LinkButton as LinkBtn } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";

import { createClient } from "@/lib/supabase/server";

import { ConfirmDelete } from "@/components/admin/confirm-delete";

import { deleteStat } from "@/app/admin/(protected)/tentang/actions";

type StatRow = {
  id: string;
  label: string;
  value: string;
  sort_order: number;
  is_published: boolean;
};

export async function TentangStatsSection() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stats")
    .select("id, label, value, sort_order, is_published")
    .order("sort_order", { ascending: true });

  const stats = (data as StatRow[] | null) ?? [];

  return (
    <section aria-labelledby="stats-heading" className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="stats-heading" className="text-h3 text-foreground">
            Statistik
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Angka yang tampil di bagian &ldquo;Statistik&rdquo; halaman publik.
          </p>
        </div>
        <LinkButton href="/admin/tentang/stats/new" size="sm">
          <PlusIcon className="h-4 w-4" />
          Tambah
        </LinkButton>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm font-medium text-accent-700">
          Statistik tidak dapat dimuat.
        </p>
      ) : null}

      <Card className="mt-3 overflow-hidden">
        {stats.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            Belum ada statistik yang dicatat.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {stats.map((stat) => (
              <li
                key={stat.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{stat.label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{stat.value}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <LinkBtn
                    href={`/admin/tentang/stats/${stat.id}/edit`}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </LinkBtn>
                  <ConfirmDelete id={stat.id} title={stat.label} action={deleteStat} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
