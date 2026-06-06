/**
 * Edge Function: /functions/v1/newsletter-subscribe
 * Inscription newsletter avec :
 *  - Anti-doublon (upsert)
 *  - Email de bienvenue Resend
 *  - Rate limit 3 / 5min par IP
 *  - Honeypot
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders, handlePreflight } from '../_shared/cors.ts';
import { rateLimit, clientIp } from '../_shared/rateLimit.ts';
import { sendEmail } from '../_shared/resend.ts';

interface NewsletterPayload {
  email?: string;
  name?: string;
  source?: string;
  website?: string; // honeypot
}

const json = (status: number, body: unknown, origin: string | null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  const origin = req.headers.get('Origin');
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' }, origin);

  const ip = clientIp(req);
  const limit = rateLimit({ key: `newsletter:${ip}`, max: 3, windowMs: 5 * 60 * 1000 });
  if (!limit.allowed) {
    return new Response(JSON.stringify({ error: 'Too many requests', retryAfter: limit.retryAfter }), {
      status: 429,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json', 'Retry-After': String(limit.retryAfter) },
    });
  }

  let payload: NewsletterPayload;
  try {
    payload = (await req.json()) as NewsletterPayload;
  } catch {
    return json(400, { error: 'Body JSON invalide' }, origin);
  }

  if (payload.website && payload.website.length > 0) {
    return json(200, { ok: true }, origin); // bot trap
  }

  const email = payload.email?.trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json(400, { error: 'Email invalide' }, origin);
  }
  if (email.length > 200) return json(400, { error: 'Email trop long' }, origin);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );

  // Upsert (réactive si déjà existant + unsubscribed)
  const { error: dbError } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      {
        email,
        name: payload.name?.trim() ?? null,
        status: 'active',
        source: payload.source ?? 'website',
      },
      { onConflict: 'email' }
    );
  if (dbError) {
    console.error('DB upsert error:', dbError);
    return json(500, { error: 'DB error' }, origin);
  }

  // Email de bienvenue
  const html = `
    <div style="font-family:Georgia,serif;color:#0B1929;">
      <h2 style="font-weight:300;font-size:28px;margin:0 0 16px;">Bienvenue dans l'univers Cosmos.</h2>
      <p style="font-family:-apple-system,sans-serif;font-weight:300;line-height:1.6;color:#333;">
        Merci de rejoindre notre communauté. Vous recevrez en avant-première :
      </p>
      <ul style="font-family:-apple-system,sans-serif;font-weight:300;line-height:1.8;color:#333;">
        <li>Les nouvelles enseignes et ouvertures</li>
        <li>L'agenda événementiel premium</li>
        <li>Les offres exclusives membres</li>
        <li>Le magazine Cosmos chaque mois</li>
      </ul>
      <p style="margin-top:32px;">
        <a href="https://www.cosmos-angre.com/boutiques"
           style="display:inline-block;padding:12px 28px;background:#C9A961;color:#0B1929;text-decoration:none;font-family:-apple-system,sans-serif;font-weight:500;letter-spacing:0.05em;">
          Découvrir le centre
        </a>
      </p>
      <hr style="border-top:1px solid #C9A961;width:60px;margin:32px 0;"/>
      <p style="font-size:12px;color:#888;font-family:-apple-system,sans-serif;">
        Cosmos Angré — Boulevard Mitterrand, Cocody-Angré, Abidjan<br/>
        Vous recevez cet email car vous vous êtes inscrit à notre newsletter.
        <a href="https://www.cosmos-angre.com/desinscription?email=${encodeURIComponent(email)}" style="color:#888;">Se désinscrire</a>
      </p>
    </div>
  `;
  await sendEmail({
    to: email,
    subject: 'Bienvenue chez Cosmos Angré',
    html,
    tags: [
      { name: 'category', value: 'newsletter-welcome' },
      { name: 'source', value: escape(payload.source ?? 'website') },
    ],
  });

  return json(200, { ok: true }, origin);
});
