import { iconMap } from "@/lib/icons";

/*
 * Konstanta bersama untuk modul admin "Tentang Kami" — dipakai server action
 * (validasi) dan client form (option select) agar ilustrasi ikon konsisten.
 * Ikon diambil dari iconMap lib/icons yang dipakai halaman publik /tentang.
 */

export const ABOUT_SECTIONS = [
  { value: "mission", label: "Misi" },
  { value: "value", label: "Nilai" },
  { value: "role", label: "Peran" },
] as const;

export type AboutSection = (typeof ABOUT_SECTIONS)[number]["value"];

export const ABOUT_SECTION_SET = new Set<string>(
  ABOUT_SECTIONS.map((section) => section.value),
);

export const TEAM_GROUPS = [
  { value: "pengurus", label: "Pengurus" },
  { value: "divisi", label: "Divisi" },
] as const;

export type TeamGroup = (typeof TEAM_GROUPS)[number]["value"];

export const TEAM_GROUP_SET = new Set<string>(TEAM_GROUPS.map((group) => group.value));

export const ABOUT_ICONS = Object.keys(iconMap) as Array<keyof typeof iconMap>;

export const ABOUT_ICON_SET = new Set<string>(ABOUT_ICONS);

export const SORT_ORDER_PATTERN = /^-?\d{1,6}$/;
export const INTERNAL_ITEM_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type StatFormValues = {
  label: string;
  value: string;
  sort_order: number;
  is_published: boolean;
};

export function parseStatForm(input: {
  label: string;
  value: string;
  sortOrder: string;
  isPublished: boolean;
}): { ok: true; values: StatFormValues } | { ok: false; error: string } {
  const label = input.label.trim();
  if (!label) {
    return { ok: false, error: "Label wajib diisi." };
  }
  if (label.length > 80) {
    return { ok: false, error: "Label maksimal 80 karakter." };
  }

  const value = input.value.trim();
  if (!value) {
    return { ok: false, error: "Nilai wajib diisi." };
  }
  if (value.length > 60) {
    return { ok: false, error: "Nilai maksimal 60 karakter." };
  }

  const sortOrderRaw = input.sortOrder.trim();
  const sortOrder = sortOrderRaw === "" ? 0 : Number(sortOrderRaw);
  if (sortOrderRaw !== "" && (!SORT_ORDER_PATTERN.test(sortOrderRaw) || sortOrder < 0)) {
    return { ok: false, error: "Urutan harus berupa angka 0 atau lebih." };
  }

  return {
    ok: true,
    values: { label, value, sort_order: sortOrder, is_published: input.isPublished },
  };
}
