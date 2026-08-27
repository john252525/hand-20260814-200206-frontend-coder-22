import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('ru-RU');
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('ru-RU');
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
  return `${value}%`;
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

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Произошла неизвестная ошибка';
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function truncate(str: string, length: number): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

export function isUUID(str: string): boolean {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return pattern.test(str);
}

export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '—';
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

export function isValidINN(inn: string): boolean {
  return /^\d{10}$|^\d{12}$/.test(inn);
}

export function isValidKPP(kpp: string): boolean {
  return /^\d{9}$/.test(kpp);
}

export function isValidOGRN(ogrn: string): boolean {
  return /^\d{13}$/.test(ogrn);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[^\d]/g, '');
  if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  return phone;
}

export function formatINN(inn: string): string {
  return inn.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1 $2 $3 $4');
}

export function formatKPP(kpp: string): string {
  return kpp.replace(/(\d{4})(\d{2})(\d{3})/, '$1 $2 $3');
}

export function formatOGRN(ogrn: string): string {
  return ogrn.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
}

export function formatBankAccount(account: string): string {
  return account.replace(/(\d{5})(\d{3})(\d{12})/, '$1 $2 $3');
}

export function formatBIK(bik: string): string {
  return bik.replace(/(\d{3})(\d{2})(\d{4})/, '$1 $2 $3');
}

export function formatCorrAccount(account: string): string {
  return account.replace(/(\d{5})(\d{3})(\d{12})/, '$1 $2 $3');
}

export function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function formatDurationHuman(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} сек`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч ${minutes % 60} мин`;
  const days = Math.floor(hours / 24);
  return `${days} д ${hours % 24} ч`;
}

export function formatMilliseconds(ms: number): string {
  return formatDurationHuman(ms / 1000);
}

export function formatDateISO(date: Date): string {
  return date.toISOString();
}

