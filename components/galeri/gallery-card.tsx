import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import type { GalleryItem } from "@/lib/types";
import { formatTanggal, resolveGambar } from "@/lib/utils";

const RATIOS = ["16/10", "4/3", "1/1", "3/4", "4/3", "16/10"];

export function GalleryCard({ item }: { item: GalleryItem }) {
  const ratio = RATIOS[item.sort_order % RATIOS.length];

  return (
    <figure className="group break-inside-avoid overflow-hidden rounded-card bg-muted shadow-card transition-shadow hover:shadow-card-hover">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: ratio }}>
        <Image
          src={resolveGambar(item.image_path)}
          alt={item.image_alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <figcaption className="p-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Badge variant="primary">{item.category}</Badge>
          <span className="text-xs text-muted-foreground">
            {item.taken_at ? (
              <time dateTime={item.taken_at}>{formatTanggal(item.taken_at)}</time>
            ) : (
              ""
            )}
          </span>
        </div>
        <h3 className="mt-2.5 text-sm font-semibold leading-snug text-foreground">
          {item.title}
        </h3>
      </figcaption>
    </figure>
  );
}