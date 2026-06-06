/**
 * Client Resend minimal (Deno fetch).
 * Doc: https://resend.com/docs/api-reference/emails/send-email
 */
const RESEND_API_URL = 'https://api.resend.com/emails';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY missing' };

  const from = opts.from ?? Deno.env.get('RESEND_FROM') ?? 'Cosmos Angré <noreply@cosmos-angre.com>';
  const replyTo = opts.replyTo ?? Deno.env.get('RESEND_REPLY_TO');

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      reply_to: replyTo,
      tags: opts.tags,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: `Resend ${res.status}: ${body.slice(0, 200)}` };
  }
  const data = (await res.json()) as { id?: string };
  return { ok: true, id: data.id };
}
