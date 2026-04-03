import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Clock3, GraduationCap, Landmark, LayoutDashboard, ShieldCheck, Target, Users2 } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLocale } from '@/lib/locale';
import { getSiteCopy } from '@/lib/site-copy';

const serviceIcons = {
  'audit-financier': Landmark,
  'business-plan': BriefcaseBusiness,
  comptabilite: Clock3,
  'ingenierie-entrepreneuriale-agrements': ShieldCheck,
  'entrepreneurial-engineering-licensing': ShieldCheck,
  formation: GraduationCap,
  'cfo-externalise-dashboard-cfo': LayoutDashboard,
};

export async function generateMetadata() {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);

  return {
    title: copy.servicesPage.metadataTitle,
    description: copy.servicesPage.metadataDescription,
  };
}

async function ServicesPage() {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);
  const services = copy.services;

  return (
    <div className="page-shell bg-white">
      <div className="container-shell page-stack">
        <section className="rounded-[2rem] border border-brand-gray-modern/20 bg-[radial-gradient(circle_at_top_left,rgba(241,106,111,0.12),transparent_32%),linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] p-8 shadow-sm lg:p-10">
          <SectionHeader eyebrow={copy.servicesPage.eyebrow} title={copy.servicesPage.title} description={copy.servicesPage.description} />
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          {services.map((service) => {
            const Icon = serviceIcons[service.slug] || BriefcaseBusiness;

            return (
              <Card key={service.slug || service.title} className="card-corporate border-brand-gray-modern/20">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
                      <Icon className="h-6 w-6" />
                    </div>
                    {service.badge ? <Badge className="bg-brand-red/10 text-brand-red hover:bg-brand-red/10">{service.badge}</Badge> : null}
                  </div>
                  <div className="space-y-3">
                    <CardTitle className="text-brand-black">{service.title}</CardTitle>
                    <p className="text-sm leading-7 text-brand-gray-dark">{service.description}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-brand-red/5 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">{copy.servicesPage.formatLabel}</p>
                      <p className="mt-2 text-sm leading-6 text-brand-gray-dark">{service.format}</p>
                    </div>
                    <div className="rounded-2xl border border-brand-gray-modern/20 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">{copy.servicesPage.durationLabel}</p>
                      <p className="mt-2 text-sm leading-6 text-brand-gray-dark">{service.duration}</p>
                    </div>
                    <div className="rounded-2xl border border-brand-gray-modern/20 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">{copy.servicesPage.pricingLabel}</p>
                      <p className="mt-2 text-sm leading-6 text-brand-gray-dark">{service.pricing}</p>
                    </div>
                  </div>

                  {service.deliverables?.length ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">{copy.servicesPage.deliverablesLabel}</p>
                      <ul className="mt-4 space-y-3">
                        {service.deliverables.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                            <span className="text-sm leading-6 text-brand-gray-dark">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {service.sections?.length ? (
                    <div className="space-y-4">
                      {service.sections.map((section) => (
                        <div key={section.title} className="rounded-[1.5rem] border border-brand-gray-modern/20 bg-white p-5">
                          <p className="text-sm font-semibold text-brand-black">{section.title}</p>
                          {section.intro ? <p className="mt-2 text-sm leading-6 text-brand-gray-dark">{section.intro}</p> : null}

                          {section.items?.length ? (
                            <div className="mt-4">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">{copy.servicesPage.scopeLabel}</p>
                              <ul className="mt-3 space-y-3">
                                {section.items.map((item) => (
                                  <li key={item} className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                                    <span className="text-sm leading-6 text-brand-gray-dark">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}

                          {section.deliverables?.length ? (
                            <div className="mt-5">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">{copy.servicesPage.deliverablesLabel}</p>
                              <ul className="mt-3 space-y-3">
                                {section.deliverables.map((item) => (
                                  <li key={item} className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                                    <span className="text-sm leading-6 text-brand-gray-dark">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}

                          {section.specialties?.length ? (
                            <div className="mt-5">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">{section.specialtiesTitle || copy.servicesPage.specialtiesLabel}</p>
                              <ul className="mt-3 space-y-3">
                                {section.specialties.map((item) => (
                                  <li key={item} className="flex items-start gap-3">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                                    <span className="text-sm leading-6 text-brand-gray-dark">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}

                          {section.format || section.duration || section.pricing ? (
                            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                              {section.format ? (
                                <div className="rounded-2xl bg-brand-red/5 p-4">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">{copy.servicesPage.formatLabel}</p>
                                  <p className="mt-2 text-sm leading-6 text-brand-gray-dark">{section.format}</p>
                                </div>
                              ) : null}
                              {section.duration ? (
                                <div className="rounded-2xl border border-brand-gray-modern/20 p-4">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">{copy.servicesPage.durationLabel}</p>
                                  <p className="mt-2 text-sm leading-6 text-brand-gray-dark">{section.duration}</p>
                                </div>
                              ) : null}
                              {section.pricing ? (
                                <div className="rounded-2xl border border-brand-gray-modern/20 p-4">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">{copy.servicesPage.pricingLabel}</p>
                                  <p className="mt-2 text-sm leading-6 text-brand-gray-dark">{section.pricing}</p>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="grid gap-3 lg:grid-cols-2">
                    <div className="rounded-2xl border border-brand-gray-modern/20 p-4">
                      <div className="flex items-start gap-3">
                        <Target className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">{copy.servicesPage.outcomeLabel}</p>
                          <p className="mt-2 text-sm leading-6 text-brand-gray-dark">{service.outcome}</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-brand-gray-modern/20 p-4">
                      <div className="flex items-start gap-3">
                        <Users2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">{copy.servicesPage.audienceLabel}</p>
                          <p className="mt-2 text-sm leading-6 text-brand-gray-dark">{service.audience}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="rounded-[2rem] border-0 bg-[#66666B] text-white shadow-corporate">
          <CardHeader><CardTitle>{copy.servicesPage.ctaTitle}</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-white/75">{copy.servicesPage.ctaDescription}</p>
            <Link href="/contact" className="btn-brand-primary inline-flex items-center gap-2">
              {copy.servicesPage.ctaButton} <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ServicesPage;
