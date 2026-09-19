import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type ProfileProps = {
  paragraphs: string[];
};

export function Profile({ paragraphs }: ProfileProps) {
  return (
    <Section>
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow="Profil Organisasi"
            title="Wadah Kepemudaan yang Tumbuh Bersama Masyarakat"
            description="Karang Taruna RT 04 RW 08 hadir sebagai rumah berkegiatan bagi pemuda Srengseng Sawah."
          />
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))
            ) : (
              <p>Profil organisasi akan segera diperbarui.</p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}