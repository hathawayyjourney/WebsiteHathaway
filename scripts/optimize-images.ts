// Converts raw Gemini images in assets-raw/ into optimized web assets.
// Usage: npm run images              → process every asset found in assets-raw/
//        npm run images -- H1 B3-asia → only these IDs
// File naming and prompts: docs/image-assets.md
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { IMAGE_ASSETS, type ImageAsset } from '../src/lib/image-assets';

const ROOT = process.cwd();
const RAW_DIR = path.join(ROOT, 'assets-raw');
const RAW_EXT = ['.png', '.jpg', '.jpeg', '.webp'];
const HERO_BUDGET_KB = 300;

function findRaw(id: string): string | null {
  if (!existsSync(RAW_DIR)) return null;
  const match = readdirSync(RAW_DIR).find((f) => {
    const ext = path.extname(f).toLowerCase();
    return RAW_EXT.includes(ext) && path.basename(f, path.extname(f)).toLowerCase() === id.toLowerCase();
  });
  return match ? path.join(RAW_DIR, match) : null;
}

function outPath(asset: ImageAsset): string {
  return asset.kind === 'og' ? path.join(ROOT, asset.file) : path.join(ROOT, 'public', asset.file);
}

async function photo(raw: string, asset: ImageAsset, out: string) {
  // Crop to the target aspect ratio, but never upscale a smaller source (that only adds blur).
  const { width = asset.width, height = asset.height } = await sharp(raw).rotate().metadata();
  const scale = Math.min(1, width / asset.width, height / asset.height);
  await sharp(raw)
    .rotate()
    .resize(Math.round(asset.width * scale), Math.round(asset.height * scale), { fit: 'cover', position: sharp.strategy.attention })
    .webp({ quality: 78, effort: 5 })
    .toFile(out);
}

/**
 * Removes a solid studio background: samples the corner color, flood-fills from the edges
 * with a tolerance, and feathers the boundary. Raw files that already have transparency
 * (e.g. exported from remove.bg) are kept as-is.
 */
async function cutout(raw: string, asset: ImageAsset, out: string) {
  const { data, info } = await sharp(raw).rotate().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = (x: number, y: number) => (y * w + x) * 4;

  const corners = [px(0, 0), px(w - 1, 0), px(0, h - 1), px(w - 1, h - 1)];
  const alreadyTransparent = corners.every((i) => data[i + 3] < 16);

  if (!alreadyTransparent) {
    const bg = [0, 1, 2].map((c) => corners.reduce((sum, i) => sum + data[i + c], 0) / corners.length);
    const greenScreen = bg[1] > bg[0] + 40 && bg[1] > bg[2] + 40;
    const dist = (i: number) => Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]);
    const HARD = 60; // fully background
    const SOFT = 110; // partially transparent edge

    const visited = new Uint8Array(w * h);
    const queue = new Int32Array(w * h);
    let head = 0;
    let tail = 0;
    const push = (x: number, y: number) => {
      const k = y * w + x;
      if (visited[k]) return;
      visited[k] = 1;
      queue[tail++] = k;
    };
    for (let x = 0; x < w; x++) {
      push(x, 0);
      push(x, h - 1);
    }
    for (let y = 0; y < h; y++) {
      push(0, y);
      push(w - 1, y);
    }
    // On a green screen, darker green cast shadows next to the background are background too.
    const greenShadow = (i: number) => greenScreen && data[i + 1] > data[i] + 50 && data[i + 1] > data[i + 2] + 30;
    const despill = (i: number) => {
      if (greenScreen) data[i + 1] = Math.min(data[i + 1], Math.max(data[i], data[i + 2]));
    };

    // 1) Flood fill from the edges: removes the background and anything connected to it.
    while (head < tail) {
      const k = queue[head++];
      const i = k * 4;
      const d = dist(i);
      const shadow = greenShadow(i);
      if (d > SOFT && !shadow) continue; // reached the object
      data[i + 3] = d <= HARD || shadow ? 0 : Math.round(((d - HARD) / (SOFT - HARD)) * 255);
      if (data[i + 3] > 0) despill(i);
      if (d > HARD && !shadow) continue; // soft edge: don't spread further
      const x = k % w;
      const y = (k - x) / w;
      if (x > 0) push(x - 1, y);
      if (x < w - 1) push(x + 1, y);
      if (y > 0) push(x, y - 1);
      if (y < h - 1) push(x, y + 1);
    }

    // 2) Enclosed pockets (e.g. the gap inside a suitcase handle) that are almost exactly the
    //    background color. The tight threshold keeps intentionally green details such as stickers.
    if (greenScreen) {
      const POCKET = 25;
      const POCKET_EDGE = 40;
      for (let k = 0; k < w * h; k++) {
        const i = k * 4;
        if (visited[k] || data[i + 3] === 0) continue;
        const d = dist(i);
        if (d <= POCKET) data[i + 3] = 0;
        else if (d < POCKET_EDGE) {
          data[i + 3] = Math.round(((d - POCKET) / (POCKET_EDGE - POCKET)) * 255);
          despill(i);
        }
      }
    }
  }

  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .trim({ threshold: 1 })
    .resize(asset.width, asset.height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 85, alphaQuality: 90, effort: 5 })
    .toFile(out);
}

