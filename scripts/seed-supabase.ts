/*
 * scripts/seed-supabase.ts
 *
 * Seed data statis (lib/data/*) ke Supabase.
 *
 * SIFAT:
 *   - Idempotent: aman dijalankan berkali-kali tanpa membuat duplikat.
 *   - Hanya server-side. Memakai service role via createAdminClient(),
 *     sehingga script ini TIDAK BOLEH diimpor dari aplikasi Next.js.
 *   - Tidak pernah menyentuh contact_messages.
 *   - Tidak melakukan DELETE / TRUNCATE / DROP / reset database.
 *   - Tidak mengunggah gambar; path placeholder lokal dipertahankan apa adanya.
 *
 * JALANKAN (dry-run, tanpa menulis ke database):
 *   node --experimental-strip-types --env-file=.env.local scripts/seed-supabase.ts --dry-run
 *
 * JALANKAN (menulis ke database — hanya setelah dry-run disetujui):
 *   node --experimental-strip-types --env-file=.env.local scripts/seed-supabase.ts
 */

import { createAdminClient } from "../lib/supabase/admin.ts";
import { programKerja } from "../lib/data/program-kerja.ts";
import { activities } from "../lib/data/activities.ts";
import { news } from "../lib/data/news.ts";
import { galleryItems } from "../lib/data/gallery.ts";
import {
  aboutProfile,
  missions,
  roles,
  struktur,
  values,
  vision,
} from "../lib/data/tentang.ts";
import { stats } from "../lib/data/home.ts";
import { contactInfo, socialMedia } from "../lib/data/contact.ts";
import { siteConfig } from "../lib/site.ts";

/* -------------------------------------------------------------------------- */
/* Konstanta yang sudah disetujui (STEP 22.3)                                 */
/* -------------------------------------------------------------------------- */

// Slug program yang dibekukan. Urutan HARUS sama dengan urutan `programKerja`.
const PROGRAM_SLUGS: readonly string[] = [
  "wadah-kepemudaan-kepeloporan",
  "pengembangan-kreativitas-pemuda",
  "kegiatan-sosial-masyarakat",
  "pembinaan-olahraga-pemuda",
  "pelatihan-keterampilan",
  "kegiatan-peduli-lingkungan",
];

const PROGRAM_SLUG_SET = new Set<string>(PROGRAM_SLUGS);

// Relasi activities.slug -> programs.slug. null berarti tanpa relasi.
const ACTIVITY_PROGRAM_MAP: Record<string, string | null> = {
  "kerja-bakti-lingkungan": "kegiatan-peduli-lingkungan",
  "penataan-taman-dan-penghijauan": "kegiatan-peduli-lingkungan",
  "kegiatan-olahraga-pemuda": "pembinaan-olahraga-pemuda",
  "senam-bersama-warga": "pembinaan-olahraga-pemuda",
  "bakti-sosial-masyarakat": "kegiatan-sosial-masyarakat",
  "pelatihan-kreativitas-pemuda": "pengembangan-kreativitas-pemuda",
  "latihan-kepemimpinan-pemuda": "wadah-kepemudaan-kepeloporan",
  "peringatan-hut-kemerdekaan-ri": null,
};

// Tanggal date-only diperlakukan sebagai tengah malam WIB agar tidak bergeser.
const DATE_ONLY_TIME = "T00:00:00+07:00";

/* -------------------------------------------------------------------------- */
/* Tipe bantu                                                                 */
/* -------------------------------------------------------------------------- */

type DbRow = Record<string, unknown>;

/* -------------------------------------------------------------------------- */
/* Helper                                                                     */
/* -------------------------------------------------------------------------- */

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const INDONESIAN_MONTHS: Record<string, string> = {
  januari: "01",
  februari: "02",
  maret: "03",
  april: "04",
  mei: "05",
  juni: "06",
  juli: "07",
  agustus: "08",
  september: "09",
  oktober: "10",
  november: "11",
  desember: "12",
};

/**
 * Mengubah "17 Agustus 2026" menjadi "2026-08-17".
 * Melempar error (memaksa abort) bila format/bulan tidak dikenali,
 * supaya tidak pernah menulis tanggal palsu.
 */
function parseIndonesianDate(value: string): string {
  const match = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/.exec(value.trim());
  if (!match) {
    throw new Error(`Tanggal tidak dapat diparse: "${value}"`);
  }

  const day = Number(match[1]);
  const month = INDONESIAN_MONTHS[match[2].toLowerCase()];
  const year = match[3];

  if (!month) {
    throw new Error(`Bulan tidak dikenali pada tanggal: "${value}"`);
  }
  if (day < 1 || day > 31) {
    throw new Error(`Tanggal tidak valid: "${value}"`);
  }

  return `${year}-${month}-${String(day).padStart(2, "0")}`;
}

