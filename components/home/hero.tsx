import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 hidden h-96 w-96 rounded-full bg-primary-50 lg:block" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 hidden h-80 w-80 rounded-full bg-accent-50 lg:block" />
      <Container className="relative py-16 md:py-24 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge variant="accent">Organisasi Kepemudaan</Badge>
            <h1 className="mt-6 text-display text-foreground">
              Karang Taruna <span className="text-primary-600">RT 04 RW 08</span>
            </h1>
            <p className="mt-4 text-h4 font-medium text-primary-700">
              Srengseng Sawah · Jagakarsa · Jakarta Selatan
            </p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Wadah generasi muda untuk tumbuh bersama, mengembangkan
              kreativitas, dan berkontribusi nyata kepada lingkungan melalui
              kegiatan kepemudaan, sosial, olahraga, dan kewirausahaan.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/kegiatan" size="lg">
                Lihat Kegiatan
              </LinkButton>
              <LinkButton href="/tentang" variant="outline" size="lg">
                Tentang Kami
              </LinkButton>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/images/placeholders/hero.svg"
              alt="Dokumentasi kegiatan Karang Taruna RT 04 RW 08 (foto placeholder)"
              width={1200}
              height={750}
              priority
              className="h-auto w-full rounded-card shadow-card"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}