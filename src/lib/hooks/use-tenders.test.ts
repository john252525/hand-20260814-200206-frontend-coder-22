import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTenders } from './use-tenders';

vi.mock('@/lib/api/client', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: { data: [{ id: '1', title: 'Tender' }], meta: { page: 1, per_page: 20, total: 1, pages: 1 } },
    }),
  },
}));

describe('useTenders', () => {
  it('returns tenders data', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useTenders(), { wrapper });

    await waitFor(() => expect(result.current.data?.data).toHaveLength(1));
  });
});