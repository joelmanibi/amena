import Link from 'next/link';
import { Facebook, Globe, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { LanguageSwitcher } from '@/components/layout/language-switcher';

function getPhoneEntries(phone) {
  if (!phone) return [];

  return phone
    .split('/')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => ({
      label: entry,
      href: entry.replace(/\s+/g, ''),
    }));
}

function SiteFooter({ locale, copy, navigation, company, languageCopy }) {
  const phoneEntries = getPhoneEntries(company.phone);
  const socialLinks = [
    { label: 'LinkedIn', href: company.linkedinUrl, icon: Linkedin },
    { label: 'Facebook', href: company.facebookUrl, icon: Facebook },
    { label: 'Instagram', href: company.instagramUrl, icon: Instagram },
  ].filter((item) => item.href);

  return (
    <footer className="bg-[#66666B] text-white">
      <div className="container-shell py-12 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.55fr_0.85fr_1fr_0.9fr]">
          <div className="flex items-start">
            <BrandLogo variant="light" alt={company.name} imageClassName="h-12 max-w-[220px]" />
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">{copy.quickLinks}</h4>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/75 transition-colors hover:text-brand-red-light">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">{copy.contactInformation}</h4>
            <ul className="mt-5 space-y-4 text-sm text-white/75">
              {company.address ? (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-red-light" />
                  <span>{company.address}</span>
                </li>
              ) : null}
              {company.email ? (
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-brand-red-light" />
                  <a href={`mailto:${company.email}`} className="transition-colors hover:text-brand-red-light">
                    {company.email}
                  </a>
                </li>
              ) : null}
              {phoneEntries.map((phone) => (
                <li key={phone.label} className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-brand-red-light" />
                  <a href={`tel:${phone.href}`} className="transition-colors hover:text-brand-red-light">
                    {phone.label}
                  </a>
                </li>
              ))}
              {company.websiteUrl ? (
                <li className="flex items-center gap-3">
                  <Globe className="h-4 w-4 shrink-0 text-brand-red-light" />
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-brand-red-light"
                  >
                    {company.websiteUrl}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">{copy.socialMedia}</h4>
            <div className="mt-5 space-y-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition-colors hover:text-brand-red-light"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
            <p className="mt-4 text-xs leading-6 text-white/45">{copy.socialNote}</p>
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">Langue</p>
              <LanguageSwitcher locale={locale} copy={languageCopy} className="justify-between" showLabel={false} />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5">
          <div className="flex flex-col gap-3 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {company.name}. {copy.rights}</p>
            <p>{copy.support}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { SiteFooter };
