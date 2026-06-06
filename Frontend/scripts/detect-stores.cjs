const sharp = require('sharp');
const path = require('path');
const IMG = path.join(__dirname, '..', 'public', 'plan-cosmos.png');

async function main() {
  const { data, info } = await sharp(IMG).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  console.log(`Image: ${W}x${H}\n`);
  const px = (x, y) => { const i = (y * W + x) * 4; return [data[i], data[i+1], data[i+2]]; };

  // Scan horizontal lines to find colored segments
  function scanRow(y) {
    const segs = [];
    let inSeg = false, segStart = 0;
    for (let x = 30; x < 1950; x++) {
      const [r,g,b] = px(x, y);
      const isBg = (r > 205 && g > 205 && b > 205) || (r < 45 && g < 45 && b < 45);
      if (!isBg) {
        if (!inSeg) { segStart = x; inSeg = true; }
      } else {
        if (inSeg && (x - segStart) > 20) {
          const mid = Math.round((segStart + x) / 2);
          segs.push({ x1: segStart, x2: x, mid, rgb: px(mid, y) });
        }
        inSeg = false;
      }
    }
    return segs;
  }

  // Dense scan every 10px
  const allSegs = [];
  for (let y = 80; y < 1800; y += 10) {
    for (const s of scanRow(y)) {
      allSegs.push({ ...s, y });
    }
  }

  // Merge into rectangular regions
  const regions = [];
  const used = new Set();
  for (let i = 0; i < allSegs.length; i++) {
    if (used.has(i)) continue;
    const s = allSegs[i];
    let x1 = s.x1, x2 = s.x2, y1 = s.y, y2 = s.y;
    used.add(i);
    let changed = true;
    while (changed) {
      changed = false;
      for (let j = 0; j < allSegs.length; j++) {
        if (used.has(j)) continue;
        const t = allSegs[j];
        // Overlap in x (at least 50%) and adjacent in y
        const overlap = Math.min(x2, t.x2) - Math.max(x1, t.x1);
        const minW = Math.min(x2-x1, t.x2-t.x1);
        if (overlap > minW * 0.4 && t.y >= y1 - 20 && t.y <= y2 + 20) {
          used.add(j);
          x1 = Math.min(x1, t.x1); x2 = Math.max(x2, t.x2);
          y1 = Math.min(y1, t.y); y2 = Math.max(y2, t.y);
          changed = true;
        }
      }
    }
    const w = x2 - x1, h = y2 - y1;
    if (w > 40 && h > 40 && w < 900 && h < 700) {
      const cx = Math.round((x1+x2)/2), cy = Math.round((y1+y2)/2);
      const [r,g,b] = px(cx, cy);
      regions.push({ x1, y1, x2, y2, w, h, cx, cy, r, g, b });
    }
  }

  regions.sort((a, b) => (b.w * b.h) - (a.w * a.h));
  console.log(`Found ${regions.length} regions (top 40):\n`);
  console.log(`${'BBox'.padEnd(28)} ${'Size'.padEnd(10)} ${'Center'.padEnd(14)} Color`);
  console.log('-'.repeat(75));
  for (const r of regions.slice(0, 40)) {
    const lbl = `(${r.x1},${r.y1})-(${r.x2},${r.y2})`;
    const sz = `${r.w}x${r.h}`;
    const ct = `(${r.cx},${r.cy})`;
    console.log(`${lbl.padEnd(28)} ${sz.padEnd(10)} ${ct.padEnd(14)} rgb(${r.r},${r.g},${r.b})`);
  }
}
main().catch(console.error);
