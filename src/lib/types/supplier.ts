export type SupplierType = 'manufacturer' | 'distributor' | 'wholesaler' | 'retail' | 'unknown';

export interface SupplierContactPerson {
  name: string;
  position: string;
  email: string;
  phone: string;
}

export interface SupplierRating {
  reliability: number;
  responsiveness: number;
  quality: number;
  overall: number;
}

export interface Supplier {
  id: string;
  name: string;
  type: SupplierType;
  website: string;
  email: string;
  phone: string;
  telegram: string;
  whatsapp: string;
  inn: string;
  kpp: string;
  ogrn: string;
  legal_address: string;
  tags: string[];
  notes: string;
  is_active: boolean;
  successful_deals: number;
  total_volume_rub: number;
  rating: SupplierRating | null;
  contact_persons: SupplierContactPerson[];
  created_at: string;
  updated_at: string;
}

export interface SupplierCreatePayload {
  name: string;
  type?: SupplierType;
  website?: string;
  email?: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
  inn?: string;
  kpp?: string;
  ogrn?: string;
  legal_address?: string;
  tags?: string[];
  notes?: string;
}

export interface SupplierUpdatePayload {
  name?: string;
  type?: SupplierType;
  website?: string;
  email?: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
  inn?: string;
  kpp?: string;
  ogrn?: string;
  legal_address?: string;
  tags?: string[];
  notes?: string;
  is_active?: boolean;
}