function assertUnique(keys: readonly string[], label: string): void {
  const seen = new Set<string>();
  for (const key of keys) {
    if (seen.has(key)) {
      throw new Error(`Data statis mengandung duplikat ${label}: "${key}"`);
    }
    seen.add(key);
  }
}

/* -------------------------------------------------------------------------- */
/* Pembangun baris (pure, tanpa akses database)                              */
/* -------------------------------------------------------------------------- */

function buildProgramRows(): DbRow[] {
  if (PROGRAM_SLUGS.length !== programKerja.length) {
    throw new Error(
      `Jumlah PROGRAM_SLUGS (${PROGRAM_SLUGS.length}) tidak sama dengan programKerja (${programKerja.length}).`,
    );
  }
  assertUnique(PROGRAM_SLUGS, "programs.slug");

  return programKerja.map((program, index) => {
    const slug = PROGRAM_SLUGS[index];
    const generated = slugify(program.judul);
    if (slug !== generated) {
      throw new Error(
        `Slug program tidak cocok untuk "${program.judul}": disetujui "${slug}", hasil slugify "${generated}".`,
      );
    }

    return {
      slug,
      title: program.judul,
      category: program.kategori,
      description: program.deskripsi,
      status: program.status,
      target: program.target,
      icon: program.icon,
      is_featured: program.unggulan,
      sort_order: index,
      is_published: true,
    };
  });
}

type ActivitySeed = {
  row: DbRow;
  programSlug: string | null;
};

function buildActivitySeeds(): ActivitySeed[] {
  const activitySlugSet = new Set(activities.map((activity) => activity.slug));
  for (const slug of activitySlugSet) {
    if (!(slug in ACTIVITY_PROGRAM_MAP)) {
      throw new Error(`Mapping program untuk activity "${slug}" tidak ditemukan.`);
    }
  }
  for (const key of Object.keys(ACTIVITY_PROGRAM_MAP)) {
    if (!activitySlugSet.has(key)) {
      throw new Error(`ACTIVITY_PROGRAM_MAP memuat activity tidak dikenal: "${key}".`);
    }
  }

  return activities.map((activity) => {
    const programSlug = ACTIVITY_PROGRAM_MAP[activity.slug];
    if (programSlug !== null && !PROGRAM_SLUG_SET.has(programSlug)) {
      throw new Error(
        `Activity "${activity.slug}" menunjuk program "${programSlug}" yang tidak ada di PROGRAM_SLUGS.`,
      );
    }

    return {
      programSlug,
      row: {
        slug: activity.slug,
        title: activity.title,
        category: activity.category,
        event_date: parseIndonesianDate(activity.date),
        location: activity.location,
        excerpt: activity.excerpt,
        description: activity.description,
        status: activity.status,
        image_path: activity.image,
        image_alt: activity.alt,
        is_published: true,
      },
    };
  });
}

function buildNewsRows(): DbRow[] {
  return news.map((item) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.publishedAt)) {
      throw new Error(
        `publishedAt berita "${item.slug}" tidak berformat yyyy-mm-dd: "${item.publishedAt}".`,
      );
    }

    return {
      slug: item.slug,
      title: item.title,
      category: item.category,
      author: item.author,
      excerpt: item.excerpt,
      content: [...item.content],
      image_path: item.image,
      image_alt: item.alt,
      published_at: `${item.publishedAt}${DATE_ONLY_TIME}`,
      is_featured: item.featured ?? false,
      is_published: true,
    };
  });
}

function buildGalleryRows(): DbRow[] {
  const rows = galleryItems.map((item, index) => ({
    title: item.title,
    category: item.category,
    description: item.description,
    image_path: item.image,
    image_alt: item.alt,
    taken_at: parseIndonesianDate(item.date),
    sort_order: index,
    is_published: true,
  }));

  assertUnique(
    rows.map((row) => String(row.title)),
    "gallery_items.title",
  );

  return rows;
}

function buildAboutRows(): DbRow[] {
  const rows: DbRow[] = [
    ...missions.map((item, index) => ({
      section: "mission",
      title: item.title,
      description: item.description,
      icon: item.icon,
      sort_order: index,
      is_published: true,
    })),
    ...values.map((item, index) => ({
      section: "value",
      title: item.title,
      description: item.description,
      icon: item.icon,
      sort_order: index,
      is_published: true,
    })),
    ...roles.map((item, index) => ({
      section: "role",
      title: item.title,
      description: item.description,
      icon: item.icon,
      sort_order: index,
      is_published: true,
    })),
  ];

  assertUnique(
    rows.map((row) => `${String(row.section)}::${String(row.title)}`),
    "about_items.(section, title)",
  );

  return rows;
}

