import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTestimonials } from './useTestimonials';

const fromMock = vi.fn();

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

function buildBuilder(data: unknown[] = [], error: { message: string } | null = null) {
  const eqSpy = vi.fn();
  // builder itself is thenable so `await query` resolves to {data,error},
  // and every chain method returns builder so .eq().eq().limit() still works.
  const builder: Record<string, unknown> = {
    then: (resolve: (v: { data: unknown[]; error: null | { message: string } }) => void) =>
      Promise.resolve({ data, error }).then(resolve),
  };
  builder.select = () => builder;
  builder.eq = eqSpy;
  builder.order = () => builder;
  builder.limit = () => builder;
  eqSpy.mockReturnValue(builder);
  return { builder, eqSpy };
}

describe('useTestimonials', () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it('charge les testimonials publiés', async () => {
    const list = [{ id: '1', author_name: 'Alice', content: 'Top', rating: 5 }];
    const { builder } = buildBuilder(list);
    fromMock.mockReturnValue(builder);

    const { result } = renderHook(() => useTestimonials());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.testimonials).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('expose une error si fetch échoue', async () => {
    const { builder } = buildBuilder([], { message: 'oops' });
    fromMock.mockReturnValue(builder);

    const { result } = renderHook(() => useTestimonials());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('oops');
    expect(result.current.testimonials).toEqual([]);
  });

  it('applique filter featuredOnly + locale', async () => {
    const { builder, eqSpy } = buildBuilder([]);
    fromMock.mockReturnValue(builder);

    renderHook(() => useTestimonials({ featuredOnly: true, locale: 'en' }));
    await waitFor(() => {
      expect(eqSpy).toHaveBeenCalledWith('is_published', true);
      expect(eqSpy).toHaveBeenCalledWith('is_featured', true);
      expect(eqSpy).toHaveBeenCalledWith('locale', 'en');
    });
  });
});
