import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStores } from './useStores';

const fromMock = vi.fn();

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

interface MockBuilder {
  select: () => MockBuilder;
  eq: () => MockBuilder;
  ilike: () => MockBuilder;
  order: () => Promise<{ data: unknown[]; error: null | { message: string } }>;
  insert: () => Promise<{ error: null | { message: string } }>;
  update: () => MockBuilder;
  delete: () => MockBuilder;
}

function buildMock(data: unknown[] = [], error: { message: string } | null = null): MockBuilder {
  const builder: Partial<MockBuilder> = {};
  builder.select = () => builder as MockBuilder;
  builder.eq = () => builder as MockBuilder;
  builder.ilike = () => builder as MockBuilder;
  builder.order = () => Promise.resolve({ data, error });
  builder.insert = () => Promise.resolve({ error });
  builder.update = () => builder as MockBuilder;
  builder.delete = () => builder as MockBuilder;
  return builder as MockBuilder;
}

describe('useStores', () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it('charge la liste des stores au montage', async () => {
    const stores = [
      { id: '1', name: 'Nike', status: 'active' },
      { id: '2', name: 'Adidas', status: 'active' },
    ];
    fromMock.mockReturnValue(buildMock(stores));

    const { result } = renderHook(() => useStores());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.stores).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('expose une error si la requête échoue', async () => {
    fromMock.mockReturnValue(buildMock([], { message: 'DB down' }));
    const { result } = renderHook(() => useStores());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('DB down');
  });

  it('applique le filtre status', async () => {
    const eq = vi.fn(() => ({
      eq: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      order: () => Promise.resolve({ data: [], error: null }),
    }));
    fromMock.mockReturnValue({
      select: () => ({
        eq,
        ilike: vi.fn(),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
    });

    renderHook(() => useStores({ status: 'active' }));
    await waitFor(() => {
      expect(eq).toHaveBeenCalledWith('status', 'active');
    });
  });
});