function buildTeamRows(): DbRow[] {
  const rows: DbRow[] = [
    ...struktur.kepengurusan.map((item, index) => ({
      name: item.nama,
      position: item.jabatan,
      group_name: "pengurus",
      sort_order: index,
      is_active: true,
    })),
    ...struktur.divisi.map((item, index) => ({
      name: item.nama,
      position: item.jabatan,
      group_name: "divisi",
      sort_order: index,
      is_active: true,
    })),
  ];

  assertUnique(
    rows.map((row) => `${String(row.group_name)}::${String(row.position)}`),
    "team_members.(group_name, position)",
  );

  return rows;
}

function buildSiteSettingsRow(): DbRow {
  return {
    id: 1,
    org_name: contactInfo.title,
    short_name: siteConfig.shortName,
    tagline: null,
    address: contactInfo.address,
    email: contactInfo.email,
    phone: contactInfo.phone,
    vision,
    about_paragraphs: [...aboutProfile],
  };
}

function buildStatRows(): DbRow[] {
  const rows = stats.map((stat, index) => ({
    label: stat.label,
    value: stat.value,
    sort_order: index,
    is_published: true,
  }));

  assertUnique(
    rows.map((row) => String(row.label)),
    "stats.label",
  );

  return rows;
}

function buildSocialLinkRows(): DbRow[] {
  // URL sengaja null dan is_active false agar sesuai kondisi "Segera tersedia".
  // Instagram handle tidak dikonversi menjadi URL pada step ini.
  return socialMedia.map((social, index) => ({
    platform: social.name,
    label: social.name,
    url: null,
    is_active: false,
    sort_order: index,
  }));
}

/* -------------------------------------------------------------------------- */
/* Operasi database                                                           */
/* -------------------------------------------------------------------------- */

type AdminClient = ReturnType<typeof createAdminClient>;

async function upsertByUniqueKey(
  supabase: AdminClient,
  table: string,
  onConflict: string,
  rows: DbRow[],
): Promise<void> {
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) {
    throw new Error(`${table} upsert gagal: ${error.message}`);
  }
}

/**
 * Untuk tabel tanpa unique constraint: select -> update yang ada -> insert sisanya.
 */
async function syncByNaturalKey(
  supabase: AdminClient,
  table: string,
  selectKeys: string,
  keyOf: (row: DbRow) => string,
  rows: DbRow[],
): Promise<{ inserted: number; updated: number }> {
  const { data, error } = await supabase.from(table).select(`id, ${selectKeys}`);
  if (error) {
    throw new Error(`${table} select gagal: ${error.message}`);
  }

  const existingRows = (data ?? []) as unknown as DbRow[];

  const existingIdByKey = new Map<string, unknown>();
  for (const existing of existingRows) {
    existingIdByKey.set(keyOf(existing), existing.id);
  }

  const pending: DbRow[] = [];
  let inserted = 0;
  let updated = 0;

  for (const row of rows) {
    const key = keyOf(row);
    const id = existingIdByKey.get(key);
    if (id === undefined) {
      pending.push(row);
      inserted += 1;
      continue;
    }

    const { error: updateError } = await supabase.from(table).update(row).eq("id", id);
    if (updateError) {
      throw new Error(`${table} update "${key}" gagal: ${updateError.message}`);
    }
    updated += 1;
  }

  if (pending.length > 0) {
    const { error: insertError } = await supabase.from(table).insert(pending);
    if (insertError) {
      throw new Error(`${table} insert gagal: ${insertError.message}`);
    }
  }

  return { inserted, updated };
}

/* -------------------------------------------------------------------------- */
/* Alur utama                                                                 */
/* -------------------------------------------------------------------------- */

