/**
 * Edge Function: /functions/v1/contact-submit
 * Reçoit le formulaire contact public, persiste en base, envoie un email
 * de notification à l'équipe + un accusé de réception au visiteur.
 *
 * Sécurité:
 *  - Rate limit 5 req / 10 min par IP
 *  - Honeypot field "website" (bot trap)
 *  - Validation Zod-like des champs
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders, handlePreflight } from '../_shared/cors.ts';
import { rateLimit, clientIp } from '../_shared/rateLimit.ts';
import { sendEmail } from '../_shared/resend.ts';

interface ContactPayload {
  full_name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  website?: string; // honeypot
}

const json = (status: number, body: unknown, origin: string | null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });

function validate(p: ContactPayload): { valid: true; data: Required<Omit<ContactPayload, 'website' | 'phone' | 'subject'>> & Pick<ContactPayload, 'phone' | 'subject'> } | { valid: false; reason: string } {
  if (!p.full_name || p.full_name.trim().length < 2) return { valid: false, reason: 'Nom requis' };
  if (!p.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) return { valid: false, reason: 'Email invalide' };
  if (!p.message || p.message.trim().length < 10) return { valid: false, reason: 'Message trop court (min 10 caractères)' };
  if (p.full_name.length > 100 || p.message.length > 5000) return { valid: false, reason: 'Champs trop longs' };
  return {
    valid: true,
    data: {
      full_name: p.full_name.trim(),
      email: p.email.trim().toLowerCase(),
      message: p.message.trim(),
      phone: p.phone?.trim(),
      subject: p.subject?.trim(),
    },
  };
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  const origin = req.headers.get('Origin');
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' }, origin);

  // Rate limit
  const ip = clientIp(req);
  const limit = rateLimit({ key: `contact:${ip}`, max: 5, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return new Response(JSON.stringify({ error: 'Too many requests', retryAfter: limit.retryAfter }), {
      status: 429,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json', 'Retry-After': String(limit.retryAfter) },
    });
  }

  let payload: ContactPayload;
  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return json(400, { error: 'Body JSON invalide' }, origin);
  }

  // Honeypot
  if (payload.website && payload.website.length > 0) {
    return json(200, { ok: true }, origin); // silent succès pour les bots
  }

  const v = validate(payload);
  if (!v.valid) return json(400, { error: v.reason }, origin);
  const data = v.data;

  // Persist en DB
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );
  const { error: dbError } = await supabase.from('contacts').insert({
    full_name: data.full_name,
    email: data.email,
    phone: data.phone ?? null,
    subject: data.subject ?? null,
    message: data.message,
  });
  if (dbError) {
    console.error('DB insert error:', dbError);
    return json(500, { error: 'DB error' }, origin);
  }

  // Email de notification interne
  const adminEmail = Deno.env.get('CONTACT_NOTIFICATION_EMAIL') ?? 'contact@cosmos-angre.com';
  const subjectAdmin = data.subject ? `[Contact] ${data.subject}` : `[Contact] Nouveau message — ${data.full_name}`;
  const htmlAdmin = `
    <h2>Nouveau message via le formulaire contact</h2>
    <p><strong>Nom :</strong> ${escape(data.full_name)}</p>
    <p><strong>Email :</strong> <a href="mailto:${escape(data.email)}">${escape(data.email)}</a></p>
    ${data.phone ? `<p><strong>Téléphone :</strong> ${escape(data.phone)}</p>` : ''}
    ${data.subject ? `<p><strong>Sujet :</strong> ${escape(data.subject)}</p>` : ''}
    <p><strong>Message :</strong></p>
    <blockquote style="border-left:3px solid #C9A961;padding-left:12px;color:#444;">${escape(data.message).replace(/\n/g, '<br/>')}</blockquote>
    <hr/>
    <p style="font-size:12px;color:#888;">IP: ${escape(ip)} — ${new Date().toISOString()}</p>
  `;
  const adminResult = await sendEmail({
    to: adminEmail,
    subject: subjectAdmin,
    html: htmlAdmin,
    replyTo: data.email,
    tags: [{ name: 'category', value: 'contact-notif' }],
  });
  if (!adminResult.ok) console.error('Resend admin failed:', adminResult.error);

  // Accusé de réception au visiteur
  const htmlAck = `
    <h2 style="font-family:Georgia,serif;color:#0B1929;">Bonjour ${escape(data.full_name.split(' ')[0] ?? data.full_name)},</h2>
    <p>Merci pour votre message. Notre équipe Cosmos Angré le traite et reviendra vers vous dans les meilleurs délais.</p>
    <p>Pour toute urgence, vous pouvez nous joindre au <strong>+225 27 22 00 00 00</strong>.</p>
    <p style="margin-top:24px;color:#888;">— L'équipe Cosmos Angré</p>
    <hr style="border-top:1px solid #C9A961;width:50px;margin:24px 0;"/>
    <p style="font-size:12px;color:#888;">Cosmos Angré — Boulevard Mitterrand, Cocody-Angré, Abidjan</p>
  `;
  await sendEmail({
    to: data.email,
    subject: 'Votre message a bien été reçu — Cosmos Angré',
    html: htmlAck,
    tags: [{ name: 'category', value: 'contact-ack' }],
  });

  return json(200, { ok: true }, origin);
});
