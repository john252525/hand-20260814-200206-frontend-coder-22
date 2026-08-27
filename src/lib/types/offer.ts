export interface CommercialOfferPosition {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total: number;
  tender_position_id: string;
  matched: boolean;
}

export interface CommercialOffer {
  id: string;
  tender_id: string;
  supplier_id: string;
  supplier_name: string;
  status: 'PROCESSING' | 'FULL' | 'PARTIAL' | 'NONE' | 'ERROR';
  coverage: number;
  total_cost: number;
  delivery_cost: number;
  total_cost_with_delivery: number;
  total_cost_with_all: number;
  margin_absolute: number;
  margin_percent: number | null;
  clarification_needed: boolean;
  received_at: string;
  raw_text_snippet: string;
  delivery_terms?: {
    delivery_days: number | null;
    delivery_address: string;
    delivery_conditions: string;
  };
  payment_terms?: {
    prepayment_percent: number | null;
    deferred_payment_days: number | null;
    description: string;
  };
  positions: CommercialOfferPosition[];
}