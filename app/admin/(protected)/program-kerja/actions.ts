"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ProgramFormState } from "@/components/admin/program-form";
import { getCurrentUser, isAdminEmail } from "@/lib/auth";
import { PROGRAM_CATEGORIES } from "@/lib/program-categories";
import { createClient } from "@/lib/supabase/server";

const CATEGORY_SET = new Set<string>(PROGRAM_CATEGORIES);

type ProgramFields = {
  title: string;
  category: string;
  description: string;
  status: string | null;
  target: string | null;
};

type ParseResult = { ok: true; values: ProgramFields } | { ok: false; error: string };

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseProgramForm(formData: FormData): ParseResult {
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const target = String(formData.get("target") ?? "").trim();

  if (!title) {
    return { ok: false, error: "Judul program wajib diisi." };
  }
  if (title.length > 120) {
    return { ok: false, error: "Judul program terlalu panjang (maksimal 120 karakter)." };
  }
  if (!CATEGORY_SET.has(category)) {
    return { ok: false, error: "Kategori yang dipilih tidak valid." };
  }
  if (!description) {
    return { ok: false, error: "Deskripsi program wajib diisi." };
  }
  if (description.length > 500) {
    return { ok: false, error: "Deskripsi terlalu panjang (maksimal 500 karakter)." };
  }
  if (status.length > 100) {
    return { ok: false, error: "Status terlalu panjang (maksimal 100 karakter)." };
  }
  if (target.length > 100) {
    return { ok: false, error: "Target terlalu panjang (maksimal 100 karakter)." };
  }

  return {
    ok: true,
    values: {
      title,
      category,
      description,
      status: status || null,
      target: target || null,
    },
  };
}

/*
 * Setiap Server Action WAJIB memverifikasi ulang sesi + keanggotaan admin
 * di sisi server (getCurrentUser + isAdminEmail). Tidak cukup hanya
 * mengandalkan proxy/layout.
 */
async function requireAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null && isAdminEmail(user.email);
}

async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
): Promise<string> {
  const exists = async (slug: string) => {
    const { data } = await supabase.from("programs").select("id").eq("slug", slug).maybeSingle();
    return data !== null;
  };

  if (!(await exists(base))) {
    return base;
  }
  for (let n = 2; n < 1000; n += 1) {
    const candidate = `${base}-${n}`;
    if (!(await exists(candidate))) {
      return candidate;
    }
  }
  return `${base}-${Date.now()}`;
}

export async function createProgram(
  _prevState: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const parsed = parseProgramForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const slug = await generateUniqueSlug(supabase, slugify(parsed.values.title) || "program");

  const { data: maxRow } = await supabase
    .from("programs")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const sortOrder = Number(maxRow?.[0]?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("programs").insert({
    slug,
    title: parsed.values.title,
    category: parsed.values.category,
    description: parsed.values.description,
    status: parsed.values.status,
    target: parsed.values.target,
    icon: "users",
    is_featured: false,
    sort_order: sortOrder,
    is_published: true,
  });

  if (error) {
    console.error("Gagal menambah program kerja:", error.message);
    return { error: "Program gagal disimpan. Silakan coba lagi." };
  }

  revalidatePath("/admin/program-kerja");
  revalidatePath("/program-kerja");
  redirect("/admin/program-kerja");
}

export async function updateProgram(
  _prevState: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Data tidak lengkap. Silakan muat ulang halaman." };
  }

  const parsed = parseProgramForm(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("programs")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Program tidak ditemukan. Silakan muat ulang halaman." };
  }

  const { error } = await supabase
    .from("programs")
    .update({
      title: parsed.values.title,
      category: parsed.values.category,
      description: parsed.values.description,
      status: parsed.values.status,
      target: parsed.values.target,
    })
    .eq("id", id);

  if (error) {
    console.error("Gagal memperbarui program kerja:", error.message);
    return { error: "Program gagal diperbarui. Silakan coba lagi." };
  }

  revalidatePath("/admin/program-kerja");
  revalidatePath("/program-kerja");
  redirect("/admin/program-kerja");
}

export async function deleteProgram(
  _prevState: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
  if (!(await requireAdmin())) {
    return { error: "Anda tidak memiliki izin untuk melakukan tindakan ini." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Data tidak lengkap. Silakan muat ulang halaman." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("programs")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) {
    return { error: "Program tidak ditemukan. Silakan muat ulang halaman." };
  }

  const { error } = await supabase.from("programs").delete().eq("id", id);

  if (error) {
    console.error("Gagal menghapus program kerja:", error.message);
    return { error: "Program gagal dihapus. Silakan coba lagi." };
  }

  revalidatePath("/admin/program-kerja");
  revalidatePath("/program-kerja");
  redirect("/admin/program-kerja");
}