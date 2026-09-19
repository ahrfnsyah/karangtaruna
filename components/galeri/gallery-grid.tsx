"use client";

import { useState } from "react";

import { GalleryCard } from "@/components/galeri/gallery-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CameraIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { galleryCategories } from "@/lib/data/gallery";
import type { GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type GalleryGridProps = {
  initialItems: GalleryItem[];
};

export function GalleryGrid({ initialItems: items }: GalleryGridProps) {
  const [active, setActive] = useState<string>("Semua");

  const filtered =
    active === "Semua"
      ? items
      : items.filter((item) => item.category === active);

  if (items.length === 0) {
    return (
      <Section>
        <Container>
          <h2 className="sr-only">Daftar Foto Galeri</h2>
          <div className="mt-10 rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
            <CameraIcon className="mx-auto h-10 w-10 text-slate-500" />
            <h3 className="mt-4 text-h4 text-foreground">Belum ada foto</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Dokumentasi foto akan ditampilkan di sini setelah dipublikasikan.
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <h2 className="sr-only">Daftar Foto Galeri</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori galeri">
          {galleryCategories.map((category) => {
            const isActive = active === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(category)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-border bg-background text-slate-600 hover:border-slate-300 hover:text-foreground",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {filtered.map((item) => (
              <div key={item.id} className="mb-5">
                <GalleryCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
            <CameraIcon className="mx-auto h-10 w-10 text-slate-500" />
            <h3 className="mt-4 text-h4 text-foreground">Belum ada foto di kategori ini</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Coba pilih kategori lain, atau tampilkan kembali semua foto
              yang tersedia.
            </p>
            <Button variant="outline" size="md" className="mt-6" onClick={() => setActive("Semua")}>
              Tampilkan Semua
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}