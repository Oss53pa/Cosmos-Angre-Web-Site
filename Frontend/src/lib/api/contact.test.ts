import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitContact, subscribeNewsletter } from './contact';

const invokeMock = vi.fn();

vi.mock('../supabase', () => ({
  supabase: {
    functions: {
      invoke: (...args: unknown[]) => invokeMock(...args),
    },
  },
}));

describe('contact api', () => {
  beforeEach(() => {
    invokeMock.mockReset();
  });

  it("submitContact appelle supabase.functions.invoke('contact-submit')", async () => {
    invokeMock.mockResolvedValue({ data: { ok: true }, error: null });
    await submitContact({ full_name: 'A', email: 'a@b.c', message: 'hi' });
    expect(invokeMock).toHaveBeenCalledWith('contact-submit', {
      body: { full_name: 'A', email: 'a@b.c', message: 'hi' },
    });
  });

  it("subscribeNewsletter appelle supabase.functions.invoke('newsletter-subscribe')", async () => {
    invokeMock.mockResolvedValue({ data: { ok: true }, error: null });
    await subscribeNewsletter({ email: 'x@y.z' });
    expect(invokeMock).toHaveBeenCalledWith('newsletter-subscribe', {
      body: { email: 'x@y.z' },
    });
  });

  it('retourne { ok: false } si error', async () => {
    invokeMock.mockResolvedValue({ data: null, error: { message: 'boom' } });
    const res = await submitContact({ full_name: 'A', email: 'a@b.c', message: 'hi' });
    expect(res.ok).toBe(false);
    expect(res.error).toBe('boom');
  });

  it('retourne { ok: true } si réponse data ok', async () => {
    invokeMock.mockResolvedValue({ data: { ok: true }, error: null });
    const res = await subscribeNewsletter({ email: 'a@b.c' });
    expect(res.ok).toBe(true);
  });
});
