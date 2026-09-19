import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/login-form";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Masuk Admin",
    description: "Halaman masuk untuk pengelola konten Karang Taruna RT 04 RW 08 Srengseng Sawah.",
    path: "/admin/login",
  }),
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Section>
      <Container className="flex items-center justify-center py-16 md:py-24">
        <LoginForm />
      </Container>
    </Section>
  );
}