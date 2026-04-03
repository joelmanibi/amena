import Link from 'next/link';
import { cn } from '@/lib/utils';

function buildCategoryHref({ query, categorySlug }) {
  const params = new URLSearchParams();

  if (query) {
    params.set('q', query);
  }

  if (categorySlug) {
    params.set('category', categorySlug);
  }

  const queryString = params.toString();
  return queryString ? `/news?${queryString}` : '/news';
}

function NewsCategoryFilter({ categories, selectedCategory, query, copy }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={buildCategoryHref({ query })}
        className={cn(
          'rounded-full border border-brand-gray-modern bg-white px-4 py-2 text-sm font-medium text-brand-black transition-colors hover:border-brand-red hover:text-brand-red',
          !selectedCategory && 'border-brand-red bg-brand-red text-white hover:text-white'
        )}
      >
        {copy.allCategories}
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={buildCategoryHref({ query, categorySlug: category.slug })}
          className={cn(
            'whitespace-nowrap rounded-full border border-brand-gray-modern bg-white px-4 py-2 text-sm font-medium text-brand-black transition-colors hover:border-brand-red hover:text-brand-red',
            selectedCategory === category.slug && 'border-brand-red bg-brand-red text-white hover:text-white'
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}

export { NewsCategoryFilter };
