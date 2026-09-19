"use client";

import { useState } from "react";

import { NewsCard } from "@/components/berita/news-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { NewspaperIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { newsCategories } from "@/lib/data/news";
import type { BeritaItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type NewsListProps = {
  // Berita non-featured dari Supabase; featured ditampilkan terpisah.
  initialNews: BeritaItem[];
};

export function NewsList({ initialNews }: NewsListProps) {
  const [active, setActive] = useState<string>("Semua");

  const filtered =
    active === "Semua"
      ? initialNews.filter((item) => !item.is_featured)
      : initialNews.filter((item) => item.category === active && !item.is_featured);

  if (initialNews.length === 0) {
    return (
      <Section>
        <Container>
          <h2 className="sr-only">Daftar Berita</h2>
          <div className="mt-10 rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
            <NewspaperIcon className="mx-auto h-10 w-10 text-slate-500" />
            <h3 className="mt-4 text-h4 text-foreground">Belum ada berita</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Berita akan ditampilkan di sini setelah diterbitkan.
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <h2 className="sr-only">Daftar Berita</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori berita">
          {newsCategories.map((category) => {
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
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
            <NewspaperIcon className="mx-auto h-10 w-10 text-slate-500" />
            <h3 className="mt-4 text-h4 text-foreground">Belum ada berita di kategori ini</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Coba pilih kategori lain, atau tampilkan kembali semua berita
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