export const ABOUT_SECTIONS = [
  { value: "mission", label: "Misi" },
  { value: "value", label: "Nilai" },
  { value: "role", label: "Peran" },
] as const;

export type AboutSection = (typeof ABOUT_SECTIONS)[number]["value"];

export const ABOUT_SECTION_SET = new Set<string>(ABOUT_SECTIONS.map((s) => s.value));

export const TEAM_GROUPS = [
  { value: "pengurus", label: "Pengurus" },
  { value: "divisi", label: "Divisi" },
] as const;

export type TeamGroup = (typeof TEAM_GROUPS)[number]["value"];

export const TEAM_GROUP_SET = new Set<string>(TEAM_GROUPS.map((g) => g.value));

import { iconMap } from "@/lib/icons";

export const ABOUT_ICON_KEYS = Object.keys(iconMap);
export const ABOUT_ICON_SET = new Set<string>(ABOUT_ICON_KEYS);
