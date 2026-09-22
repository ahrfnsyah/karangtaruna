
import { ContactForm } from "@/components/kontak/contact-form";
import { ContactInfoCards } from "@/components/kontak/contact-info-cards";
import { Cta } from "@/components/kontak/cta";
import { Lokasi } from "@/components/kontak/lokasi";
import { SocialMedia } from "@/components/kontak/social-media";
import { Container } from "@/components/ui/container";
import { MailIcon } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { pageMetadata } from "@/lib/metadata";
import { createClient } from "@/lib/supabase/server";
import type { ContactInfo, SocialLink } from "@/lib/types";

export const metadata = pageMetadata({
  title: "Kontak",
  description:
    "Hubungi Karang Taruna RT 04 RW 08 Srengseng Sawah untuk informasi kegiatan, kolaborasi, atau pertanyaan seputar organisasi.",
  path: "/kontak",
});

/**
 * Supabase Server Client berbasis cookie => halaman tidak bisa di-prerender
 * statis. force-dynamic membuat data selalu dirender server-side dan segar,
 * konsisten dengan halaman lain yang sudah dimigrasikan.
 */
export const dynamic = "force-dynamic";

async function getKontak(): Promise<{
  data: { contact: ContactInfo; socialLinks: SocialLink[] } | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const [settingsResult, socialResult] = await Promise.all([
      supabase
        .from("site_settings")
        .select("address, email, phone")
        .eq("id", 1)
        .maybeSingle(),

      supabase
        .from("social_links")
        .select("platform, label, url, is_active")
        .order("sort_order", { ascending: true }),
    ]);

    if (settingsResult.error || socialResult.error) {
      const message =
        settingsResult.error?.message ?? socialResult.error?.message;

      console.error("Gagal mengambil data /kontak dari Supabase:", message);

      return {
        data: null,
        error: "Informasi kontak sementara tidak dapat ditampilkan.",
      };
    }

    return {
      data: {
        contact: {
          address: settingsResult.data?.address ?? "",
          email: settingsResult.data?.email ?? "",
          phone: settingsResult.data?.phone ?? "",
          instagram: null,
        },
        socialLinks: (socialResult.data ?? []) as SocialLink[],
      },
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan yang tidak diketahui";

    console.error("Gagal mengambil data /kontak dari Supabase:", message);

    return {
      data: null,
      error: "Informasi kontak sementara tidak dapat ditampilkan.",
    };
  }
}

export default async function KontakPage() {
  const { data, error } = await getKontak();

  return (
    <>
      <PageHero
        eyebrow="Kontak"
        title="Terhubung dengan Karang Taruna"
        description="Hubungi kami untuk informasi kegiatan, kolaborasi, atau pertanyaan seputar Karang Taruna RT 04 RW 08."
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Informasi"
            title="Informasi Kontak"
            description="Data kontak di bawah akan diperbarui dengan kontak resmi."
          />

          <div className="mt-8">
            {error ? (
              <div className="rounded-card border border-dashed border-slate-300 bg-muted px-6 py-16 text-center">
                <MailIcon className="mx-auto h-10 w-10 text-slate-500" />

                <h3 className="mt-4 text-h4 text-foreground">
                  Informasi kontak tidak dapat ditampilkan
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Terjadi kendala saat mengambil data. Silakan coba kembali
                  beberapa saat lagi.
                </p>
              </div>
            ) : (
              <ContactInfoCards
                values={
                  data?.contact ?? {
                    address: "",
                    email: "",
                    phone: "",
                    instagram: null,
                  }
                }
              />
            )}
          </div>
        </Container>
      </Section>

      <Section muted>
        <Container>
          <div className="grid gap-8 lg:grid-cols-5">
            {/* BAGIAN KIRI - TIDAK DIUBAH */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* BAGIAN KANAN - DIPERBARUI */}
            <div className="lg:col-span-2">
              <div className="rounded-card border border-border bg-background p-6">
                <h2 className="text-h4 text-foreground">
                  Cara Lain Menghubungi Kami
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Silakan hubungi Karang Taruna RT 04 RW 08 Srengseng Sawah
                  melalui informasi kontak resmi yang tersedia.
                </p>

                <div className="mt-6 space-y-5">
                  {data?.contact.email && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Email
                      </p>

                      <a
                        href={`mailto:${data.contact.email}`}
                        className="mt-1 block text-sm font-medium text-accent-700 transition-colors hover:text-accent-800 hover:underline"
                      >
                        {data.contact.email}
                      </a>
                    </div>
                  )}

                  {data?.contact.phone && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Telepon
                      </p>

                      <a
                        href={`tel:${data.contact.phone}`}
                        className="mt-1 block text-sm font-medium text-accent-700 transition-colors hover:text-accent-800 hover:underline"
                      >
                        {data.contact.phone}
                      </a>
                    </div>
                  )}

                  {data?.contact.address && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Alamat
                      </p>

                      <p className="mt-1 text-sm leading-relaxed text-foreground">
                        {data.contact.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Lokasi address={error ? "" : (data?.contact.address ?? "")} />

      <SocialMedia links={error ? [] : (data?.socialLinks ?? [])} />

      <Cta />
    </>
  );
}
