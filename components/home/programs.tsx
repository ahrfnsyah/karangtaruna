import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { HeartIcon, LightbulbIcon, TrophyIcon, UsersIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { featuredPrograms, type Program } from "@/lib/data/home";

const iconByName: Record<Program["icon"], typeof UsersIcon> = {
  users: UsersIcon,
  heart: HeartIcon,
  trophy: TrophyIcon,
  lightbulb: LightbulbIcon,
};

export function Programs() {
  return (
    <Section muted>
      <Container>
        <SectionHeading
          eyebrow="Program Unggulan"
          title="Empat Pilar Kegiatan Kami"
          description="Program kerja yang menjadi fokus Karang Taruna untuk menumbuhkan pemuda yang aktif dan bermanfaat."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPrograms.map((program) => {
            const Icon = iconByName[program.icon];
            return (
              <Card key={program.title} className="p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-control bg-primary-50 text-primary-700">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-h4 text-foreground">{program.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {program.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}