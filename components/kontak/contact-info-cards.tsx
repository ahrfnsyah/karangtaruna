import type { ComponentType, SVGProps } from "react";

import { Card } from "@/components/ui/card";
import { MailIcon, MapPinIcon, PhoneIcon, SparklesIcon } from "@/components/ui/icons";
import type { ContactInfo } from "@/lib/types";

type ContactInfoCardsProps = {
  values: ContactInfo;
};

export function ContactInfoCard({
  label,
  value,
  note,
  Icon,
}: {
  label: string;
  value: string;
  note: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  return (
    <Card className="h-full p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-control bg-primary-600/10 text-primary-700">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </Card>
  );
}

export function ContactInfoCards({ values }: ContactInfoCardsProps) {
  const cards = [
    {
      label: "Alamat",
      value: values.address.trim(),
      note: "Informasi alamat lengkap akan diperbarui berikutnya.",
      Icon: MapPinIcon,
    },
    {
      label: "Email",
      value: values.email.trim(),
      note: "Email ini placeholder dan belum aktif.",
      Icon: MailIcon,
    },
    {
      label: "Telepon",
      value: values.phone.trim(),
      note: "Nomor ini placeholder dan belum aktif.",
      Icon: PhoneIcon,
    },
  ];

  // Kartu Instagram hanya dirender bila ada nilai di database.
  if (values.instagram && values.instagram.trim() !== "") {
    cards.push({
      label: "Instagram",
      value: values.instagram.trim(),
      note: "Akun placeholder, belum tersedia.",
      Icon: SparklesIcon,
    });
  }

  if (cards.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-slate-300 bg-muted px-6 py-12 text-center text-sm text-muted-foreground">
        Informasi kontak belum tersedia.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, note, Icon }) => (
        <ContactInfoCard key={label} label={label} value={value} note={note} Icon={Icon} />
      ))}
    </div>
  );
}