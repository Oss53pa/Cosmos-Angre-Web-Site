/**
 * OG image generator dynamique — Vercel Edge Function.
 *
 * Usage :
 *   /api/og?title=Nike+Store&subtitle=Boutique+sport&type=store
 *   /api/og?title=Soirée+gala&subtitle=15+décembre+2025&type=event
 *   /api/og?title=Article+du+blog&subtitle=Lifestyle&type=article
 *
 * Renvoie une PNG 1200×630 cohérente avec la charte cosmos-night/gold/cream.
 *
 * Prérequis :
 *   npm i -D @vercel/og
 *
 * Déploiement : automatique sur Vercel quand le fichier est dans /api/.
 */
import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const COSMOS_NIGHT = '#0B1929';
const COSMOS_GOLD = '#C9A961';
const COSMOS_CREAM = '#FAF7F2';

const TYPE_LABELS: Record<string, string> = {
  store: 'Boutique',
  event: 'Événement',
  article: 'Magazine',
  page: 'Cosmos Angré',
  default: 'Cosmos Angré',
};

export default function handler(req: Request): Response {
  const url = new URL(req.url);
  const title = url.searchParams.get('title')?.slice(0, 80) ?? 'Cosmos Angré';
  const subtitle = url.searchParams.get('subtitle')?.slice(0, 100) ?? 'Un monde à part';
  const type = (url.searchParams.get('type') ?? 'default').toLowerCase();
  const label = TYPE_LABELS[type] ?? TYPE_LABELS.default;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${COSMOS_NIGHT} 0%, #11243d 100%)`,
          padding: '80px',
          fontFamily: 'serif',
          color: COSMOS_CREAM,
          position: 'relative',
        }}
      >
        {/* Bandeau or */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: COSMOS_GOLD,
          }}
        />

        {/* Petit label "Type" */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            color: COSMOS_GOLD,
            fontSize: '20px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
            fontWeight: 500,
            marginBottom: '16px',
          }}
        >
          {label}
        </div>

        {/* Titre */}
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 40 ? '64px' : '88px',
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: '32px',
            color: COSMOS_CREAM,
            maxWidth: '1000px',
          }}
        >
          {title}
        </div>

        {/* Sous-titre */}
        {subtitle && (
          <div
            style={{
              display: 'flex',
              fontSize: '32px',
              fontWeight: 200,
              fontFamily: 'sans-serif',
              color: 'rgba(250, 247, 242, 0.7)',
              maxWidth: '1000px',
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Footer : marque */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            position: 'absolute',
            bottom: '60px',
            left: '80px',
            right: '80px',
            color: COSMOS_CREAM,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: '32px', fontWeight: 400, letterSpacing: '0.05em' }}>Cosmos Angré</div>
            <div
              style={{
                fontSize: '16px',
                fontFamily: 'sans-serif',
                fontWeight: 400,
                color: 'rgba(250, 247, 242, 0.5)',
                letterSpacing: '0.1em',
              }}
            >
              cosmos-angre.com — Cocody-Angré, Abidjan
            </div>
          </div>
          <div
            style={{
              fontSize: '24px',
              color: COSMOS_GOLD,
              fontFamily: 'sans-serif',
              letterSpacing: '0.2em',
            }}
          >
            ✦
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}
