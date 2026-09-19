$ErrorActionPreference = "SilentlyContinue"
$r = "D:\Anything\karangtaruna"

function HR($t) { Write-Output ""; Write-Output ("=" * 64); Write-Output ("  " + $t); Write-Output ("=" * 64) }
function RepoDot($p) { return $p.Replace($r, ".") }

# ============ 1. DEPLOYMENT TARGET ============
HR "1. DEPLOYMENT TARGET — file konfigurasi (read-only)"
$files = @(
  "package.json", "next.config.ts", "tsconfig.json", "proxy.ts",
  ".gitignore", ".env.example", ".env.local", "app/layout.tsx",
  "lib/supabase/admin.ts", "lib/supabase/server.ts", "lib/supabase/client.ts"
)
foreach ($f in $files) {
  $p = Join-Path $r $f
  if (Test-Path -LiteralPath $p) {
    $len = (Get-Item -LiteralPath $p).Length
    "  {0,-34} ({1} B)" -f $f, $len
  } else {
    "  {0,-34} (TIDAK ADA)" -f $f
  }
}

Write-Output ""
Write-Output "  --- package.json (scripts/engines/deps-utama) ---"
$pj = Get-Content -LiteralPath (Join-Path $r "package.json") -Raw | ConvertFrom-Json
"    name      : {0}" -f $pj.name
"    version   : {0}" -f $pj.version
"    private   : {0}" -f $pj.private
"    scripts   : lint={0}" -f $pj.scripts.lint
"    scripts   : build={0}" -f $pj.scripts.build
"    scripts   : start={0}" -f $pj.scripts.start
"    engines   : {0}" -f ($pj.engines | ConvertTo-Json -Compress)
"    next      : {0}" -f $pj.dependencies.next
"    react     : {0}" -f $pj.dependencies.react

Write-Output ""
Write-Output "  --- next.config.ts ---"
if (Test-Path -LiteralPath (Join-Path $r "next.config.ts")) {
  Get-Content -LiteralPath (Join-Path $r "next.config.ts") -Raw | ForEach-Object { "    " + ($_ -replace "`r`n", "`r`n    ") }
} else { "    (tidak ada)" }

# ============ 2. ENVIRONMENT VARIABLES ============
HR "2. ENVIRONMENT VARIABLES (nama variable, nilai tidak ditampilkan)"
$expected = @(
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "ADMIN_EMAILS"
)
$envLocal = Join-Path $r ".env.local"
$envExample = Join-Path $r ".env.example"
if (Test-Path -LiteralPath $envLocal) {
  $elc = Get-Content -LiteralPath $envLocal
  foreach ($v in $expected) {
    $found = $elc | Where-Object { $_ -match ("^\s*" + [regex]::Escape($v) + "\s*=") }
    if ($found) { "  {0,-32} DI-SET (.env.local)" -f $v } else { "  {0,-32} BELUM DI-SET" -f $v }
  }
} else {
  "  (.env.local tidak ada)"
}
if (Test-Path -LiteralPath $envExample) {
  Write-Output "  --- .env.example (placeholder, bukan nilai asli) ---"
  Get-Content -LiteralPath $envExample | ForEach-Object { "    {0}" -f $_ }
} else { "  (.env.example tidak ada)" }

# ============ 3. NEXT_PUBLIC_SITE_URL ============
HR "3. NEXT_PUBLIC_SITE_URL — konsistensi penggunaan"
$root = $r
$scanDirs = @("lib", "app")
$uses = @{}
foreach ($d in $scanDirs) {
  $base = Join-Path $r $d
  if (-not (Test-Path -LiteralPath $base)) { continue }
  Get-ChildItem -LiteralPath $base -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Extension -in @(".ts", ".tsx") } |
    ForEach-Object {
      $c = Get-Content -LiteralPath $_.FullName -Raw
      if ($c -match "NEXT_PUBLIC_SITE_URL") {
        $key = RepoDot $_.FullName
        if (-not $uses.ContainsKey($key)) { $uses[$key] = 0 }
        $uses[$key] = $uses[$key] + ([regex]::Matches($c, "NEXT_PUBLIC_SITE_URL")).Count
      }
    }
}
if ($uses.Count -eq 0) {
  Write-Output "  TIDAK ada penggunaan NEXT_PUBLIC_SITE_URL di lib/ atau app/."
  Write-Output "  -> Perlu dipastikan: jika sitemap/metadata memakai absolute URL, harus via variable ini (bukan domain hardcoded)."
} else {
  $uses.GetEnumerator() | Sort-Object Name | ForEach-Object {
    Write-Output ("  {0,-36}  x{1} pemakaian" -f $_.Name, $_.Value)
  }
}
Write-Output ""
Write-Output "  Periksa hardcoded domain (harus TIDAK):"
$hard = Get-ChildItem -LiteralPath (Join-Path $r "lib") -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Extension -in @(".ts", ".tsx") } |
  Where-Object { (Get-Content -LiteralPath $_.FullName -Raw) -match "https?://[a-z0-9.-]+\.(com|net|id|dev|app)" }
