import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, CalendarIcon } from "@/components/ui/icons";
import type { BeritaItem } from "@/lib/types";
import { formatTanggalWIB, formatTanggalWIBISO, resolveGambar } from "@/lib/utils";

export function FeaturedNews({ news }: { news: BeritaItem[] }) {
  if (news.length === 0) {
    return null;
  }

  return (
    <div className="space-y-5">
      {news.map((item) => (
        <Card key={item.id} hover className="relative overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-72">
              <Image
                src={resolveGambar(item.image_path)}
                alt={item.image_alt}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <Badge variant="accent">Berita Utama</Badge>
                <Badge variant="primary">{item.category}</Badge>
              </div>
              <time
                dateTime={formatTanggalWIBISO(item.published_at)}
                className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <CalendarIcon className="h-4 w-4" />
                {formatTanggalWIB(item.published_at)}
              </time>
              <CardTitle className="mt-3">
                <Link
                  href={`/berita/${item.slug}`}
                  className="after:absolute after:inset-0 after:content-['']"
                >
                  {item.title}
                </Link>
              </CardTitle>
              <CardDescription className="mt-3">{item.excerpt}</CardDescription>
              <span
                aria-hidden="true"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600"
              >
                Baca Selengkapnya
                <ArrowRightIcon className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}