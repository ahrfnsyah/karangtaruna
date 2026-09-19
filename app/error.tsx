"use client";

import { Button, LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <Section>
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
          Terjadi Kesalahan
        </p>
        <h1 className="mt-3 text-h1 text-foreground">Ada yang Tidak Berjalan Semestinya</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Maaf, halaman ini gagal dimuat. Silakan coba muat ulang, atau kembali
          menjelajahi halaman lain.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="primary" size="lg" onClick={reset}>
            Coba Lagi
          </Button>
          <LinkButton href="/" variant="outline" size="lg">
            Kembali ke Beranda
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}
