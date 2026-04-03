'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { cn } from '@/lib/utils';

function SiteHeader({ locale, copy, navigation, company, languageCopy }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-brand-gray-modern/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="h-1 w-full bg-brand-red" />

      <div className="container-shell flex h-20 items-center justify-between gap-8">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)} aria-label={company.name}>
          <BrandLogo variant="red" alt={company.name} imageClassName="h-12 max-w-[240px] sm:h-14 sm:max-w-[280px]" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative text-sm font-medium text-brand-gray-dark hover:text-brand-black',
                isActive(item.href) && 'text-brand-black'
              )}
            >
              <span
                className={cn(
                  'absolute -bottom-2 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-brand-red transition-transform',
                  isActive(item.href) && 'scale-x-100'
                )}
              />
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher locale={locale} copy={languageCopy} />
          <Link href="/contact" className="btn-brand-primary px-4 py-2">
            {copy.consultationCta}
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex rounded-md border border-brand-gray-modern/30 p-2 text-brand-black md:hidden"
          aria-label={copy.mobileToggleLabel}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-brand-gray-modern/20 bg-white md:hidden">
          <div className="container-shell flex flex-col gap-4 py-5">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn('text-sm font-medium text-brand-gray-dark', isActive(item.href) && 'text-brand-red')}
              >
                {item.label}
              </Link>
            ))}
            <LanguageSwitcher locale={locale} copy={languageCopy} className="justify-between" onNavigate={() => setOpen(false)} />
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-brand-primary text-center"
            >
              {copy.consultationCta}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export { SiteHeader };
