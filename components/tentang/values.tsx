import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { TentangSectionItem } from "@/lib/types";
import { iconMap } from "@/lib/icons";

type ValuesProps = {
  items: TentangSectionItem[];
};

export function Values({ items }: ValuesProps) {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Nilai Organisasi"
          title="Prinsip yang Kami Pegang"
          description="Nilai-nilai ini menjadi pedoman dalam setiap langkah organisasi."
        />
        {items.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((value) => {
              const Icon = iconMap[value.icon as keyof typeof iconMap] ?? iconMap.users;
              return (
                <Card key={value.title} className="p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-control bg-primary-50 text-primary-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-h4 text-foreground">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">
            Daftar nilai organisasi akan segera diperbarui.
          </p>
        )}
      </Container>
    </Section>
  );
}