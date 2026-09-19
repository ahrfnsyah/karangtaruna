import Link from "next/link";

import { Container } from "@/components/ui/container";
import { contactInfo, socialMedia } from "@/lib/data/contact";
import { NAV_ITEMS } from "@/lib/navigation";

export function Footer() {
  const year = new Date().getFullYear();

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
            <div className="mt-6 flex flex-wrap gap-2.5">
              {socialMedia.map(({ name, status }) => (
                <span
                  key={name}
                  title={status}
                  className="rounded-full border border-white/15 px-3.5 py-1.5 text-sm font-medium text-slate-400"
                >
                  {name}
                  <span className="sr-only"> ({status})</span>
                </span>
              ))}
            </div>
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
                {contactInfo.email}
                <br />
                {contactInfo.phone}
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