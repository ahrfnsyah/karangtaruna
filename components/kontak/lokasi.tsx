import { ExternalLinkIcon, MapPinIcon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  KARANG_TARUNA_AREA,
  KARANG_TARUNA_FULL_ADDRESS,
  KARANG_TARUNA_SHORT_ADDRESS,
  googleMapsUrl,
} from "@/lib/location";
import { cn } from "@/lib/utils";

import { LocationMap } from "./location-map";

type LokasiProps = {
  address: string;
};

export function Lokasi({ address }: LokasiProps) {
  const addressValue = address.trim();
  const showDatabaseAddress =
    addressValue !== "" &&
    addressValue !== KARANG_TARUNA_FULL_ADDRESS &&
    addressValue !== KARANG_TARUNA_SHORT_ADDRESS;

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Lokasi"
          title="Di Mana Kami Berada"
          description="Karang Taruna beraktivitas di lingkungan RT 04 RW 08, Srengseng Sawah."
        />
        <div className="mt-8 overflow-hidden rounded-card border border-border bg-background shadow-card">
          <div className="h-[320px] bg-muted sm:h-[430px]">
            <LocationMap className="h-full w-full" />
          </div>
          <div className="flex flex-col gap-5 border-t border-border bg-background p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-primary-600/10 text-primary-700">
                <MapPinIcon className="h-5 w-5" />
              </span>
              <address className="not-italic">
                <p className="font-semibold text-foreground">
                  {KARANG_TARUNA_SHORT_ADDRESS}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {KARANG_TARUNA_AREA}
                </p>
                {showDatabaseAddress ? (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {addressValue}
                  </p>
                ) : null}
              </address>
            </div>
            <a
              href={googleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buka lokasi Karang Taruna di Google Maps"
              className={cn(buttonVariants({ variant: "primary", size: "md" }), "shrink-0")}
            >
              <ExternalLinkIcon className="h-4 w-4" />
              Buka di Google Maps
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}