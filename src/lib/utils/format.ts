import { format, formatDistanceToNow, isAfter, isBefore, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatDate(date: string | null | undefined): string {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return format(d, 'dd.MM.yyyy', { locale: ru });
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return format(d, 'dd.MM.yyyy HH:mm', { locale: ru });
}

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const num = Number(value);
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('ru-RU').format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return `${Number(value).toFixed(1)}%`;
}

export function formatDuration(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч ${minutes % 60} мин`;
  const days = Math.floor(hours / 24);
  return `${days} д ${hours % 24} ч`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDistanceFromNow(date: string): string {
  const d = new Date(date);
  return formatDistanceToNow(d, { addSuffix: true, locale: ru });
}

export function isDateInPast(date: string): boolean {
  return isBefore(new Date(date), new Date());
}

export function isDateInFuture(date: string): boolean {
  return isAfter(new Date(date), new Date());
}

export function getDaysRemaining(date: string): number {
  return differenceInDays(new Date(date), new Date());
}

export function getHoursRemaining(date: string): number {
  return differenceInHours(new Date(date), new Date());
}

export function getMinutesRemaining(date: string): number {
  return differenceInMinutes(new Date(date), new Date());
}

export function formatDimensions(width: number, height: number): string {
  return `${width}×${height}`;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  return phone;
}