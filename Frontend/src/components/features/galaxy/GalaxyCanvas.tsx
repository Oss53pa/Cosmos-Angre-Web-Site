import React, { useEffect, useRef } from 'react';

/**
 * GalaxyCanvas — Le moteur cosmique signature de Cosmos Angré.
 *
 * Une galaxie spirale procédurale rendue sur <canvas> : noyau lumineux doré,
 * bras d'étoiles en rotation différentielle (le centre tourne plus vite que les
 * bords), nébuleuse forêt profonde, poussière d'étoiles scintillante et parallaxe
 * douce à la souris. Aucune image, aucune dépendance — 100 % génératif.
 *
 * Palette dérivée des tokens CSS du thème (Forêt + Or) : se met à jour avec la charte.
 * Respecte prefers-reduced-motion (rend une image statique sans boucle d'animation).
 *
 * Le parent doit être `position: relative`. Le canvas remplit le parent.
 */

type Density = 'low' | 'med' | 'high';

interface GalaxyCanvasProps {
  className?: string;
  /** Densité d'étoiles. 'high' réservé aux sections immersives plein écran. */
  density?: Density;
  /** Active la parallaxe à la souris (désactiver pour les sections secondaires). */
  interactive?: boolean;
  /** Vitesse de rotation globale (1 = défaut). */
  speed?: number;
  /** Opacité globale du rendu (0–1). */
  opacity?: number;
  /** Position horizontale du cœur galactique (fraction 0–1). */
  centerX?: number;
  /** Position verticale du cœur galactique (fraction 0–1). */
  centerY?: number;
}

interface Star {
  /** rayon normalisé 0–1 depuis le centre galactique */
  rad: number;
  /** angle de base (radians) */
  ang: number;
  /** vitesse angulaire propre (rotation différentielle) */
  spin: number;
  size: number;
  /** index couleur 0=cœur or, 1=or doux, 2=crème, 3=cuivre */
  tint: number;
  base: number; // luminosité de base
  tw: number; // phase de scintillement
  twSpeed: number;
  depth: number; // 0–1 pour la parallaxe
}

const DENSITY_MAP: Record<Density, number> = { low: 480, med: 820, high: 1500 };

function readRGB(varName: string, fallback: [number, number, number]): [number, number, number] {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (!raw) return fallback;
  const parts = raw.split(/[\s,]+/).map(Number);
  if (parts.length >= 3 && parts.every((n) => !Number.isNaN(n))) {
    return [parts[0], parts[1], parts[2]];
  }
  return fallback;
}

