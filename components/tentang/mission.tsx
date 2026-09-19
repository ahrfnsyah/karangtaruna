import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { TentangSectionItem } from "@/lib/types";
import { iconMap } from "@/lib/icons";

type MissionProps = {
  items: TentangSectionItem[];
};

export function Mission({ items }: MissionProps) {
  return (
    <Section muted>
      <Container>
        <SectionHeading
          eyebrow="Misi Kami"
          title="Langkah Nyata untuk Pemuda dan Lingkungan"
          description="Komitmen yang kami jalankan melalui program dan kegiatan organisasi."
        />
        {items.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((mission) => {
              const Icon = iconMap[mission.icon as keyof typeof iconMap] ?? iconMap.users;
              return (
                <Card key={mission.title} className="p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-control bg-accent-50 text-accent-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-h4 text-foreground">{mission.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {mission.description}
                  </p>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">
            Daftar misi akan segera diperbarui.
          </p>
        )}
      </Container>
    </Section>
  );
}