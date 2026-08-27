import { Supplier } from './supplier';
import { CommercialOffer } from './offer';

export type TenderStatus =
  | 'NEW' | 'DOCUMENTS_LOADING' | 'DOCUMENTS_LOADED' | 'PROCESSING'
  | 'SEMANTIC_FILTERING' | 'RELEVANT' | 'UNCERTAIN' | 'NOT_RELEVANT'
  | 'SCORING' | 'SCORED' | 'AWAITING_SUPPLIER_SEARCH'
  | 'SUPPLIER_SEARCH_IN_PROGRESS' | 'SUPPLIERS_FOUND' | 'NO_SUPPLIERS_FOUND'
  | 'AWAITING_CP' | 'CP_REQUESTED' | 'CP_PARTIALLY_RECEIVED' | 'CP_FULLY_RECEIVED'
  | 'NEGOTIATING' | 'READY_FOR_DECISION' | 'APPROVED' | 'REJECTED' | 'ERROR';

export interface TenderFilters {
  status?: TenderStatus | string;
  category_id?: string;
  source_id?: string;
  nmck_min?: number;
  nmck_max?: number;
  deadline_after?: string;
  deadline_before?: string;
  search?: string;
  has_score?: boolean;
  score_min?: number;
  score_max?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface TenderPosition {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  category_id: string;
  category_name: string;
  matched_suppliers: any[];
}

export interface TenderDocument {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  uploaded_at: string;
}

export interface TenderTimelineItem {
  id: string;
  status: TenderStatus;
  timestamp: string;
  details: string;
}

export interface Tender {
  id: string;
  source_id: string;
  source_tender_id: string;
  title: string;
  description: string;
  nmck: number | null;
  currency: string;
  published_at: string | null;
  deadline_at: string | null;
  customer_name: string;
  customer_inn: string;
  customer_kpp: string;
  platform: string;
  source_url: string;
  status: TenderStatus;
  score: number | null;
  matched_category_id: string | null;
  matched_category_name: string;
  suppliers_count: number;
  created_at: string;
  updated_at: string;
  documents: TenderDocument[];
  positions: TenderPosition[];
  timeline: TenderTimelineItem[];
  offers?: CommercialOffer[];
  suppliers?: Supplier[];
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH';
  risk_details?: any;
}

export interface TenderStats {
  total: number;
  in_progress_count: number;
  ready_for_decision_count: number;
  avg_margin_percent: number;
  approval_rate_percent: number;
  total_approved_volume_rub: number;
  trend_total: number;
  trend_in_progress: number;
  trend_ready: number;
  trend_margin: number;
  trend_conversion: number;
  trend_volume: number;
  by_status: Record<string, number>;
  over_time: Array<{ date: string; count: number }>;
  by_category: Array<{ category: string; count: number }>;
  score_distribution: Array<{ score: number; count: number }>;
  stage_time: Array<{ stage: string; minutes: number }>;
  funnel_data: Array<{ stage: string; count: number }>;
  supplier_performance: Array<{ supplier: string; margin: number; response_days: number }>;
  top_suppliers: Array<{ supplier: string; deals: number }>;
  monthly_volume: Array<{ month: string; volume: number }>;
  margin_by_category: Array<{ category: string; margin: number }>;
}