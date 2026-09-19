import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { StatItem } from "@/lib/types";

type StatisticsProps = {
  stats: StatItem[];
  error: string | null;
};

export function Statistics({ stats, error }: StatisticsProps) {
  return (
    <Section>
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Data Organisasi"
          title="Karang Taruna dalam Angka"
          description="Gambaran singkat tentang organisasi, anggota, dan kegiatan kami."
        />
        {error ? (
          <div className="mt-12 rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              {error}
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-card border border-border bg-muted p-6 text-center md:p-8">
                <p className="text-h1 text-primary-700">{stat.value}</p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}