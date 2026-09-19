import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function BeritaNotFound() {
  return (
    <Section>
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">404</p>
        <h1 className="mt-3 text-h1 text-foreground">Berita Tidak Ditemukan</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Berita yang Anda cari tidak tersedia atau telah dihapus. Silakan
          kembali ke halaman berita untuk melihat kabar terbaru lainnya.
        </p>
        <div className="mt-8">
          <LinkButton href="/berita" variant="primary" size="lg">
            Kembali ke Berita
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}