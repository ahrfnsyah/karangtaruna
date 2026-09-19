import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { CalendarIcon, UsersIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { iconMap, type IconName } from "@/lib/icons";
import type { ProgramKerjaItem } from "@/lib/types";

type DaftarProgramProps = {
  programs: ProgramKerjaItem[];
  error?: string | null;
};

export function DaftarProgram({ programs, error }: DaftarProgramProps) {
  if (error) {
    return (
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Daftar Program"
            title="Bidang dan Program Kerja"
            description="Berbagai bidang kegiatan yang menjadi fokus Karang Taruna dalam melayani pemuda dan masyarakat."
          />
          <div className="mt-12 rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
            <UsersIcon className="mx-auto h-10 w-10 text-slate-500" />
            <h3 className="mt-4 text-h4 text-foreground">
              Program kerja tidak dapat ditampilkan
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Terjadi kendala saat mengambil data. Silakan coba kembali beberapa
              saat lagi.
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  if (programs.length === 0) {
    return (
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Daftar Program"
            title="Bidang dan Program Kerja"
            description="Berbagai bidang kegiatan yang menjadi fokus Karang Taruna dalam melayani pemuda dan masyarakat."
          />
          <div className="mt-12 rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
            <UsersIcon className="mx-auto h-10 w-10 text-slate-500" />
            <h3 className="mt-4 text-h4 text-foreground">Belum ada program kerja</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Program kerja sedang disusun dan akan segera ditampilkan di sini.
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Daftar Program"
          title="Bidang dan Program Kerja"
          description="Berbagai bidang kegiatan yang menjadi fokus Karang Taruna dalam melayani pemuda dan masyarakat."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => {
            const Icon = iconMap[program.icon as IconName] ?? iconMap.users;
            return (
              <Card key={program.title} className="flex flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-primary-50 text-primary-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <Badge variant="primary">{program.category}</Badge>
                </div>
                <h3 className="mt-5 text-h4 text-foreground">{program.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {program.description}
                </p>
                <div className="mt-5 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <p className="inline-flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                    {program.status}
                  </p>
                  <p className="inline-flex items-start gap-1.5">
                    <UsersIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Penerima manfaat: {program.target}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}