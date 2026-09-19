import { Container } from "@/components/ui/container";
import { QuoteIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";

type VisionProps = {
  vision: string | null;
};

export function Vision({ vision }: VisionProps) {
  if (!vision) {
    return null;
  }

  return (
    <Section>
      <Container>
        <div className="relative overflow-hidden rounded-overlay bg-primary-950 px-6 py-16 text-center md:px-16 md:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-600/30" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-14 h-48 w-48 rounded-full bg-accent-600/25" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-400">
              Visi Kami
            </p>
            <QuoteIcon className="mx-auto mt-6 h-10 w-10 text-accent-500/80" />
            <blockquote className="mx-auto mt-4 max-w-3xl text-h2 text-white">
              {vision}
            </blockquote>
          </div>
        </div>
      </Container>
    </Section>
  );
}