import Image from "next/image";

import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { GalleryPreviewItem } from "@/lib/types";
import { resolveGambar } from "@/lib/utils";

type GalleryPreviewProps = {
  items: GalleryPreviewItem[];
  error: string | null;
};

export function GalleryPreview({ items, error }: GalleryPreviewProps) {
  return (
    <Section muted>
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Galeri"
          title="Dokumentasi Setiap Kebersamaan"
          description="Foto-foto kegiatan Karang Taruna bersama warga RT 04 RW 08."
        />
        {error ? (
          <div className="mt-12 rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Belum ada dokumentasi foto yang bisa ditampilkan.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-12 grid auto-rows-[140px] grid-cols-2 gap-3 sm:gap-4 md:auto-rows-[200px] md:grid-cols-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-card ${index === 0 ? "col-span-2 row-span-2" : ""}`}
                >
                  <Image
                    src={resolveGambar(item.image_path)}
                    alt={item.image_alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <LinkButton href="/galeri" variant="outline" size="lg">
                Lihat Semua Galeri
              </LinkButton>
            </div>
          </>
        )}
      </Container>
    </Section>
  );
}