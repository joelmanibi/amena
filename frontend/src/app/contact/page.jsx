import { Facebook, Globe, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { submitContactAction } from '@/app/contact/actions';
import { SectionHeader } from '@/components/section-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getCompanyContent } from '@/lib/company';
import { getLocale } from '@/lib/locale';
import { getSiteCopy } from '@/lib/site-copy';

function getSearchParamValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function getSubmissionFeedback(searchParams, copy) {
  const status = getSearchParamValue(searchParams?.submission);
  const message = getSearchParamValue(searchParams?.message);

  if (status === 'success') {
    return {
      title: copy.successTitle,
      message: message || copy.successMessage,
      className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    };
  }

  if (status === 'error') {
    return {
      title: copy.errorTitle,
      message: message || copy.fallbackError,
      className: 'border-red-200 bg-red-50 text-red-800',
    };
  }

  return null;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);

  return {
    title: copy.contact.metadataTitle,
    description: copy.contact.metadataDescription,
  };
}

async function ContactPage({ searchParams }) {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);
  const company = await getCompanyContent(locale);
  const feedback = getSubmissionFeedback((await searchParams) || {}, copy.contact);
  const contactItems = [
    company.address
      ? {
          key: 'address',
          icon: MapPin,
          content: <span>{company.address}</span>,
        }
      : null,
    company.email
      ? {
          key: 'email',
          icon: Mail,
          content: (
            <a href={`mailto:${company.email}`} className="hover:text-brand-red-dark">
              {company.email}
            </a>
          ),
        }
      : null,
    company.phone
      ? {
          key: 'phone',
          icon: Phone,
          content: (
            <a href={`tel:${company.phone}`} className="hover:text-brand-red-dark">
              {company.phone}
            </a>
          ),
        }
      : null,
    company.websiteUrl
      ? {
          key: 'websiteUrl',
          icon: Globe,
          content: (
            <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="hover:text-brand-red-dark">
              {company.websiteUrl}
            </a>
          ),
        }
      : null,
  ].filter(Boolean);
  const socialLinks = [
    company.linkedinUrl
      ? {
          key: 'linkedin',
          label: 'LinkedIn',
          href: company.linkedinUrl,
          icon: Linkedin,
        }
      : null,
    company.facebookUrl
      ? {
          key: 'facebook',
          label: 'Facebook',
          href: company.facebookUrl,
          icon: Facebook,
        }
      : null,
    company.instagramUrl
      ? {
          key: 'instagram',
          label: 'Instagram',
          href: company.instagramUrl,
          icon: Instagram,
        }
      : null,
  ].filter(Boolean);

  return (
    <div className="page-shell bg-white">
      <div className="container-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-8">
          <section className="rounded-[2rem] border border-brand-gray-modern/20 bg-[radial-gradient(circle_at_top_left,rgba(241,106,111,0.12),transparent_32%),linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] p-8 shadow-sm">
            <SectionHeader eyebrow={copy.contact.eyebrow} title={copy.contact.title} description={copy.contact.description} />
          </section>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {contactItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.key} className="rounded-[1.5rem] border border-brand-gray-modern/20 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-3 text-sm text-brand-gray-dark">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
                    {item.content}
                  </div>
                </div>
              );
            })}
          </div>

          {socialLinks.length ? (
            <section className="rounded-[2rem] border border-brand-gray-modern/20 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">{copy.contact.socialTitle}</p>
              <p className="mt-3 text-sm leading-7 text-brand-gray-dark">{copy.contact.socialDescription}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.key}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-[1.25rem] border border-brand-gray-modern/20 bg-[linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] px-4 py-4 text-sm font-medium text-brand-black transition-colors hover:text-brand-red-dark"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>

        <Card className="rounded-[2rem] border border-brand-gray-modern/20 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-brand-black">{copy.contact.formTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            {feedback ? (
              <div className={`mb-8 rounded-2xl border p-5 text-sm ${feedback.className}`}>
                <p className="font-bold">{feedback.title}</p>
                <p className="mt-1 opacity-90">{feedback.message}</p>
              </div>
            ) : null}

            <form action={submitContactAction} className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <Input name="fullName" className="h-12" placeholder={copy.contact.placeholders.name} required />
              </div>
              <div className="sm:col-span-1">
                <Input name="email" className="h-12" type="email" placeholder={copy.contact.placeholders.email} required />
              </div>
              <div className="sm:col-span-1">
                <Input name="company" className="h-12" placeholder={copy.contact.placeholders.company} />
              </div>
              <div className="sm:col-span-1">
                <Input name="phone" className="h-12" placeholder={copy.contact.placeholders.phone} />
              </div>
              <div className="sm:col-span-2">
                <Input name="subject" className="h-12" placeholder={copy.contact.placeholders.subject} required />
              </div>
              <div className="sm:col-span-2">
                <Textarea name="message" placeholder={copy.contact.placeholders.message} required />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="btn-brand-primary h-12 w-full sm:w-auto">
                  {copy.contact.submit}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ContactPage;
