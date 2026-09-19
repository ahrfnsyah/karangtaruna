"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FieldName = "nama" | "email" | "subjek" | "pesan";
type FormErrors = Partial<Record<FieldName, string>>;

const FIELD_NAMES: FieldName[] = ["nama", "email", "subjek", "pesan"];

const INPUT_BASE =
  "w-full rounded-control border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground";

function validate(values: Record<FieldName, string>): FormErrors {
  const errors: FormErrors = {};

  if (!values.nama.trim()) {
    errors.nama = "Nama wajib diisi.";
  }

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Format email tidak valid, contoh: nama@email.com.";
  }

  if (!values.subjek.trim()) {
    errors.subjek = "Subjek wajib diisi.";
  }

  if (!values.pesan.trim()) {
    errors.pesan = "Pesan wajib diisi.";
  } else if (values.pesan.trim().length < 10) {
    errors.pesan = "Pesan minimal 10 karakter.";
  }

  return errors;
}

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  error,
}: {
  id: FieldName;
  label: string;
  type?: string;
  autoComplete?: string;
  error?: string;
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        <span aria-hidden="true"> *</span>
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(INPUT_BASE, error ? "border-accent-600" : "border-border")}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-accent-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const values = FIELD_NAMES.reduce((accumulator, name) => {
      accumulator[name] = String(data.get(name) ?? "");
      return accumulator;
    }, {} as Record<FieldName, string>);

    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstError = FIELD_NAMES.find((name) => nextErrors[name]);
    if (firstError) {
      setSubmittedName(null);
      document.getElementById(firstError)?.focus();
      return;
    }

    setSubmittedName(values.nama);
    form.reset();
  }

  const errorCount = Object.keys(errors).length;

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-h3 text-foreground">Kirim Pesan</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Isi formulir di bawah ini. Formulir masih dalam tahap pengembangan dan{" "}
        <strong className="font-semibold text-foreground">belum terhubung ke backend</strong> —
        pesan tidak akan benar-benar terkirim.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="nama" label="Nama" autoComplete="name" error={errors.nama} />
          <Field id="email" label="Email" type="email" autoComplete="email" error={errors.email} />
        </div>
        <Field id="subjek" label="Subjek" error={errors.subjek} />
        <div>
          <label htmlFor="pesan" className="mb-1.5 block text-sm font-medium text-foreground">
            Pesan <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="pesan"
            name="pesan"
            required
            rows={5}
            aria-invalid={errors.pesan ? true : undefined}
            aria-describedby={errors.pesan ? "pesan-error" : undefined}
            className={cn(INPUT_BASE, errors.pesan ? "border-accent-600" : "border-border")}
            placeholder="Tulis pesan Anda di sini..."
          />
          {errors.pesan ? (
            <p id="pesan-error" className="mt-1.5 text-xs font-medium text-accent-700">
              {errors.pesan}
            </p>
          ) : null}
        </div>
        {errorCount > 0 ? (
          <p role="alert" className="text-sm font-medium text-accent-700">
            Mohon periksa kembali {errorCount} kolom yang belum sesuai.
          </p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" variant="primary" size="lg">
            Kirim Pesan
          </Button>
        </div>
      </form>

      {submittedName !== null ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-6 rounded-control border border-primary-600/30 bg-primary-600/10 px-4 py-3 text-sm leading-relaxed text-primary-800"
        >
          <strong className="font-semibold">Terima kasih, {submittedName || "Sahabat Karang Taruna"}!</strong>{" "}
          Pesan Anda belum benar-benar terkirim — formulir ini masih placeholder dan akan
          dihubungkan ke backend pada tahap berikutnya.
        </div>
      ) : null}
    </Card>
  );
}
