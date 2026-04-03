'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

function buildLocaleHref(locale, pathname, searchParams) {
  const currentPath = pathname || '/';
  const queryString = searchParams?.toString();
  const next = `${currentPath}${queryString ? `?${queryString}` : ''}`;

  return `/api/locale?lang=${locale}&next=${encodeURIComponent(next)}`;
}

function LanguageSwitcher({ locale, copy, className, onNavigate, showLabel = true }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showLabel ? <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">{copy.label}</span> : null}
      <div className="inline-flex rounded-full border border-brand-gray-modern/30 bg-white p-1">
        {[
          { value: 'fr', label: copy.fr },
          { value: 'en', label: copy.en },
        ].map((item) => (
          <a
            key={item.value}
            href={buildLocaleHref(item.value, pathname, searchParams)}
            onClick={onNavigate}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
              locale === item.value ? 'bg-brand-red text-white' : 'text-brand-gray-dark hover:text-brand-black'
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export { LanguageSwitcher };