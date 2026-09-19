import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function KegiatanNotFound() {
  return (
    <Section>
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">404</p>
        <h1 className="mt-3 text-h1 text-foreground">Kegiatan Tidak Ditemukan</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Halaman kegiatan yang Anda cari tidak tersedia atau telah dihapus.
          Silakan kembali ke daftar kegiatan untuk melihat dokumentasi lainnya.
        </p>
        <div className="mt-8">
          <LinkButton href="/kegiatan" variant="primary" size="lg">
            Kembali ke Kegiatan
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}