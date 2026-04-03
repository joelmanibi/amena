'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

function RootShell({ children, locale, copy, navigation, company }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return children;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader locale={locale} copy={copy.header} navigation={navigation} company={company} languageCopy={copy.language} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} copy={copy.footer} navigation={navigation} company={company} languageCopy={copy.language} />
    </div>
  );
}

export { RootShell };