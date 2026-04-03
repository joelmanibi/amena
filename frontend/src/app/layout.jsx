import './globals.css';
import { Inter } from 'next/font/google';
import { RootShell } from '@/components/layout/root-shell';
import { getLocale } from '@/lib/locale';
import { getCompanyContent } from '@/lib/company';
import { getOpenGraphLocale } from '@/lib/i18n';
import { getSiteCopy } from '@/lib/site-copy';

const inter = Inter({ subsets: ['latin'] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata() {
  const locale = await getLocale();
  const company = await getCompanyContent(locale);
  const copy = await getSiteCopy(locale);
  const companyUrl = company.websiteUrl || siteUrl;

  return {
    metadataBase: new URL(companyUrl),
    title: {
      default: `${company.name} | ${locale === 'fr' ? 'Conseil financier et formation executive' : 'Financial Consulting & Executive Training'}`,
      template: `%s | ${company.name}`,
    },
    description: company.description,
    applicationName: company.name,
    keywords: ['financial consulting', 'corporate finance', 'training', 'strategy advisory', 'AMENA CONSULTING'],
    alternates: { canonical: '/' },
    openGraph: {
      title: company.name,
      description: company.description,
      url: companyUrl,
      siteName: company.name,
      locale: getOpenGraphLocale(locale),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: company.name,
      description: copy.companyDescription,
    },
  };
}

async function RootLayout({ children }) {
  const locale = await getLocale();
  const company = await getCompanyContent(locale);
  const copy = await getSiteCopy(locale);
  const navigation = copy.navigation;
  const companyUrl = company.websiteUrl || siteUrl;
  const sameAs = [company.facebookUrl, company.linkedinUrl, company.instagramUrl].filter(Boolean);
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: companyUrl,
    email: company.email || undefined,
    telephone: company.phone || undefined,
    address: company.address || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <RootShell locale={locale} copy={copy} navigation={navigation} company={company}>
          {children}
        </RootShell>
      </body>
    </html>
  );
}

export default RootLayout;
