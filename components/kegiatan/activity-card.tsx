import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, CalendarIcon, MapPinIcon } from "@/components/ui/icons";
import type { KegiatanItem } from "@/lib/types";
import { formatTanggal, resolveGambar } from "@/lib/utils";

export function ActivityCard({ activity }: { activity: KegiatanItem }) {
  const gambar = resolveGambar(activity.image_path);

  return (
    <Card hover className="relative flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={gambar}
          alt={activity.image_alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <Badge variant="primary">{activity.category}</Badge>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarIcon className="h-3.5 w-3.5" />
            <time dateTime={activity.event_date}>{formatTanggal(activity.event_date)}</time>
          </span>
        </div>
        <CardTitle>
          <Link
            href={`/kegiatan/${activity.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {activity.title}
          </Link>
        </CardTitle>
        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPinIcon className="h-3.5 w-3.5" />
          {activity.location ?? ""}
        </p>
        <CardDescription>{activity.excerpt ?? ""}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <span
          aria-hidden="true"
          className="link pointer-events-none inline-flex items-center gap-1.5 text-sm"
        >
          Lihat Detail
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      </CardFooter>
    </Card>
  );
}