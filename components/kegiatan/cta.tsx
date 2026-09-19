import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function Cta() {
  return (
    <Section>
      <Container>
        <div className="rounded-overlay border border-border bg-muted px-6 py-14 text-center md:px-16 md:py-16">
          <h2 className="mx-auto max-w-2xl text-h2 text-foreground">
            Ingin Tahu Lebih Jauh tentang Kami?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Kenali lebih dekat Karang Taruna RT 04 RW 08 atau hubungi kami
            untuk berpartisipasi dalam kegiatan.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton href="/tentang" variant="outline" size="lg">
              Tentang Kami
            </LinkButton>
            <LinkButton href="/kontak" variant="accent" size="lg">
              Hubungi Kami
            </LinkButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}