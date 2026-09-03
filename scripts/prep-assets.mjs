// One-off asset preparation script (favicons, OG image, optimized logo derivatives).
// Not part of the app runtime — run manually with: node scripts/prep-assets.mjs
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC_LOGO = 'C:/Users/Victor Muniz/Downloads/LOGO-MIMO-KIDS.webp';
const ASSETS_IMG = path.join(ROOT, 'src/assets/img');
const PUBLIC = path.join(ROOT, 'public');

for (const dir of [ASSETS_IMG, PUBLIC]) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

const meta = await sharp(SRC_LOGO).metadata();
console.log('Source logo:', meta.width, 'x', meta.height, meta.format, 'alpha:', meta.hasAlpha);

// The source logo is a flat opaque white-background webp. Key out near-white
// pixels (with a soft feather) so we get a genuinely transparent PNG — this is
// what lets the logo sit cleanly on the cream background everywhere it's used.
async function removeWhiteBackground(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const lo = 225;
  const hi = 253;
  for (let i = 0; i < data.length; i += channels) {
    const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    let alpha;
    if (lum <= lo) alpha = 255;
    else if (lum >= hi) alpha = 0;
    else alpha = Math.round(255 * (1 - (lum - lo) / (hi - lo)));
    data[i + 3] = Math.min(data[i + 3], alpha);
  }
  return sharp(data, { raw: { width, height, channels } }).png();
}

const cutout = await removeWhiteBackground(SRC_LOGO);
const trimmed = sharp(await cutout.toBuffer()).trim();

// 1) Header/hero logo — trimmed, transparent, optimized webp, three densities
//    (320w keeps small mobile viewports from downloading more than they render).
await trimmed.clone().resize({ width: 320 }).webp({ quality: 92 }).toFile(path.join(ASSETS_IMG, 'logo-mimo-kids-320.webp'));
await trimmed.clone().resize({ width: 480 }).webp({ quality: 92 }).toFile(path.join(ASSETS_IMG, 'logo-mimo-kids-480.webp'));
await trimmed.clone().resize({ width: 960 }).webp({ quality: 92 }).toFile(path.join(ASSETS_IMG, 'logo-mimo-kids-960.webp'));
const trimmedMeta = await trimmed.clone().toBuffer({ resolveWithObject: true });
console.log('Trimmed logo:', trimmedMeta.info.width, 'x', trimmedMeta.info.height);

// 2) Favicons / touch icons — logo composited on a soft cream rounded square so it reads at tiny sizes.
const CREAM = '#FDF4E6';
async function iconOnBg(size, file, radius = 0) {
  const pad = Math.round(size * 0.12);
  const inner = size - pad * 2;
  const logoBuf = await trimmed.clone().resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  let bg = sharp({ create: { width: size, height: size, channels: 4, background: CREAM } });
  if (radius > 0) {
    const mask = Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`);
    bg = bg.composite([{ input: mask, blend: 'dest-in' }]);
  }
  await bg
    .composite([{ input: logoBuf, top: pad, left: pad }])
    .png()
    .toFile(file);
}

await iconOnBg(16, path.join(PUBLIC, 'favicon-16.png'));
await iconOnBg(32, path.join(PUBLIC, 'favicon-32.png'));
await iconOnBg(48, path.join(PUBLIC, 'favicon-48.png'));
await iconOnBg(180, path.join(PUBLIC, 'apple-touch-icon.png'), 36);
await iconOnBg(192, path.join(PUBLIC, 'icon-192.png'), 38);
await iconOnBg(512, path.join(PUBLIC, 'icon-512.png'), 102);
await iconOnBg(512, path.join(PUBLIC, 'icon-512-maskable.png'), 0);

// .ico with multiple sizes — hand-rolled "PNG-in-ICO" container (supported by
// every modern browser) instead of a dependency: the abandoned `to-ico`
// package drags in a chain of long-unpatched transitive CVEs (jimp/request/
// form-data/qs/…) for what's a ~30-line binary format.
import { readFileSync, writeFileSync } from 'node:fs';

function buildIco(pngBuffersBySize) {
  const count = pngBuffersBySize.length;
  const headerSize = 6 + 16 * count;
  let offset = headerSize;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const entries = [];
  for (const { size, buf } of pngBuffersBySize) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256px)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buf.length, 8); // image data size
    entry.writeUInt32LE(offset, 12); // image data offset
    offset += buf.length;
    entries.push(entry);
  }

  return Buffer.concat([header, ...entries, ...pngBuffersBySize.map((p) => p.buf)]);
}

const icoSizes = [16, 32, 48];
const icoBuf = buildIco(icoSizes.map((size) => ({ size, buf: readFileSync(path.join(PUBLIC, `favicon-${size}.png`)) })));
writeFileSync(path.join(PUBLIC, 'favicon.ico'), icoBuf);

// 3) Open Graph / Twitter card image 1200x630 — cream background, pastel waves, centered logo.
const OG_W = 1200;
const OG_H = 630;
const ogLogo = await trimmed.clone().resize({ width: 640, height: 460, fit: 'inside' }).png().toBuffer();
const ogLogoMeta = await sharp(ogLogo).metadata();
const ogSvgBg = `
<svg width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${OG_W}" height="${OG_H}" fill="#FDF4E6"/>
  <path d="M0,90 C150,140 300,40 480,80 C660,120 780,40 960,70 C1080,90 1150,60 1200,80 L1200,0 L0,0 Z" fill="#FBB6C9"/>
  <path d="M0,${OG_H} C180,${OG_H-90} 340,${OG_H-10} 520,${OG_H-60} C700,${OG_H-110} 860,${OG_H-30} 1040,${OG_H-70} C1120,${OG_H-90} 1170,${OG_H-60} 1200,${OG_H-70} L1200,${OG_H} L0,${OG_H} Z" fill="#92C9EA"/>
  <circle cx="90" cy="170" r="10" fill="#F8C144"/>
  <circle cx="1120" cy="520" r="14" fill="#8CC474"/>
  <circle cx="150" cy="520" r="8" fill="#F27A6E"/>
  <circle cx="1080" cy="150" r="9" fill="#B79BD9"/>
</svg>`;
await sharp(Buffer.from(ogSvgBg))
  .composite([{ input: ogLogo, top: Math.round((OG_H - ogLogoMeta.height) / 2), left: Math.round((OG_W - ogLogoMeta.width) / 2) }])
  .jpeg({ quality: 88 })
  .toFile(path.join(PUBLIC, 'og-image.jpg'));

console.log('Done.');
