import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { TentangSectionItem } from "@/lib/types";
import { iconMap } from "@/lib/icons";

type RolesProps = {
  items: TentangSectionItem[];
};

export function Roles({ items }: RolesProps) {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Peran Pemuda"
          title="Kontribusi Pemuda untuk Lingkungan"
          description="Peran yang kami jalankan untuk menghadirkan manfaat nyata di lingkungan sekitar."
        />
        {items.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((role) => {
              const Icon = iconMap[role.icon as keyof typeof iconMap] ?? iconMap.users;
              return (
                <Card key={role.title} className="p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-control bg-accent-50 text-accent-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-h4 text-foreground">{role.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {role.description}
                  </p>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">
            Peran pemuda akan segera diperbarui.
          </p>
        )}
      </Container>
    </Section>
  );
}