const GalaxyCanvas: React.FC<GalaxyCanvasProps> = ({
  className = '',
  density = 'high',
  interactive = true,
  speed = 1,
  opacity = 1,
  centerX = 0.62,
  centerY = 0.46,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Palette (depuis les tokens du thème) ──
    const gold = readRGB('--cosmos-gold', [201, 148, 58]);
    const goldSoft = readRGB('--cosmos-gold-light', [232, 201, 122]);
    const cream = readRGB('--cosmos-cream', [237, 228, 211]);
    const copper = readRGB('--cosmos-accent', [185, 130, 46]);
    const deep = readRGB('--cosmos-night-deep', [36, 65, 44]);
    const night = readRGB('--cosmos-night', [47, 84, 57]);
    const tints: [number, number, number][] = [goldSoft, gold, cream, copper];

    let w = 0;
    let h = 0;
    let dpr = 1;
    let cx = 0;
    let cy = 0;
    let maxR = 0;

    // ── Densité adaptative (mobile = moins d'étoiles) ──
    const baseCount = DENSITY_MAP[density];

    let stars: Star[] = [];

    // ── Étoiles filantes ──
    interface Shooter {
      x: number;
      y: number;
      vx: number;
      vy: number;
      len: number;
      life: number;
      max: number;
    }
    let shooters: Shooter[] = [];
    let lastT = 0;
    let shootAcc = 0;
    let nextShoot = 1.4;

    const spawnShooter = () => {
      const startX = w * (0.45 + Math.random() * 0.5);
      const startY = h * (Math.random() * 0.35);
      const ang = Math.PI * (0.72 + Math.random() * 0.12); // descend vers la gauche-bas
      const sp = (w * 0.45 + Math.random() * w * 0.3);
      shooters.push({
        x: startX,
        y: startY,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        len: 90 + Math.random() * 120,
        life: 0,
        max: 0.7 + Math.random() * 0.4,
      });
    };

    const buildStars = () => {
      const isMobile = w < 768;
      const count = Math.round(baseCount * (isMobile ? 0.5 : 1));
      const ARMS = 3;
      const WINDINGS = 2.4; // nombre de tours des bras spiraux
      const SPREAD = 0.42; // dispersion latérale des bras
      stars = Array.from({ length: count }, () => {
        // distribution biaisée vers le centre (densité du bulbe)
        const t = Math.pow(Math.random(), 1.7);
        const arm = Math.floor(Math.random() * ARMS);
        const armAngle = (arm / ARMS) * Math.PI * 2;
        const spread = (Math.random() - 0.5) * SPREAD * (0.4 + t);
        const ang = armAngle + t * WINDINGS * Math.PI * 2 + spread;
        const rad = t;
        // rotation différentielle : le cœur tourne plus vite
        const spin = (0.18 + 0.5 * (1 - t)) * (Math.random() * 0.4 + 0.8);
        // teinte : cœur doré, périphérie crème
        let tint: number;
        const roll = Math.random();
        if (t < 0.35) tint = roll < 0.7 ? 1 : 3; // cœur : or / cuivre
        else if (t < 0.7) tint = roll < 0.5 ? 0 : 2; // milieu : or doux / crème
        else tint = roll < 0.65 ? 2 : 0; // bords : crème
        return {
          rad,
          ang,
          spin,
          size: Math.random() * 1.4 + (t < 0.3 ? 0.7 : 0.3),
          tint,
          base: 0.35 + Math.random() * 0.65,
          tw: Math.random() * Math.PI * 2,
          twSpeed: Math.random() * 1.6 + 0.4,
          depth: Math.random(),
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Centre galactique (configurable)
      cx = w * centerX;
      cy = h * centerY;
      maxR = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) * 0.92;
      buildStars();
    };

    const drawBackground = () => {
      // Base : forêt très sombre au cœur, nuit quasi noire vers les bords (contraste premium)
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 1.25);
      bg.addColorStop(0, `rgb(${Math.round(deep[0] * 0.62)}, ${Math.round(deep[1] * 0.66)}, ${Math.round(deep[2] * 0.62)})`);
      bg.addColorStop(0.45, `rgb(${Math.round(deep[0] * 0.34)}, ${Math.round(deep[1] * 0.38)}, ${Math.round(deep[2] * 0.34)})`);
      bg.addColorStop(1, 'rgb(6, 11, 8)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';
      // Halo forêt LOCALISÉ autour du cœur (la teinte verte ne couvre plus tout l'écran)
      const green = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.5);
      green.addColorStop(0, `rgba(${night[0]}, ${night[1]}, ${night[2]}, 0.5)`);
      green.addColorStop(0.55, `rgba(${night[0]}, ${night[1]}, ${night[2]}, 0.1)`);
      green.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = green;
      ctx.fillRect(0, 0, w, h);

      // Nébuleuse dorée (additif)
      const neb = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.6);
      neb.addColorStop(0, `rgba(${gold[0]}, ${gold[1]}, ${gold[2]}, 0.26)`);
      neb.addColorStop(0.5, `rgba(${copper[0]}, ${copper[1]}, ${copper[2]}, 0.08)`);
      neb.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, w, h);
    };

    const drawCore = (pulse: number) => {
      ctx.globalCompositeOperation = 'lighter';

      // Bloom large et doux (halo qui enveloppe le cœur)
      const br = maxR * 0.44;
      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, br);
      bloom.addColorStop(0, `rgba(${goldSoft[0]}, ${goldSoft[1]}, ${goldSoft[2]}, 0.16)`);
      bloom.addColorStop(0.5, `rgba(${gold[0]}, ${gold[1]}, ${gold[2]}, 0.05)`);
      bloom.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bloom;
      ctx.fillRect(cx - br, cy - br, br * 2, br * 2);

      // Noyau (centre chaud presque blanc → or)
      const r = maxR * (0.16 + pulse * 0.012);
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      core.addColorStop(0, 'rgba(255, 253, 246, 0.98)');
      core.addColorStop(0.12, `rgba(${cream[0]}, ${cream[1]}, ${cream[2]}, 0.85)`);
      core.addColorStop(0.32, `rgba(${goldSoft[0]}, ${goldSoft[1]}, ${goldSoft[2]}, 0.55)`);
      core.addColorStop(0.6, `rgba(${gold[0]}, ${gold[1]}, ${gold[2]}, 0.16)`);
      core.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = core;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

      // Éclat anamorphique horizontal — discret (un simple glint, pas une barre)
      const fw = maxR * 0.42;
      const fh = 1.4 + pulse * 0.6;
      const flareH = ctx.createLinearGradient(cx - fw, cy, cx + fw, cy);
      flareH.addColorStop(0, 'rgba(0,0,0,0)');
      flareH.addColorStop(0.5, `rgba(${goldSoft[0]}, ${goldSoft[1]}, ${goldSoft[2]}, ${0.16 + pulse * 0.05})`);
      flareH.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = flareH;
      ctx.fillRect(cx - fw, cy - fh, fw * 2, fh * 2);
    };

    const render = (time: number) => {
      const t = time * 0.001;
      // Parallaxe douce
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.05;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.05;
      const px = interactive ? mouse.current.x : 0;
      const py = interactive ? mouse.current.y : 0;

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      drawBackground();

      const pulse = Math.sin(t * 0.8) * 0.5 + 0.5;
      drawCore(pulse);

      // Étoiles
      ctx.globalCompositeOperation = 'lighter';
      const rot = reduced ? 0 : t * 0.04 * speed;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const angle = s.ang + rot * s.spin;
        const r = s.rad * maxR;
        // ellipse galactique (vue légèrement inclinée) : on aplatit Y
        const ex = Math.cos(angle) * r;
        const ey = Math.sin(angle) * r * 0.62;
        const par = (s.depth - 0.5) * 2; // -1..1
        const x = cx + ex + px * (8 + par * 14);
        const y = cy + ey + py * (8 + par * 14);
        if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;

        const twinkle = reduced ? 1 : 0.55 + 0.45 * Math.sin(s.tw + t * s.twSpeed);
        const a = Math.min(1, s.base * twinkle) * opacity;
        const c = tints[s.tint];
        ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
        const size = s.size * (0.85 + s.depth * 0.5);
        // halo léger pour les plus grosses étoiles
        if (size > 1.3) {
          ctx.beginPath();
          ctx.arc(x, y, size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a * 0.12})`;
          ctx.fill();
          ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
        }
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        // Pointes de diffraction sur les étoiles les plus brillantes (effet premium)
        if (size > 1.55) {
          const spike = size * (3.2 + twinkle * 1.6);
          ctx.strokeStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a * 0.45})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(x - spike, y);
          ctx.lineTo(x + spike, y);
          ctx.moveTo(x, y - spike);
          ctx.lineTo(x, y + spike);
          ctx.stroke();
        }
      }

      // ── Étoiles filantes ──
      if (!reduced) {
        const dt = lastT ? Math.min((time - lastT) * 0.001, 0.05) : 0;
        lastT = time;
        shootAcc += dt;
        if (shootAcc > nextShoot) {
          shootAcc = 0;
          nextShoot = 3 + Math.random() * 4;
          if (shooters.length < 2) spawnShooter();
        }
        for (let i = shooters.length - 1; i >= 0; i--) {
          const sh = shooters[i];
          sh.life += dt;
          sh.x += sh.vx * dt;
          sh.y += sh.vy * dt;
          const k = sh.life / sh.max;
          if (k >= 1) {
            shooters.splice(i, 1);
            continue;
          }
          const fade = Math.sin(k * Math.PI); // apparition/disparition douce
          const tailX = sh.x - (sh.vx / Math.hypot(sh.vx, sh.vy)) * sh.len;
          const tailY = sh.y - (sh.vy / Math.hypot(sh.vx, sh.vy)) * sh.len;
          const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
          grad.addColorStop(0, `rgba(${cream[0]}, ${cream[1]}, ${cream[2]}, ${0.9 * fade})`);
          grad.addColorStop(0.4, `rgba(${goldSoft[0]}, ${goldSoft[1]}, ${goldSoft[2]}, ${0.4 * fade})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(sh.x, sh.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
      }

      ctx.globalCompositeOperation = 'source-over';

      if (!reduced) rafRef.current = requestAnimationFrame(render);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.current.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (interactive) window.addEventListener('mousemove', onMove, { passive: true });

    // Pause hors écran (économie batterie / CPU)
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = visible;
        visible = entry.isIntersecting;
        if (visible && !wasVisible && !reduced) {
          rafRef.current = requestAnimationFrame(render);
        } else if (!visible) {
          cancelAnimationFrame(rafRef.current);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    if (reduced) {
      render(0); // image statique unique
    } else {
      rafRef.current = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      if (interactive) window.removeEventListener('mousemove', onMove);
    };
  }, [density, interactive, speed, opacity, centerX, centerY]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
};

export default GalaxyCanvas;
