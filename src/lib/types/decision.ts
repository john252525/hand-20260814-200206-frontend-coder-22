export type Recommendation = 'APPROVE' | 'REJECT' | 'REVIEW';

export interface Decision {
  tender_id: string;
  tender_title: string;
  nmck: number;
  deadline_at: string | null;
  best_supplier_id: string | null;
  best_supplier_name: string | null;
  best_supplier_margin_percent: number | null;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | null;
  risk_factors: Array<{
    type: string;
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
  }>;
  auto_recommendation: Recommendation;
  approver_id: string | null;
  decided_at: string | null;
  comment: string | null;
}

export interface ApprovePayload {
  chosen_supplier_id: string;
  chosen_offer_id: string;
  comment?: string;
}

export interface RejectPayload {
  reason: string;
  comment?: string;
}

export interface RequestInfoPayload {
  instructions: string;
}