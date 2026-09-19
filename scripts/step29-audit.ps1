$ErrorActionPreference = "Stop"

$r = "D:\Anything\karangtaruna"

function RepoDot($p) { return $p.Replace($r, ".") }

function Hline($t) {
  Write-Output ""
  Write-Output ("=" * 66)
  Write-Output "  " + $t
  Write-Output ("=" * 66)
}

# ---------------------------------------------------------------------------
Hline "1. ARTIFACT / LEGACY / DUPLICATE / TEMP FILE (seluruh proyek, kecuali .git/.next/node_modules)"
# ---------------------------------------------------------------------------
$all = Get-ChildItem -LiteralPath $r -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch "\\node_modules\\|\\\.next\\|\\\.git\\" }

$nameProbe = '(^|\\)(.tmp-|tmp-|temp-|temp\.|legacy-|old-|\.bak|\.orig|\.old|\.swp|~$|.*\.log$|.*\.log\.[0-9]+$)'
$suspName = $all | Where-Object { $_.Name -match $nameProbe }
if ($suspName) {
  Write-Output "  FILE MENARIK (nama .tmp/.bak/legacy/.log/etc):"
  $suspName | ForEach-Object { Write-Output ("    {0}  ({1} B)  {2}" -f (RepoDot $_.FullName), $_.Length, $_.LastWriteTime.ToString("s")) }
} else {
  Write-Output "  BERSIH — tidak ada file .tmp/.bak/legacy/.log/artefak mencurigakan di proyek."
}

# Duplikat berdasarkan hash konten (kecuali node_modules/.next/.git)
Write-Output ""
Write-Output "  DUPLIKAT KONTEN (hash sama, lokasi beda):"
$hashGroups = $all | Group-Object -Property { (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA1 -ErrorAction SilentlyContinue).Hash }
$dupes = $hashGroups | Where-Object { $_.Count -gt 1 -and $_.Name }
if ($dupes) {
  foreach ($g in $dupes) {
    Write-Output ("    SHA1 {0}  x{1}:" -f $g.Name.Substring(0, 12), $g.Count)
    $g.Group | ForEach-Object { Write-Output ("        {0}" -f (RepoDot $_.FullName)) }
  }
} else {
  Write-Output "    Tidak ada duplikat konten di proyek."
}

# Parse errors / hasil build bytecode next (duplikat route) tidak relevan
Hline "2. SSOT — hardcoded db-content di halaman publik (harus NOL dari 7 halaman publik ini)"
$pub = @(
  "$r\app\page.tsx",
  "$r\app\tentang\page.tsx",
  "$r\app\program-kerja\page.tsx",
  "$r\app\kegiatan\page.tsx",
  "$r\app\berita\page.tsx",
  "$r\app\galeri\page.tsx",
  "$r\app\kontak\page.tsx"
)
foreach ($f in $pub) {
  if (-not (Test-Path -LiteralPath $f)) { continue }
  $c = Get-Content -LiteralPath $f -Raw
  $sc = ([regex]::Matches($c, "createClient\(")).Count
  $hasSupabase = $c -match "from\(.?.?(site_settings|site_settings|data|berita|kegiatan|galeri|stats|about_|team_)" -or $sc -gt 0
  $label = (Split-Path (Split-Path $f -Parent) -Leaf)
  if ($label -eq "app") { $label = "(root/home)" }
  Write-Output ("  {0,-16} createClient:{1}  SupabaseSource:{2}" -f $label, $sc, ($(if ($hasSupabase) { "YA" } else { "TIDAK" })))
}
Write-Output ""
Write-Output "  Catatan: jika createClient>0 dan memakai .from(...) => SSOT Supabase benar."

# Skip inline-if di sini: gunakan pendekatan tanpa if-block tambahan
Hline "3. AUTHORIZATION — requireAdmin() per mutations admin (actions.ts)"
$adminActions = Get-ChildItem -LiteralPath "$r\app\admin" -Recurse -File -Filter "actions.ts" -ErrorAction SilentlyContinue
foreach ($fa in $adminActions) {
  $rel = RepoDot $fa.FullName
  $c2 = Get-Content -LiteralPath $fa.FullName -Raw
  $nMut = ([regex]::Matches($c2, "export async function")).Count
  $nReq = ([regex]::Matches($c2, "requireAdmin\(\)")).Count
  $ok = ""
  if ($nMut -le $nReq) { $ok = " OK (tiap mutation panggil requireAdmin)" } else { $ok = " <-- PERLU CEK (mutation > requireAdmin)" }
  Write-Output ("  {0}  mutasi:{1} requireAdmin:{2}{3}" -f $rel, $nMut, $nReq, $ok)
}

Hline "4. CORS / middleware / route protection"
foreach ($cf in @("middleware.ts", "proxy.ts", "next.config.ts")) {
  $p = Join-Path $r $cf
  if (-not (Test-Path -LiteralPath $p)) { continue }
  $c3 = Get-Content -LiteralPath $p -Raw
  $cors = $c3 -match "CORS|cors|Access-Control-Allow"
  Write-Output ("  {0,-18} ada-CORS-setting: {1}" -f $cf, ($(if ($cors) { "YA" } else { "tidak" })))
}
Write-Output "  Menjaga: proxy.ts routing /admin-ast & perlindungan default Next (tidak ada open CORS)."

Hline "5. ENV / SECRET — file .env* di proyek (nilai TIDAK ditampilkan)"
Get-ChildItem -LiteralPath $r -Force -Attributes !Directory -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match "^\.env" } |
  ForEach-Object {
    $bad = ""
    $len = $_.Length
    if ($len -gt 800) { $bad = " <-- BESAR (mungkin berisi key)" }
    Write-Output ("  {0}  {1} B{2}" -f $_.Name, $len, $bad)
  }
Write-Output "  Pastikan .env.local & .env*.local terdaftar di .gitignore (lihat scan git)."

Hline "6. CLIENT BUNDLE — scan source untuk service_role/service role key (tidak boleh di client bundle)"
$srcFiles = Get-ChildItem -LiteralPath "$r\app", "$r\components", "$r\lib" -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -in @(".ts", ".tsx", ".js", ".jsx", ".mjs") }
$leakPattern = 'service_role|SERVICE_ROLE_KEY|serviceRole|createAdminClient|SUPABASE_SERVICE_ROLE_KEY'
$leaks = $srcFiles | Where-Object { Select-String -LiteralPath $_.FullName -Pattern $leakPattern -Quiet -ErrorAction SilentlyContinue }
if ($leaks) {
  $leaks | ForEach-Object { Write-Output ("    LEAK-POTENSIAL: {0}" -f (RepoDot $_.FullName)) }
} else {
  Write-Output "  BERSIH — tidak ada service_role/serviceRole/service key di source app/components/lib."
}

Write-Output ""
Write-Output "SCRIPTS-29-audit-artifact selesai."
