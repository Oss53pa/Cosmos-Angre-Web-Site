/**
 * Pipeline d'optimisation d'images pour Cosmos Angré.
 *
 * Pour chaque JPG/PNG dans IMAGES_DIR :
 *  1. Resize si > MAX_WIDTH
 *  2. Réécrit le JPG/PNG (mozjpeg) compressé
 *  3. Génère AVIF (qualité plus haute, plus efficace)
 *  4. Génère WebP (fallback)
 *  5. Génère versions responsive (1920w, 1280w, 768w, 480w) si --responsive
 *
 * Usage:
 *   node scripts/optimize-images.mjs              # in-place optimize + AVIF/WebP siblings
 *   node scripts/optimize-images.mjs --responsive # ajoute -1920w, -1280w, -768w, -480w
 */
import sharp from 'sharp';
import { readdir, stat, rename, unlink, access } from 'fs/promises';
import { constants } from 'fs';
import { join, parse } from 'path';

const IMAGES_DIR = 'src/assets/images/branding';
const MAX_WIDTH = 1920;
const QUALITY_JPG = 82;
const QUALITY_WEBP = 82;
const QUALITY_AVIF = 60;
const RESPONSIVE_WIDTHS = [1920, 1280, 768, 480];
const argv = process.argv.slice(2);
const responsiveMode = argv.includes('--responsive');

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function optimizeOne(filePath, originalName) {
  const { name, dir } = parse(filePath);
  const tempPath = `${filePath}.tmp`;
  const fileInfo = await stat(filePath);

  // 1. Optimisation in-place du JPG/PNG
  let savedOrig = 0;
  if (fileInfo.size >= 200 * 1024) {
    try {
      const metadata = await sharp(filePath).metadata();
      let pipe = sharp(filePath);
      if (metadata.width && metadata.width > MAX_WIDTH) {
        pipe = pipe.resize(MAX_WIDTH, null, { withoutEnlargement: true });
      }
      await pipe.jpeg({ quality: QUALITY_JPG, mozjpeg: true }).toFile(tempPath);
      const newInfo = await stat(tempPath);
      const saved = fileInfo.size - newInfo.size;
      if (saved > 1024) {
        await unlink(filePath);
        await rename(tempPath, filePath);
        savedOrig = saved;
      } else {
        await unlink(tempPath);
      }
    } catch (err) {
      try { await unlink(tempPath); } catch {}
      console.error(`  ERR jpg ${originalName}: ${err.message}`);
    }
  }

  // 2. AVIF + WebP (siblings)
  const avifPath = join(dir, `${name}.avif`);
  const webpPath = join(dir, `${name}.webp`);

  for (const [outPath, opts, label] of [
    [avifPath, { quality: QUALITY_AVIF, effort: 5 }, 'avif'],
    [webpPath, { quality: QUALITY_WEBP, effort: 5 }, 'webp'],
  ]) {
    if (await exists(outPath)) continue;
    try {
      const metadata = await sharp(filePath).metadata();
      let pipe = sharp(filePath);
      if (metadata.width && metadata.width > MAX_WIDTH) {
        pipe = pipe.resize(MAX_WIDTH, null, { withoutEnlargement: true });
      }
      if (label === 'avif') await pipe.avif(opts).toFile(outPath);
      else await pipe.webp(opts).toFile(outPath);
    } catch (err) {
      console.error(`  ERR ${label} ${originalName}: ${err.message}`);
    }
  }

  // 3. Responsive (optionnel)
  if (responsiveMode) {
    for (const w of RESPONSIVE_WIDTHS) {
      const meta = await sharp(filePath).metadata();
      if (!meta.width || meta.width < w) continue;
      for (const ext of ['avif', 'webp']) {
        const out = join(dir, `${name}-${w}w.${ext}`);
        if (await exists(out)) continue;
        try {
          let pipe = sharp(filePath).resize(w, null, { withoutEnlargement: true });
          if (ext === 'avif') pipe = pipe.avif({ quality: QUALITY_AVIF, effort: 5 });
          else pipe = pipe.webp({ quality: QUALITY_WEBP, effort: 5 });
          await pipe.toFile(out);
        } catch (err) {
          console.error(`  ERR ${ext} ${w}w ${originalName}: ${err.message}`);
        }
      }
    }
  }

  return savedOrig;
}

async function run() {
  console.log(`> Image pipeline (responsive=${responsiveMode})`);
  console.log(`> Source: ${IMAGES_DIR}`);
  const files = await readdir(IMAGES_DIR);
  const candidates = files.filter((f) => /\.(jpe?g|png)$/i.test(f) && !f.startsWith('page_'));

  let totalSaved = 0;
  let processed = 0;
  for (const file of candidates) {
    const fp = join(IMAGES_DIR, file);
    try {
      const saved = await optimizeOne(fp, file);
      totalSaved += saved;
      processed += 1;
      if (saved > 0) {
        console.log(`  OK ${file} -${(saved / 1024).toFixed(0)}KB`);
      } else {
        console.log(`  OK ${file} (siblings only)`);
      }
    } catch (err) {
      console.error(`  ERR ${file}: ${err.message}`);
    }
  }
  console.log(
    `\nDone. ${processed}/${candidates.length} processed, ${(totalSaved / (1024 * 1024)).toFixed(2)} MB saved on originals.`
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
