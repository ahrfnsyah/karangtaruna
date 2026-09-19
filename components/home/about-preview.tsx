import Image from "next/image";

import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const focusPoints = [
  "Pengembangan kepemudaan",
  "Kepedulian sosial & masyarakat",
  "Kreativitas dan kewirausahaan",
  "Kebersamaan dalam setiap kegiatan",
  "Kontribusi untuk lingkungan Srengseng Sawah",
];

export function AboutPreview() {
  return (
    <Section muted>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Image
              src="/images/placeholders/about.svg"
              alt="Kebersamaan anggota Karang Taruna dalam kegiatan (foto placeholder)"
              width={960}
              height={720}
              className="h-auto w-full rounded-card shadow-card"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
              Tentang Kami
            </p>
            <h2 className="text-h2 text-foreground">
              Bergerak Bersama Generasi Muda yang Peduli
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Karang Taruna RT 04 RW 08 adalah wadah organisasi kepemudaan
              yang aktif membangun lingkungan melalui berbagai kegiatan.
              Berfokus pada kepemudaan, sosial, kreativitas, kebersamaan,
              dan kontribusi kepada masyarakat sekitar.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {focusPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm font-medium text-foreground">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <LinkButton href="/tentang" variant="outline">
                Selengkapnya Tentang Kami
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}