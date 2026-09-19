import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export function Cta() {
  return (
    <Section>
      <Container>
        <div className="relative overflow-hidden rounded-overlay bg-primary-950 px-6 py-16 text-center md:px-16 md:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-600/30" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-accent-600/25" />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-h2 text-white">
              Bangun kebersamaan, tumbuhkan kreativitas, dan bergerak bersama.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
              Mari berkontribusi untuk lingkungan yang lebih baik bersama
              Karang Taruna RT 04 RW 08. Kehadiran dan ide kamu sangat berarti.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton href="/kontak" variant="accent" size="lg">
                Hubungi Kami
              </LinkButton>
              <LinkButton href="/program-kerja" variant="outlineLight" size="lg">
                Lihat Program Kerja
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}