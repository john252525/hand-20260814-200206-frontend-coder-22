import { useQuery } from '@tanstack/react-query';
import { fetchOffers, fetchOffer } from '@/lib/api/offers';

export function useOffers(params: { tender_id?: string; supplier_id?: string; status?: string; page?: number; per_page?: number } = {}) {
  return useQuery({
    queryKey: ['offers', params],
    queryFn: () => fetchOffers(params),
  });
}

export function useOffer(offerId: string) {
  return useQuery({
    queryKey: ['offer', offerId],
    queryFn: () => fetchOffer(offerId),
    enabled: !!offerId,
    select: (data) => data.data,
  });
}