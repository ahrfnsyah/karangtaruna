import { MapPinIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type LokasiProps = {
  address: string;
};

export function Lokasi({ address }: LokasiProps) {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Lokasi"
          title="Di Mana Kami Berada"
          description="Karang Taruna beraktivitas di lingkungan RT 04 RW 08, Srengseng Sawah."
        />
        <div className="mt-8 rounded-card border border-dashed border-slate-300 bg-muted px-6 py-12 text-center md:px-12">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-card bg-primary-600/10 text-primary-700">
            <MapPinIcon className="h-6 w-6" />
          </span>
          {address.trim() !== "" ? (
            <address className="mt-4 text-lg font-semibold not-italic text-foreground">
              {address}
            </address>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Alamat belum tersedia.</p>
          )}
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Area ini adalah placeholder peta. Nantinya akan diganti dengan
            peta interaktif atau embed alamat yang sebenarnya.
          </p>
        </div>
      </Container>
    </Section>
  );
}