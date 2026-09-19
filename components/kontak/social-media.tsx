import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SocialLink } from "@/lib/types";

type SocialMediaProps = {
  links: SocialLink[];
};

export function SocialMedia({ links }: SocialMediaProps) {
  return (
    <Section muted>
      <Container>
        <SectionHeading
          eyebrow="Media Sosial"
          title="Ikuti Kami di Media Sosial"
          description="Akun media sosial resmi kami akan segera tersedia."
        />
        {links.length > 0 ? (
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {links.map((social) => (
              <li key={social.platform}>
                {social.is_active && social.url ? (
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-primary-600/40 bg-primary-600/10 px-5 py-2.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-600/20"
                  >
                    {social.label}
                  </a>
                ) : (
                  <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-slate-300 bg-background px-5 py-2.5 text-sm font-medium text-muted-foreground">
                    {social.label}
                    <span className="text-xs text-muted-foreground">Segera tersedia</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Akun media sosial belum tersedia.
          </p>
        )}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sementara itu, hubungi kami melalui alamat email pada halaman ini.
        </p>
      </Container>
    </Section>
  );
}