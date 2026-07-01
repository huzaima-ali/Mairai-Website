# Downloads the exact Figma logo + avatar assets into public/logos and
# public/testimonials. Requires the Figma desktop app to be running with the
# "Mirai Studios" file open (assets are served from http://localhost:3845).
#
# Usage (from the project root):
#   powershell -ExecutionPolicy Bypass -File scripts/download-figma-assets.ps1

$ErrorActionPreference = "Stop"
$base = "http://localhost:3845/assets"
$root = Split-Path -Parent $PSScriptRoot

$assets = [ordered]@{
  # Logo wall — row 1
  "logos/rivian.svg"                 = "3a52e8ecad5e23475ff6d434034a2d1d41244338.svg"
  "logos/digital-saudi.png"          = "e7b1549e9effecf9e4816c8369d23de4813704a3.png"
  "logos/saudi-tourism.png"          = "6a0155d01cf9fe781012a390851b96bdbc998c0d.png"
  "logos/nhc.svg"                    = "d81a00cc1eb94a9d2b702f5dda7d12623f19da15.svg"
  "logos/coca-cola.svg"              = "87d48e54b76d3349a9e93567c1f57b311ea6e0f3.svg"
  "logos/pwc.svg"                    = "12572361c4db1a920160029c84130a11d56e1ad8.svg"
  # Logo wall — row 2
  "logos/flipboard.svg"              = "4469b8b9222b3f85592db551b5e05ccdd6c66b22.svg"
  "logos/google.svg"                 = "f7d066f66861429427dea48149c72e4dfa3ce0c1.svg"
  "logos/enorta.svg"                 = "94dd4d6fe363c01dec62bdd19ffab36409d10b1f.svg"
  "logos/mclaren.svg"                = "ebd3719eba9d75cd5657a87972857f3af27363bc.svg"
  "logos/cero.svg"                   = "ed6a1bec879b8a197c31345e218d9f930ce9074a.svg"
  "logos/salesforce.svg"             = "ec84eda1c18aed6e63eb75e7d5f61bc22d9c79b0.svg"
  # Logo wall — row 3
  "logos/eye-of-riyadh.svg"          = "427a1af3b479b402e06c2162a10b6c096d70b882.svg"
  "logos/lexus.svg"                  = "edb10c05726ed34faf36f76f34b2edad854cd9de.svg"
  "logos/wnba.svg"                   = "3d4c83be835eb28dd8ba5e180c1e723605344d00.svg"
  "logos/launchdarkly.svg"           = "f8457f4876cc715ccfd6ebaa7bb64bccb1013a29.svg"
  "logos/tim-hortons.svg"            = "ff871acf0c6a7d6c0ae6b69dc73aa14839e4366a.svg"
  # Testimonial avatars
  "testimonials/sarah-jenkins.png"   = "af33d7543768c1f859cad141c1176de63b033fe1.png"
  "testimonials/tariq-al-fadli.png"  = "eba5cac9a2732c03bbd28c583b444cab3cda3764.png"
  "testimonials/khalid-al-dosari.png" = "6460c13aa2ee3955927ea8be4548a281822f3879.png"
}

$ok = 0; $fail = 0
foreach ($target in $assets.Keys) {
  $out = Join-Path $root (Join-Path "public" $target)
  $dir = Split-Path -Parent $out
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  try {
    Invoke-WebRequest -Uri "$base/$($assets[$target])" -OutFile $out -UseBasicParsing
    Write-Host "  [ok] $target"
    $ok++
  } catch {
    Write-Host "  [fail] $target - $($_.Exception.Message)"
    $fail++
  }
}

Write-Host ""
Write-Host "Done. $ok downloaded, $fail failed."
if ($fail -gt 0) {
  Write-Host "If downloads failed: open the Mirai Studios file in Figma desktop, enable Dev Mode MCP, then re-run."
}
