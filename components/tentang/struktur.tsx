import { Fragment } from "react";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { UsersIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PengurusItem } from "@/lib/types";

type StrukturProps = {
  struktur: {
    kepengurusan: PengurusItem[];
    divisi: PengurusItem[];
  };
};

type Kelompok = {
  jabatan: string;
  nama: string[];
};

/* Kelompokkan pengurus per jabatan tanpa menghilangkan anggota. */
function kelompokkan(items: PengurusItem[]): Kelompok[] {
  const result: Kelompok[] = [];

  for (const item of items) {
    if (item.jabatan.startsWith("divisi_")) {
      continue;
    }

    const existing = result.find((k) => k.jabatan === item.jabatan);

    if (existing) {
      existing.nama.push(item.nama);
    } else {
      result.push({
        jabatan: item.jabatan,
        nama: [item.nama],
      });
    }
  }

  return result;
}

function KelompokCard({ jabatan, nama }: Kelompok) {
  return (
    <Card className="mx-auto w-full max-w-[260px] p-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
          <UsersIcon className="h-4 w-4" />
        </span>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-snug text-foreground">
            {jabatan}
          </p>

          <div className="mt-0.5 space-y-0.5">
            {nama.map((n) => (
              <p
                key={n}
                className="truncate text-xs leading-snug text-muted-foreground"
              >
                {n}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Connector() {
  return (
    <div
      aria-hidden="true"
      className="h-4 w-px shrink-0 bg-slate-300"
    />
  );
}

export function Struktur({ struktur }: StrukturProps) {
  const jabatan = kelompokkan(struktur.kepengurusan);
  const divisiItems = struktur.divisi;

  // Normalisasi jabatan agar "Sekretaris", "sekretaris", dll tetap terbaca.
  const sekretarisBendahara = jabatan.filter((k) => {
    const normalized = k.jabatan.trim().toLowerCase();

    return normalized === "sekretaris" || normalized === "bendahara";
  });

  const bawahLain = jabatan.filter((k) => {
    const normalized = k.jabatan.trim().toLowerCase();

    return normalized !== "sekretaris" && normalized !== "bendahara";
  });

  return (
    <Section>
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Struktur Organisasi"
          title="Susunan Pengurus"
          description="Susunan pengurus Karang Taruna."
        />

        {jabatan.length === 0 ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Susunan pengurus akan segera diperbarui.
          </p>
        ) : (
          <div className="mt-10 flex flex-col items-center">
            {/* Jabatan utama: Ketua, Wakil Ketua, dan jabatan lainnya */}
            {bawahLain.map((k, i) => (
              <Fragment key={k.jabatan}>
                {i > 0 ? <Connector /> : null}

                <KelompokCard
                  jabatan={k.jabatan}
                  nama={k.nama}
                />
              </Fragment>
            ))}

            {/* Sekretaris & Bendahara sejajar */}
            {sekretarisBendahara.length > 0 ? (
              <>
                <Connector />

                <div className="grid w-full max-w-[540px] grid-cols-1 gap-3 sm:grid-cols-2">
                  {sekretarisBendahara.map((k) => (
                    <KelompokCard
                      key={k.jabatan}
                      jabatan={k.jabatan}
                      nama={k.nama}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* Divisi */}
        {divisiItems.length > 0 ? (
          <div className="mx-auto mt-10 grid w-full max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {divisiItems.map((item) => (
              <Card
                key={`${item.jabatan}-${item.nama}`}
                className="p-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                    <UsersIcon className="h-4 w-4" />
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold leading-snug text-foreground">
                      {item.jabatan}
                    </p>

                    <p className="truncate text-xs leading-snug text-muted-foreground">
                      {item.nama}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}