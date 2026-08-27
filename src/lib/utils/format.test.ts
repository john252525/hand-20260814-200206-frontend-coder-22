import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatNumber, formatPercent } from './format';

describe('format utilities', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1500000)).toBe('1 500 000 ₽');
    expect(formatCurrency(null)).toBe('—');
  });

  it('formats date correctly', () => {
    expect(formatDate('2026-08-16T12:00:00Z')).toBe('16.08.2026');
  });

  it('formats percent correctly', () => {
    expect(formatPercent(25.5)).toBe('25.5%');
  });

  it('formats number correctly', () => {
    expect(formatNumber(12345)).toBe('12 345');
  });
});