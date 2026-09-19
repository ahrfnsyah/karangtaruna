import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ShieldCheckIcon } from "@/components/ui/icons";

import { logout } from "@/app/admin/(protected)/actions";

type UnauthorizedProps = {
  email: string;
};

/*
 * State untuk user yang sudah terautentikasi tetapi tidak masuk daftar
 * admin (allowlist ADMIN_EMAILS). Selalu tersedia tombol Keluar agar sesi
 * dapat dibersihkan.
 */
export function Unauthorized({ email }: UnauthorizedProps) {
  return (
    <Section>
      <Container className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-control bg-accent-50 text-accent-700">
          <ShieldCheckIcon className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-h1 text-foreground">Akses Ditolak</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Akun <strong className="font-semibold text-foreground">{email}</strong> berhasil
          terautentikasi, tetapi tidak memiliki izin untuk mengakses halaman admin.
        </p>
        <form action={logout} className="mt-8">
          <Button type="submit" variant="outline" size="lg">
            Keluar
          </Button>
        </form>
      </Container>
    </Section>
  );
}