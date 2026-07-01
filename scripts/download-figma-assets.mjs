/**
 * Downloads the exact Figma logo + avatar assets for the "Trusted by leading
 * startups and enterprises" logo wall and the Testimonials section into
 * `public/logos` and `public/testimonials`.
 *
 * These URLs are served by the Figma desktop app's local Dev Mode MCP server
 * (http://localhost:3845). They are only reachable while:
 *   1. The Figma desktop app is running, AND
 *   2. The "Mirai Studios" file is open.
 *
 * Run once (Node 18+):  node scripts/download-figma-assets.mjs
 *
 * Note: the asset hashes are tied to the current Figma session. If a download
 * 404s, re-open the file in Figma and re-run. The "Epidemic Sound" logo has no
 * single exportable asset (it is drawn from many masked fragments), so it falls
 * back to a styled wordmark in the UI — export it manually from Figma to
 * public/logos/epidemic-sound.svg if you want the exact mark.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "http://localhost:3845/assets";

/** target path (relative to public/) -> figma asset hash */
const ASSETS = {
  // ── Logo wall — row 1 ───────────────────────────────────────────────
  "logos/rivian.svg": "3a52e8ecad5e23475ff6d434034a2d1d41244338.svg",
  "logos/digital-saudi.png": "e7b1549e9effecf9e4816c8369d23de4813704a3.png",
  "logos/saudi-tourism.png": "6a0155d01cf9fe781012a390851b96bdbc998c0d.png",
  "logos/nhc.svg": "d81a00cc1eb94a9d2b702f5dda7d12623f19da15.svg",
  "logos/coca-cola.svg": "87d48e54b76d3349a9e93567c1f57b311ea6e0f3.svg",
  "logos/pwc.svg": "12572361c4db1a920160029c84130a11d56e1ad8.svg",
  // ── Logo wall — row 2 ───────────────────────────────────────────────
  "logos/flipboard.svg": "4469b8b9222b3f85592db551b5e05ccdd6c66b22.svg",
  "logos/google.svg": "f7d066f66861429427dea48149c72e4dfa3ce0c1.svg",
  "logos/enorta.svg": "94dd4d6fe363c01dec62bdd19ffab36409d10b1f.svg",
  "logos/mclaren.svg": "ebd3719eba9d75cd5657a87972857f3af27363bc.svg",
  "logos/cero.svg": "ed6a1bec879b8a197c31345e218d9f930ce9074a.svg",
  "logos/salesforce.svg": "ec84eda1c18aed6e63eb75e7d5f61bc22d9c79b0.svg",
  // ── Logo wall — row 3 ───────────────────────────────────────────────
  "logos/eye-of-riyadh.svg": "427a1af3b479b402e06c2162a10b6c096d70b882.svg",
  "logos/lexus.svg": "edb10c05726ed34faf36f76f34b2edad854cd9de.svg",
  "logos/wnba.svg": "3d4c83be835eb28dd8ba5e180c1e723605344d00.svg",
  "logos/launchdarkly.svg": "f8457f4876cc715ccfd6ebaa7bb64bccb1013a29.svg",
  "logos/tim-hortons.svg": "ff871acf0c6a7d6c0ae6b69dc73aa14839e4366a.svg",
  // ── Testimonial avatars ─────────────────────────────────────────────
  "testimonials/sarah-jenkins.png": "af33d7543768c1f859cad141c1176de63b033fe1.png",
  "testimonials/tariq-al-fadli.png": "eba5cac9a2732c03bbd28c583b444cab3cda3764.png",
  "testimonials/khalid-al-dosari.png": "6460c13aa2ee3955927ea8be4548a281822f3879.png",
};

async function download(target, hash) {
  const url = `${BASE}/${hash}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const out = join(ROOT, "public", target);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, buf);
  return buf.length;
}

let ok = 0;
let fail = 0;
for (const [target, hash] of Object.entries(ASSETS)) {
  try {
    const bytes = await download(target, hash);
    console.log(`  ✓ ${target}  (${bytes} bytes)`);
    ok += 1;
  } catch (err) {
    console.error(`  ✗ ${target}  — ${err.message}`);
    fail += 1;
  }
}

console.log(`\nDone. ${ok} downloaded, ${fail} failed.`);
if (fail > 0) {
  console.log(
    "If downloads failed: open the Mirai Studios file in the Figma desktop app, " +
      "enable Dev Mode MCP, then re-run this script.",
  );
}
