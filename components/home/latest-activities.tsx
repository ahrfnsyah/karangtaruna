import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon, CalendarIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ActivityPreviewItem } from "@/lib/types";
import { formatTanggal, resolveGambar } from "@/lib/utils";

type LatestActivitiesProps = {
  items: ActivityPreviewItem[];
  error: string | null;
};

export function LatestActivities({ items, error }: LatestActivitiesProps) {
  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Kegiatan Terbaru"
            title="Ikuti Gerak Kami"
            description="Berbagai kegiatan yang baru saja kami lakukan bersama masyarakat."
          />
          <LinkButton href="/kegiatan" variant="outline" className="shrink-0">
            Semua Kegiatan
          </LinkButton>
        </div>

        {error ? (
          <div className="mt-12 rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-12 rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Belum ada kegiatan yang bisa ditampilkan.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {items.map((activity) => (
              <Card key={activity.slug} hover className="relative flex flex-col overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={resolveGambar(activity.image_path)}
                    alt={activity.image_alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
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
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}