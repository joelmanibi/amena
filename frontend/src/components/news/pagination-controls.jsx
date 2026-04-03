import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

function buildPageHref({ page, query, category }) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set('page', String(page));
  }

  if (query) {
    params.set('q', query);
  }

  if (category) {
    params.set('category', category);
  }

  const queryString = params.toString();
  return queryString ? `/news?${queryString}` : '/news';
}

function PaginationControls({ page, totalPages, query, category, copy }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label={copy.paginationLabel}>
      <Link
        href={buildPageHref({ page: Math.max(page - 1, 1), query, category })}
        aria-disabled={page <= 1}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl border border-brand-gray-modern bg-white px-4 py-2 text-sm font-medium text-brand-black transition-colors',
          page <= 1 ? 'pointer-events-none opacity-50' : 'hover:border-brand-red hover:text-brand-red'
        )}
      >
        <ChevronLeft className="h-4 w-4" /> {copy.previous}
      </Link>

      {pages.map((item) => (
        <Link
          key={item}
          href={buildPageHref({ page: item, query, category })}
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-gray-modern bg-white text-sm font-medium text-brand-black transition-colors',
            item === page ? 'border-brand-red bg-brand-red text-white' : 'hover:border-brand-red hover:text-brand-red'
          )}
          aria-current={item === page ? 'page' : undefined}
        >
          {item}
        </Link>
      ))}

      <Link
        href={buildPageHref({ page: Math.min(page + 1, totalPages), query, category })}
        aria-disabled={page >= totalPages}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl border border-brand-gray-modern bg-white px-4 py-2 text-sm font-medium text-brand-black transition-colors',
          page >= totalPages ? 'pointer-events-none opacity-50' : 'hover:border-brand-red hover:text-brand-red'
        )}
      >
        {copy.next} <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}

export { PaginationControls };