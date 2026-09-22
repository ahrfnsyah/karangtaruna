import type { ComponentType, SVGProps } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import Link from "next/link";

import { Container } from "@/components/ui/container";
import { contactInfo } from "@/lib/data/contact";
import { NAV_ITEMS } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SocialLink } from "@/lib/types";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/ui/icons";

/*
 * Satu-satunya platform media sosial yang boleh dirender footer.
 * WhatsApp sengaja tidak lagi dipakai.
 */
const SOCIAL_PLATFORMS = ["Instagram", "Facebook", "TikTok"] as const;

const SOCIAL_ICONS: Record<
  (typeof SOCIAL_PLATFORMS)[number],
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  TikTok: TikTokIcon,
};

async function getFooterContact(
  supabase: SupabaseClient,
): Promise<{ email: string; phone: string }> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("email, phone")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      console.error(
        "Gagal mengambil kontak footer:",
        error?.message ?? "Data site_settings tidak ditemukan.",
      );
    }

    return {
      email: data?.email || contactInfo.email,
      phone: data?.phone || contactInfo.phone,
    };
  } catch (err) {
    console.error(
      "Gagal mengambil kontak footer:",
      err instanceof Error ? err.message : "Kesalahan tidak diketahui",
    );

    return {
      email: contactInfo.email,
      phone: contactInfo.phone,
    };
  }
}

async function getFooterSocials(
  supabase: SupabaseClient,
): Promise<SocialLink[]> {
  try {
    const { data, error } = await supabase
      .from("social_links")
      .select("platform, label, url, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(
        "Gagal mengambil media sosial footer:",
        error.message,
      );
      return [];
    }

    return (data ?? []).filter(
      (link): link is SocialLink =>
        link.url != null &&
        link.url.trim() !== "" &&
        SOCIAL_PLATFORMS.includes(link.platform as (typeof SOCIAL_PLATFORMS)[number]),
    );
  } catch (err) {
    console.error(
      "Gagal mengambil media sosial footer:",
      err instanceof Error ? err.message : "Kesalahan tidak diketahui",
    );
    return [];
  }
}

export async function Footer() {
  const year = new Date().getFullYear();
  const supabase = await createClient();

  const [contact, socialLinks] = await Promise.all([
    getFooterContact(supabase),
    getFooterSocials(supabase),
  ]);

  return (
    <footer className="bg-primary-950 text-slate-300">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-card bg-primary-600 text-sm font-bold text-white">
                KT
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-white">Karang Taruna</span>
                <span className="text-xs text-slate-400">RT 04 RW 08 Srengseng Sawah</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Wadah pembinaan dan pengembangan generasi muda untuk membangun
              lingkungan yang aktif, kreatif, dan peduli terhadap sesama.
            </p>
            {socialLinks.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = SOCIAL_ICONS[social.platform as (typeof SOCIAL_PLATFORMS)[number]];

                  return (
                    <li key={social.platform}>
                      <a
                        href={social.url ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-sm font-medium text-slate-400 transition-colors hover:border-white/30 hover:text-white"
                      >
                        <Icon className="h-4 w-4" />
                        {social.label}
                        <span className="sr-only"> (buka di tab baru)</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Tautan halaman">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
              Navigasi
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
              Alamat &amp; Kontak
            </h3>
            <address className="mt-4 space-y-2.5 text-sm not-italic leading-relaxed text-slate-400">
              <p>{contactInfo.address}</p>
              <p>
                {contact.email}
                <br />
                {contact.phone}
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row">
          <p>© {year} Karang Taruna RT 04 RW 08 Srengseng Sawah.</p>
          <p>Jagakarsa, Jakarta Selatan</p>
        </div>
      </Container>
    </footer>
  );
}