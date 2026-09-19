import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, CalendarIcon } from "@/components/ui/icons";
import type { BeritaItem } from "@/lib/types";
import { formatTanggalWIB, formatTanggalWIBISO, resolveGambar } from "@/lib/utils";

export function NewsCard({ news }: { news: BeritaItem }) {
  return (
    <Card hover className="relative flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={resolveGambar(news.image_path)}
          alt={news.image_alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <Badge variant="primary">{news.category}</Badge>
          <time
            dateTime={formatTanggalWIBISO(news.published_at)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            {formatTanggalWIB(news.published_at)}
          </time>
        </div>
        <CardTitle>
          <Link
            href={`/berita/${news.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {news.title}
          </Link>
        </CardTitle>
        <CardDescription>{news.excerpt}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <span
          aria-hidden="true"
          className="link pointer-events-none inline-flex items-center gap-1.5 text-sm"
        >
          Baca Selengkapnya
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      </CardFooter>
    </Card>
  );
}