if ($hard) {
  $hard | ForEach-Object { "    {0}" -f (RepoDot $_.FullName) }
} else {
  "    BERSIH — tidak ada domain hardcoded di lib/"
}

# ============ 4. SUPABASE PRODUCTION (read-only) ============
HR "4. SUPABASE PRODUCTION — audit URL/key/pola (tanpa nilai)"
foreach ($f in @("lib/supabase/server.ts", "lib/supabase/client.ts", "lib/supabase/admin.ts")) {
  $p = Join-Path $r $f
  if (-not (Test-Path -LiteralPath $p)) { continue }
  $c = Get-Content -LiteralPath $p -Raw
  $usesUrl = $c -match "NEXT_PUBLIC_SUPABASE_URL"
  $usesAnon = $c -match "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  $hasRole = $c -match "SUPABASE_SERVICE_ROLE_KEY|service_role"
  $serverOnly = (Split-Path -Leaf $p) -eq "admin.ts"
  "  {0,-26} URL:{1} ANON:{2} SERVICE_ROLE:{3}{4}" -f (Split-Path -Leaf $p), $(if ($usesUrl) { "+" } else { "-" }), $(if ($usesAnon) { "+" } else { "-" }), $(if ($hasRole) { "+" } else { "-" }), $(if ($serverOnly) { "  [server-only]" } else { "" })
}
Write-Output "  Catatan: service_role hanya di lib/supabase/admin.ts (server-only);"
Write-Output "  NEXT_PUBLIC_SUPABASE_URL + ANON boleh di client (public)."

# ============ 5. IMAGE / STORAGE (read-only) ============
HR "5. IMAGE / STORAGE — bucket/path/getPublicUrl (pola saja)"
$extra = @("next.config.ts", "proxy.ts", ".gitignore", "app/layout.tsx")
foreach ($f in $extra) {
  $p = Join-Path $r $f
  if (Test-Path -LiteralPath $p) {
    $reL = Join-Path $r "lib"
    Write-Output ("  {0,-26} (ADA, {1} B)" -f $f, (Get-Item -LiteralPath $p).Length)
  } else {
    Write-Output ("  {0,-26} (TIDAK ADA)" -f $f)
  }
}

# duplicate content scan (SHA1) — di luar node_modules/.next/.git
HR "6. DUPLICATE / LEGACY / TEMP / ARTIFAK"
$allFiles = Get-ChildItem -LiteralPath $r -Recurse -File -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch "\\node_modules\\|\\\.next\\|\\\.git\\" }
$nameSus = $allFiles | Where-Object {
  $_.Name -match "(^|\.)(tmp-|temp-|\.tmp|\.bak|\.orig|\.old|\.swp|~$|\.log$|\.log\.\d+|^temp)"
}
if ($nameSus) {
  $nameSus | ForEach-Object { "    {0}  ({1} B)" -f (RepoDot $_.FullName), $_.Length }
} else {
  "    BERSIH — tidak ada file .tmp/.bak/.orig/.log/temp di proyek."
}
$hashGroups = $allFiles | Group-Object { (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA1).Hash } |
  Where-Object { $_.Count -gt 1 -and $_.Name }
if ($hashGroups) {
  $hashGroups | ForEach-Object {
    "    DUPLIKAT SHA1 {0}: {1} file" -f $_.Name.Substring(0, 10), $_.Count
    $_.Group | ForEach-Object { "        {0}" -f (RepoDot $_.FullName) }
  }
} else {
  "    BERSIH — tidak ada file duplikat konten (hash unik semua)."
}

# ============ 7. GIT SAFETY ============
HR "7. GIT SAFETY — .env / secret tidak tracked"
Push-Location -LiteralPath $r
$envTracked = git ls-files | Where-Object { $_ -match "\.env" }
if ($envTracked) {
  "    TERLACAK:"
  $envTracked | ForEach-Object { "      {0}" -f $_ }
} else {
  "    BERSIH — tidak ada file .env* yang di-track oleh git."
}
$ig = Get-Content -LiteralPath (Join-Path $r ".gitignore") -Raw
$dotenvIgnored = $ig -match "(?m)^\.env(\*|\.local)?$|\.env\.local"
"    .env.local di .gitignore : {0}" -f $(if ($dotenvIgnored) { "YA" } else { "PERLU DICEK" })
Pop-Location

Write-Output ""
Write-Output "  >>> Audit read-only selesai. Tidak ada file yang diubah. <<<"