export function formatDateShort(date: string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

export function getDaysRemaining(date: string): number {
  const target = new Date(date);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDaysRemaining(date: string): string {
  const days = getDaysRemaining(date);
  if (days < 0) return 'Просрочено';
  if (days === 0) return 'Сегодня';
  if (days === 1) return '1 день';
  if (days > 1 && days < 5) return `${days} дня`;
  return `${days} дней`;
}

export function formatDateTimeISO(date: Date): string {
  return date.toISOString();
}

export function parseDate(date: string): Date | null {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
}

export function isValidDate(date: string): boolean {
  return parseDate(date) !== null;
}

export function getRelativeTime(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'вчера';
  if (days < 7) return `${days} дн назад`;
  return d.toLocaleDateString('ru-RU');
}

export function formatTime(date: string): string {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function formatTimeWithSeconds(date: string): string {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('ru-RU');
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Доброй ночи';
  if (hour < 12) return 'Доброе утро';
  if (hour < 18) return 'Добрый день';
  return 'Добрый вечер';
}

export function getInitialsFromEmail(email: string): string {
  if (!email) return '';
  return email.charAt(0).toUpperCase();
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function isStrongPassword(password: string): boolean {
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return password.length >= 8 && hasNumber && hasUpper && hasLower && hasSymbol;
}

export function isValidPhoneNumber(phone: string): boolean {
  return /^\+?[\d\s()-]{10,15}$/.test(phone);
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

export function compareDates(date1: string, date2: string): number {
  return new Date(date1).getTime() - new Date(date2).getTime();
}

export function isDateInPast(date: string): boolean {
  return new Date(date).getTime() < new Date().getTime();
}

export function isDateInFuture(date: string): boolean {
  return new Date(date).getTime() > new Date().getTime();
}

export function isDateToday(date: string): boolean {
  return new Date(date).toDateString() === new Date().toDateString();
}

export function isDateThisWeek(date: string): boolean {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  const d = new Date(date);
  return d >= startOfWeek && d <= endOfWeek;
}

export function isDateThisMonth(date: string): boolean {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const d = new Date(date);
  return d >= startOfMonth && d <= endOfMonth;
}

export function isDateThisYear(date: string): boolean {
  return new Date(date).getFullYear() === new Date().getFullYear();
}

export function formatNumberShort(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}М`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}К`;
  return value.toString();
}

export function formatCurrencyCompact(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)} млн ₽`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)} тыс ₽`;
  return `${value} ₽`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    NEW: 'info',
    DOCUMENTS_LOADING: 'warning',
    DOCUMENTS_LOADED: 'warning',
    PROCESSING: 'info',
    SEMANTIC_FILTERING: 'info',
    RELEVANT: 'success',
    UNCERTAIN: 'warning',
    NOT_RELEVANT: 'secondary',
    SCORING: 'info',
    SCORED: 'success',
    AWAITING_SUPPLIER_SEARCH: 'warning',
    SUPPLIER_SEARCH_IN_PROGRESS: 'info',
    SUPPLIERS_FOUND: 'success',
    NO_SUPPLIERS_FOUND: 'danger',
    AWAITING_CP: 'warning',
    CP_REQUESTED: 'info',
    CP_PARTIALLY_RECEIVED: 'warning',
    CP_FULLY_RECEIVED: 'success',
    NEGOTIATING: 'info',
    READY_FOR_DECISION: 'success',
    APPROVED: 'success',
    REJECTED: 'danger',
    ERROR: 'danger',
  };
  return map[status] || 'secondary';
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    NEW: 'Новый',
    DOCUMENTS_LOADING: 'Загрузка документов',
    DOCUMENTS_LOADED: 'Документы загружены',
    PROCESSING: 'Обработка',
    SEMANTIC_FILTERING: 'Семантический анализ',
    RELEVANT: 'Релевантный',
    UNCERTAIN: 'Неуверенный',
    NOT_RELEVANT: 'Не релевантный',
    SCORING: 'Скоринг',
    SCORED: 'Оценен',
    AWAITING_SUPPLIER_SEARCH: 'Ожидает поиска',
    SUPPLIER_SEARCH_IN_PROGRESS: 'Поиск поставщиков',
    SUPPLIERS_FOUND: 'Поставщики найдены',
    NO_SUPPLIERS_FOUND: 'Поставщики не найдены',
    AWAITING_CP: 'Ожидает КП',
    CP_REQUESTED: 'КП запрошено',
    CP_PARTIALLY_RECEIVED: 'КП частично получены',
    CP_FULLY_RECEIVED: 'КП полностью получены',
    NEGOTIATING: 'Переговоры',
    READY_FOR_DECISION: 'Готов к решению',
    APPROVED: 'Одобрен',
    REJECTED: 'Отклонен',
    ERROR: 'Ошибка',
  };
  return map[status] || status;
}

export function getStatusIcon(status: string): string {
  const map: Record<string, string> = {
    NEW: 'Sparkles',
    DOCUMENTS_LOADING: 'FileDown',
    DOCUMENTS_LOADED: 'FileCheck',
    PROCESSING: 'Cog',
    SEMANTIC_FILTERING: 'Brain',
    RELEVANT: 'CheckCircle',
    UNCERTAIN: 'HelpCircle',
    NOT_RELEVANT: 'XCircle',
    SCORING: 'Calculator',
    SCORED: 'Gauge',
    AWAITING_SUPPLIER_SEARCH: 'Search',
    SUPPLIER_SEARCH_IN_PROGRESS: 'Radar',
    SUPPLIERS_FOUND: 'Users',
    NO_SUPPLIERS_FOUND: 'UserX',
    AWAITING_CP: 'FileClock',
    CP_REQUESTED: 'Send',
    CP_PARTIALLY_RECEIVED: 'FilePartial',
    CP_FULLY_RECEIVED: 'FileFull',
    NEGOTIATING: 'Handshake',
    READY_FOR_DECISION: 'ClipboardCheck',
    APPROVED: 'ThumbsUp',
    REJECTED: 'ThumbsDown',
    ERROR: 'AlertTriangle',
  };
  return map[status] || 'Circle';
}