async function runSeed(dryRun: boolean): Promise<void> {
  const supabase = createAdminClient();

  const programRows = buildProgramRows();
  const activitySeeds = buildActivitySeeds();
  const newsRows = buildNewsRows();
  const galleryRows = buildGalleryRows();
  const aboutRows = buildAboutRows();
  const teamRows = buildTeamRows();
  const settingsRow = buildSiteSettingsRow();
  const statRows = buildStatRows();
  const socialRows = buildSocialLinkRows();

  const counts: Record<string, number> = {
    programs: programRows.length,
    activities: activitySeeds.length,
    news: newsRows.length,
    gallery_items: galleryRows.length,
    about_items: aboutRows.length,
    team_members: teamRows.length,
    stats: statRows.length,
    social_links: socialRows.length,
    site_settings: 1,
    contact_messages: 0,
  };

  const migratable =
    counts.programs +
    counts.activities +
    counts.news +
    counts.gallery_items +
    counts.about_items +
    counts.team_members +
    counts.stats +
    counts.social_links;

  if (dryRun) {
    console.log("DRY RUN — tidak ada INSERT/UPDATE/DELETE yang dijalankan.\n");
    for (const [table, count] of Object.entries(counts)) {
      console.log(`${table}: ${count}`);
    }
    console.log(`\nTotal migratable records: ${migratable} + site_settings update`);
    console.log(`contact_messages tidak disentuh (tetap kosong).`);
    return;
  }

  console.log("Seeding ke Supabase dimulai...\n");

  // 1. programs
  await upsertByUniqueKey(supabase, "programs", "slug", programRows);
  const { data: programData, error: programSelectError } = await supabase
    .from("programs")
    .select("id, slug");
  if (programSelectError) {
    throw new Error(`programs select gagal: ${programSelectError.message}`);
  }
  const programIdBySlug = new Map<string, string>();
  for (const program of (programData ?? []) as DbRow[]) {
    programIdBySlug.set(String(program.slug), String(program.id));
  }
  for (const slug of PROGRAM_SLUGS) {
    if (!programIdBySlug.has(slug)) {
      throw new Error(`Program "${slug}" tidak ditemukan setelah upsert.`);
    }
  }
  console.log(`programs: ${programRows.length}`);

  // 2. activities (resolve program_id dari slug, bukan UUID hardcode)
  const activityRows = activitySeeds.map(({ row, programSlug }) => {
    if (programSlug === null) {
      return { ...row, program_id: null };
    }
    const programId = programIdBySlug.get(programSlug);
    if (!programId) {
      throw new Error(
        `program_id untuk activity "${String(row.slug)}" tidak ditemukan (program "${programSlug}").`,
      );
    }
    return { ...row, program_id: programId };
  });
  await upsertByUniqueKey(supabase, "activities", "slug", activityRows);
  console.log(`activities: ${activityRows.length}`);

  // 3. news
  await upsertByUniqueKey(supabase, "news", "slug", newsRows);
  console.log(`news: ${newsRows.length}`);

  // 4. gallery_items
  const galleryResult = await syncByNaturalKey(
    supabase,
    "gallery_items",
    "title",
    (row) => String(row.title),
    galleryRows,
  );
  console.log(`gallery_items: ${galleryResult.inserted} insert, ${galleryResult.updated} update`);

  // 5. about_items
  const aboutResult = await syncByNaturalKey(
    supabase,
    "about_items",
    "section, title",
    (row) => `${String(row.section)}::${String(row.title)}`,
    aboutRows,
  );
  console.log(`about_items: ${aboutResult.inserted} insert, ${aboutResult.updated} update`);

  // 6. team_members
  const teamResult = await syncByNaturalKey(
    supabase,
    "team_members",
    "group_name, position",
    (row) => `${String(row.group_name)}::${String(row.position)}`,
    teamRows,
  );
  console.log(`team_members: ${teamResult.inserted} insert, ${teamResult.updated} update`);

  // 7. site_settings (UPDATE id = 1 saja)
  const { data: settingsData, error: settingsError } = await supabase
    .from("site_settings")
    .update(settingsRow)
    .eq("id", 1)
    .select("id");
  if (settingsError) {
    throw new Error(`site_settings update gagal: ${settingsError.message}`);
  }
  if (!settingsData || settingsData.length === 0) {
    throw new Error(
      "site_settings id=1 tidak ditemukan. Pastikan migration schema sudah diterapkan.",
    );
  }
  console.log("site_settings: 1 update (id=1)");

  // 8. stats
  const statResult = await syncByNaturalKey(
    supabase,
    "stats",
    "label",
    (row) => String(row.label),
    statRows,
  );
  console.log(`stats: ${statResult.inserted} insert, ${statResult.updated} update`);

  // 9. social_links
  await upsertByUniqueKey(supabase, "social_links", "platform", socialRows);
  console.log(`social_links: ${socialRows.length}`);

  console.log("\nSeeding selesai. contact_messages tidak disentuh.");
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  await runSeed(dryRun);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nSEED GAGAL: ${message}`);
  process.exitCode = 1;
});
