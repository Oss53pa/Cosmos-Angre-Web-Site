/**
 * Headers CORS partagés pour les Edge Functions Cosmos.
 * À surveiller: ALLOWED_ORIGINS doit lister uniquement les domaines de prod.
 */
const ALLOWED_ORIGINS = [
  'https://www.cosmos-angre.com',
  'https://cosmos-angre.com',
  'http://localhost:5173',
  'http://localhost:4173',
];

export function corsHeaders(origin: string | null): HeadersInit {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]!;
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, apikey',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function handlePreflight(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(req.headers.get('Origin')) });
  }
  return null;
}
