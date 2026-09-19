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

function MemberCard({ jabatan, nama }: PengurusItem) {
  return (
    <Card className="h-full p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
          <UsersIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug text-foreground">{jabatan}</p>
          <p className="text-xs text-muted-foreground">{nama}</p>
        </div>
      </div>
    </Card>
  );
}

function Connector() {
  return <div aria-hidden="true" className="h-8 w-px shrink-0 bg-slate-300" />;
}

export function Struktur({ struktur }: StrukturProps) {
  // Layout hierarki dirancang untuk 4 posisi kepengurusan (sesuai seed).
  const [ketua, wakil, sekretaris, bendahara] = struktur.kepengurusan;
  const showHierarchy = struktur.kepengurusan.length >= 4;
  const showDivisi = struktur.divisi.length > 0;

  return (
    <Section muted>
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Struktur Organisasi"
          title="Susunan Pengurus"
          description="Nama pengurus masih berupa placeholder dan akan diperbarui sesuai data resmi organisasi."
        />
        {!showHierarchy && !showDivisi ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Susunan pengurus akan segera diperbarui.
          </p>
        ) : (
          <div className="mt-12 flex flex-col items-center">
            {showHierarchy ? (
              <>
                <MemberCard {...ketua} />
                <Connector />
                <MemberCard {...wakil} />
                <Connector />
                <div className="grid w-full max-w-xl gap-3 sm:grid-cols-2">
                  <MemberCard {...sekretaris} />
                  <MemberCard {...bendahara} />
                </div>
              </>
            ) : null}
            {showHierarchy && showDivisi ? <Connector /> : null}
            {showDivisi ? (
              <div className="grid w-full grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                {struktur.divisi.map((divisi) => (
                  <MemberCard key={divisi.jabatan} {...divisi} />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </Container>
    </Section>
  );
}