import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Skeleton, { StoreCardSkeleton, BlogCardSkeleton, TableRowSkeleton } from './Skeleton';

describe('Skeleton components', () => {
  it('Skeleton renders avec role="status"', () => {
    render(<Skeleton />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('StoreCardSkeleton renders count items', () => {
    const { container } = render(<StoreCardSkeleton count={4} />);
    // Each card has 4 skeletons (1 image + 3 text)
    const cards = container.querySelectorAll('.bg-cosmos-cream\\/5');
    expect(cards).toHaveLength(4);
  });

  it('BlogCardSkeleton renders count items', () => {
    const { container } = render(<BlogCardSkeleton count={2} />);
    const articles = container.querySelectorAll('article');
    expect(articles).toHaveLength(2);
  });

  it('TableRowSkeleton renders count items', () => {
    const { container } = render(<TableRowSkeleton count={3} />);
    const rows = container.querySelectorAll('.flex.gap-4');
    expect(rows).toHaveLength(3);
  });
});
