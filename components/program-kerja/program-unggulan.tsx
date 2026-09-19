import { Container } from "@/components/ui/container";
import { UsersIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { iconMap, type IconName } from "@/lib/icons";
import type { ProgramKerjaItem } from "@/lib/types";

type ProgramUnggulanProps = {
  programs: ProgramKerjaItem[];
};

export function ProgramUnggulan({ programs }: ProgramUnggulanProps) {
  const unggulan = programs.filter((program) => program.is_featured);

  if (unggulan.length === 0) {
    return null;
  }

  return (
    <Section muted>
      <Container>
        <SectionHeading
          eyebrow="Program Unggulan"
          title="Fokus Utama Kami"
          description="Sejumlah program yang menjadi prioritas perhatian dan pengembangan organisasi."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {unggulan.map((program, index) => {
            const Icon = iconMap[program.icon as IconName] ?? iconMap.users;
            return (
              <article
                key={program.title}
                className="relative overflow-hidden rounded-card bg-primary-900 p-6 md:p-8"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-1 -top-8 text-7xl font-bold leading-none text-white/10 md:text-8xl"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    <Icon className="h-3.5 w-3.5" />
                    {program.category}
                  </span>
                  <h3 className="mt-5 text-h4 text-white">{program.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {program.description}
                  </p>
                  <p className="mt-5 flex items-start gap-1.5 border-t border-white/10 pt-4 text-xs text-slate-300">
                    <UsersIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Penerima manfaat: {program.target}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}