/** Social share image: cover-crop + logo on a white pill (AI is unreliable at rendering logos/text). */
async function og(raw: string, asset: ImageAsset, out: string) {
  const logoH = 96;
  const pad = 20;
  const logo = await sharp(path.join(ROOT, 'public/logo.png')).trim({ threshold: 10 }).resize({ height: logoH }).png().toBuffer();
  const { width: logoW = logoH } = await sharp(logo).metadata();
  const pill = Buffer.from(
    `<svg width="${logoW + pad * 2}" height="${logoH + pad * 2}"><rect width="100%" height="100%" rx="24" fill="#ffffff"/></svg>`,
  );
  const image = await sharp(raw)
    .rotate()
    .resize(asset.width, asset.height, { fit: 'cover', position: sharp.strategy.attention })
    .composite([
      { input: pill, left: 40, top: 40 },
      { input: logo, left: 40 + pad, top: 40 + pad },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();

  writeFileSync(out, image);
  writeFileSync(path.join(ROOT, 'app/twitter-image.jpg'), image);
  writeFileSync(path.join(ROOT, 'app/opengraph-image.alt.txt'), asset.alt);
  writeFileSync(path.join(ROOT, 'app/twitter-image.alt.txt'), asset.alt);
}

async function main() {
  const only = process.argv.slice(2).map((a) => a.toLowerCase());
  const assets = Object.values(IMAGE_ASSETS as Record<string, ImageAsset>).filter((a) => !only.length || only.includes(a.id.toLowerCase()));
  if (!existsSync(RAW_DIR)) mkdirSync(RAW_DIR);

  const rows: string[] = [];
  const missing: string[] = [];
  let warnings = 0;

  for (const asset of assets) {
    const raw = findRaw(asset.id);
    if (!raw) {
      missing.push(asset.id);
      continue;
    }
    const out = outPath(asset);
    mkdirSync(path.dirname(out), { recursive: true });
    if (asset.kind === 'cutout') await cutout(raw, asset, out);
    else if (asset.kind === 'og') await og(raw, asset, out);
    else await photo(raw, asset, out);

    const kb = Math.round(statSync(out).size / 1024);
    const heavy = asset.file.includes('/heroes/') && kb > HERO_BUDGET_KB;
    if (heavy) warnings++;
    rows.push(`  ✓ ${asset.id.padEnd(16)} → ${asset.file.padEnd(40)} ${String(kb).padStart(5)} KB${heavy ? '  ⚠ > 300 KB' : ''}`);
  }

  console.log(`\nDiproses: ${rows.length} file`);
  rows.forEach((r) => console.log(r));
  if (missing.length) console.log(`\nBelum ada di assets-raw/ (${missing.length}): ${missing.join(', ')}`);
  if (warnings) console.log('\n⚠ Ada hero di atas 300 KB — coba generate ulang dengan detail lebih sedikit atau kecilkan quality.');
  console.log('\nSelesai. Cek hasilnya dengan `npm run dev`, lalu commit folder public/images (dan app/opengraph-image.jpg).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
