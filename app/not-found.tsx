import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Section>
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">404</p>
        <h1 className="mt-3 text-h1 text-foreground">Halaman Tidak Ditemukan</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan. Silakan kembali ke
          beranda untuk menjelajahi halaman lainnya.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/" variant="primary" size="lg">
            Kembali ke Beranda
          </LinkButton>
          <LinkButton href="/kontak" variant="outline" size="lg">
            Hubungi Kami
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}
