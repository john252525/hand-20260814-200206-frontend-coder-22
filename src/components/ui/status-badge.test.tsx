import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './status-badge';

describe('StatusBadge', () => {
  it('renders correct label for NEW status', () => {
    render(<StatusBadge status="NEW" />);
    expect(screen.getByText('Новый')).toBeInTheDocument();
  });

  it('renders correct label for APPROVED status', () => {
    render(<StatusBadge status="APPROVED" />);
    expect(screen.getByText('Одобрен')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<StatusBadge status="RELEVANT" size="lg" />);
    expect(screen.getByText('Релевантный')).toHaveClass('text-base');
  });
});