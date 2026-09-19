import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="bg-muted">
      <Container className="py-14 md:py-20">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-h1 text-foreground">{title}</h1>
          {description ? (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}