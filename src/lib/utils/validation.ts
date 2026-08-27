import { z } from 'zod';

export const tenderCreateSchema = z.object({
  source_id: z.string().uuid('Некорректный ID источника'),
  source_tender_id: z.string().min(1, 'Обязательно'),
  title: z.string().min(1, 'Название обязательно').max(1000),
  description: z.string().optional(),
  nmck: z.number().min(0).nullable().optional(),
  currency: z.string().default('RUB'),
  published_at: z.string().datetime().nullable().optional(),
  deadline_at: z.string().datetime().nullable().optional(),
  customer_name: z.string().optional(),
  customer_inn: z.string().regex(/^\d{10,12}$/, 'ИНН должен содержать 10-12 цифр').optional(),
  customer_kpp: z.string().regex(/^\d{9}$/, 'КПП должен содержать 9 цифр').optional(),
  platform: z.string().optional(),
  source_url: z.string().url().optional(),
});

export const supplierCreateSchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(500),
  type: z.enum(['manufacturer', 'distributor', 'wholesaler', 'retail', 'unknown']).optional(),
  website: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  telegram: z.string().optional(),
  whatsapp: z.string().optional(),
  contact_persons: z.array(z.object({
    name: z.string(),
    position: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })).optional(),
  inn: z.string().regex(/^\d{10,12}$/, 'ИНН должен содержать 10-12 цифр').optional().or(z.literal('')),
  kpp: z.string().regex(/^\d{9}$/, 'КПП должен содержать 9 цифр').optional().or(z.literal('')),
  ogrn: z.string().regex(/^\d{13}$/, 'ОГРН должен содержать 13 цифр').optional().or(z.literal('')),
  legal_address: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const communicationSendSchema = z.object({
  lot_supplier_id: z.string().uuid(),
  direction: z.enum(['outgoing', 'incoming']).default('outgoing'),
  channel: z.enum(['email', 'telegram', 'whatsapp', 'web_form']).default('email'),
  subject: z.string().default(''),
  body_text: z.string().default(''),
  message_type: z.string().default('manual'),
});

export const negotiatePayloadSchema = z.object({
  action: z.enum(['request_clarification', 'request_discount', 'request_both']).default('request_clarification'),
  target_supplier_ids: z.array(z.string().uuid()).default([]),
  custom_instructions: z.string().nullable().optional(),
});

export const approvePayloadSchema = z.object({
  chosen_supplier_id: z.string().uuid(),
  chosen_offer_id: z.string().uuid(),
  comment: z.string().default(''),
});

export const rejectPayloadSchema = z.object({
  reason: z.string().default(''),
  comment: z.string().nullable().optional(),
});

export const requestInfoPayloadSchema = z.object({
  instructions: z.string().min(1),
});

export const categoryCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  parent_id: z.string().uuid().nullable().optional(),
});

export const webhookCreateSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1, 'Выберите события'),
  secret: z.string().default(''),
  is_active: z.boolean().default(true),
});