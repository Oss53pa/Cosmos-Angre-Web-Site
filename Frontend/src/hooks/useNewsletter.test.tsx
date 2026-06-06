import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useNewsletter } from './useNewsletter';

const fromMock = vi.fn();

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

interface Builder {
  select: () => Builder;
  order: () => Promise<{ data: unknown[]; error: null | { message: string } }>;
  upsert: ReturnType<typeof vi.fn>;
  update: () => Builder;
  delete: () => Builder;
  eq: () => Promise<{ error: null | { message: string } }>;
}

function build(data: unknown[] = [], error: { message: string } | null = null) {
  const upsertSpy = vi.fn().mockResolvedValue({ error });
  const builder: Builder = {
    select: () => builder,
    order: () => Promise.resolve({ data, error }),
    upsert: upsertSpy,
    update: () => builder,
    delete: () => builder,
    eq: () => Promise.resolve({ error }),
  };
  return { builder, upsertSpy };
}

describe('useNewsletter', () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it('charge les subscribers', async () => {
    const subs = [{ id: '1', email: 'a@b.com', status: 'active' }];
    const { builder } = build(subs);
    fromMock.mockReturnValue(builder);

    const { result } = renderHook(() => useNewsletter());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.subscribers).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('subscribe ajoute via upsert', async () => {
    const { builder, upsertSpy } = build([]);
    fromMock.mockReturnValue(builder);

    const { result } = renderHook(() => useNewsletter());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.subscribe('new@test.com', 'New User');
    });

    expect(upsertSpy).toHaveBeenCalledWith(
      { email: 'new@test.com', name: 'New User', status: 'active' },
      { onConflict: 'email' }
    );
  });

  it('handle erreur correctement', async () => {
    // useNewsletter does `throw fetchError` then catches; non-Error throws → "An error occurred"
    const err = new Error('fetch failed');
    const builder: Record<string, unknown> = {
      select: function () {
        return this;
      },
      order: () => Promise.resolve({ data: null, error: err }),
    };
    fromMock.mockReturnValue(builder);

    const { result } = renderHook(() => useNewsletter());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('fetch failed');
  });
});
