import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TenderActions } from './tender-actions';
import { useTender } from '@/lib/hooks/use-tenders';

vi.mock('@/lib/hooks/use-tenders', () => ({
  useTender: vi.fn(),
  useReprocessTender: () => ({ mutate: vi.fn(), isPending: false }),
  useSearchSuppliersForTender: () => ({ mutate: vi.fn(), isPending: false }),
  useRequestCp: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('@/lib/hooks/use-negotiations', () => ({
  useStartNegotiation: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('@/lib/hooks/use-websocket', () => ({
  useWebSocket: () => ({ subscribe: vi.fn() }),
}));

describe('TenderActions', () => {
  beforeEach(() => {
    (useTender as any).mockReturnValue({ data: { suppliers: [{ id: 's1', name: 'Supplier 1' }] } });
  });

  it('renders action buttons', () => {
    render(<TenderActions tenderId="t1" />);
    expect(screen.getByText('Перезапустить')).toBeInTheDocument();
    expect(screen.getByText('Поиск поставщиков')).toBeInTheDocument();
    expect(screen.getByText('Запросить КП')).toBeInTheDocument();
    expect(screen.getByText('Начать переговоры')).toBeInTheDocument();
  });
});