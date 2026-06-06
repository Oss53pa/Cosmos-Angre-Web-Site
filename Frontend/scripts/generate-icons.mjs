// Generates the favicon / PWA icon set from the brand SVGs in public/.
// Run: node scripts/generate-icons.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const iconsDir = join(pub, 'icons');
mkdirSync(iconsDir, { recursive: true });

const favicon = join(pub, 'favicon.svg');
const maskable = join(iconsDir, 'icon-maskable.svg');

const jobs = [
  [favicon, join(pub, 'favicon-16x16.png'), 16],
  [favicon, join(pub, 'favicon-32x32.png'), 32],
  [favicon, join(pub, 'apple-touch-icon.png'), 180],
  [favicon, join(iconsDir, 'icon-192.png'), 192],
  [favicon, join(iconsDir, 'icon-512.png'), 512],
  [maskable, join(iconsDir, 'icon-maskable-512.png'), 512],
];

for (const [src, out, size] of jobs) {
  await sharp(src, { density: 512 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out);
  console.log(`✓ ${out.replace(root + '\\', '').replace(/\\/g, '/')} (${size}x${size})`);
}
console.log('Done.');
