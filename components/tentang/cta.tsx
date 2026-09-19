import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function Cta() {
  return (
    <Section>
      <Container>
        <div className="rounded-overlay border border-border bg-muted px-6 py-14 text-center md:px-16 md:py-16">
          <h2 className="mx-auto max-w-2xl text-h2 text-foreground">
            Mari Berkontribusi Bersama Kami
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Lihat kegiatan kami atau hubungi kami untuk berpartisipasi
            dalam membangun lingkungan yang lebih baik.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton href="/kegiatan" variant="accent" size="lg">
              Lihat Kegiatan
            </LinkButton>
            <LinkButton href="/kontak" variant="outline" size="lg">
              Hubungi Kami
            </LinkButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}