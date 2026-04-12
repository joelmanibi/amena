import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarRange,
  ChartColumnBig,
  CheckCircle2,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { ArticleCard } from '@/components/news/article-card';
import { SectionHeader } from '@/components/section-header';
import { TeamMembersSection } from '@/components/team/team-members-section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLatestArticles, getTeamMembers, getTrainings as getPublicTrainings } from '@/lib/api';
import { getLocale } from '@/lib/locale';
import { getSiteCopy } from '@/lib/site-copy';
import { formatDate } from '@/lib/utils';

const serviceIcons = [Landmark, BriefcaseBusiness, ChartColumnBig, ShieldCheck, Building2, LayoutDashboard];
const FEATURED_TRAININGS_LIMIT = 3;

function hasActiveSession(training, now = Date.now()) {
  const sessions = Array.isArray(training?.sessions) ? training.sessions : [];

  if (sessions.length) {
    return sessions.some((session) => {
      if (!session?.endDate) {
        return false;
      }

      if (session.status === 'cancelled' || session.status === 'completed') {
        return false;
      }

      return new Date(session.endDate).getTime() >= now;
    });
  }

  if (!training?.nextSession) {
    return false;
  }

  return new Date(training.nextSession).getTime() >= now;
}

function getFeaturedTrainings(trainings = []) {
  return trainings.filter((training) => hasActiveSession(training)).slice(0, FEATURED_TRAININGS_LIMIT);
}

async function HomePage() {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);
  const fallbackArticles = copy.fallbackArticles;
  const stats = copy.stats;
  const homepageServices = copy.home.servicesSection.cards.map((service, index) => ({
    ...service,
    icon: serviceIcons[index] || Landmark,
  }));
  const [latestArticles, trainingsResponse, teamMembers] = await Promise.all([
    getLatestArticles(4),
    getPublicTrainings({ locale, limit: 50 }),
    getTeamMembers(),
  ]);
  const featuredArticles = latestArticles.length ? latestArticles : fallbackArticles;
  const leadArticle = featuredArticles[0] || null;
  const sideArticles = featuredArticles.slice(1, 4);
  const featuredTrainings = getFeaturedTrainings(trainingsResponse.data || []);

  return (
    <>
      <section className="relative overflow-hidden border-b border-brand-gray-modern/20 bg-white">
        <div className="hero-home-background absolute inset-x-0 top-0 h-[32rem] pointer-events-none" aria-hidden="true">
          <div className="hero-home-slide hero-home-slide--first" />
          <div className="hero-home-slide hero-home-slide--second" />
          <div className="hero-home-overlay" />
        </div>
        <div className="container-shell relative grid gap-12 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16">
          <div>
            <Badge className="mb-6 border border-brand-red/15 bg-brand-red/10 text-brand-red hover:bg-brand-red/10">
              AMENA CONSULTING
            </Badge>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-brand-black sm:text-5xl lg:text-6xl">
              {copy.home.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-brand-gray-dark">
              {copy.home.description}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/services" className="btn-brand-primary">
                {copy.home.primaryCta}
              </Link>
              <Link href="/trainings" className="btn-brand-secondary">
                {copy.home.secondaryCta}
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {copy.home.highlights.map((item) => (
                <div key={item} className="rounded-2xl border border-brand-gray-modern/20 bg-white px-4 py-4 shadow-corporate">
                  <p className="text-sm font-medium text-brand-black">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="card-corporate border-brand-gray-modern/20 bg-white/95">
            <CardHeader className="space-y-4">
              <Badge className="w-fit bg-[#66666B] text-white hover:bg-[#66666B]">{copy.home.panelBadge}</Badge>
              <CardTitle className="text-2xl text-brand-black">{copy.home.panelTitle}</CardTitle>
              <CardDescription className="text-base leading-7 text-brand-gray-dark">
                {copy.home.panelDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {copy.home.priorities.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-brand-gray-modern/20 bg-white p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-brand-red" />
                  <p className="text-sm leading-6 text-brand-gray-dark">{item}</p>
                </div>
              ))}

              <div className="rounded-[1.5rem] bg-brand-red p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">{copy.home.focusEyebrow}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {copy.home.focusAreas.map((item) => (
                    <div key={item.title}>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="mt-1 text-sm text-white/65">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="surface-grid border-b border-brand-gray-modern/20 bg-white py-12">
        <div className="container-shell grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-brand-gray-modern/20 bg-white shadow-none">
              <CardHeader className="pb-5">
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">{stat.label}</CardDescription>
                <CardTitle className="text-3xl text-brand-red">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-brand-gray-modern/15 bg-white py-20">
        <div className="container-shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-red" />
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-black">{copy.news.featuredLabel}</p>
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-brand-black sm:text-4xl">{copy.home.insightsSection.title}</h2>
              <p className="mt-4 text-base leading-7 text-brand-gray-dark sm:text-lg">
                {copy.home.insightsSection.description}
              </p>
            </div>
            <Link href="/news" className="inline-flex items-center gap-2 text-sm font-medium text-brand-red hover:text-brand-red-dark">
              {copy.home.insightsSection.cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {leadArticle ? (
            <div className="mt-12 space-y-8">
              <ArticleCard article={leadArticle} locale={locale} copy={copy.news} variant="featured" />

              <div className="grid gap-6 border-t border-brand-gray-modern/15 pt-8 md:grid-cols-2 xl:grid-cols-3">
                {sideArticles.map((article) => (
                  <ArticleCard key={article.id || article.slug} article={article} locale={locale} copy={copy.news} variant="compact" />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-[radial-gradient(circle_at_top_left,rgba(196,22,28,0.08),transparent_30%),linear-gradient(180deg,rgba(196,22,28,0.05)_0%,rgba(255,255,255,0.96)_52%,#ffffff_100%)] py-20">
        <div className="container-shell">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              eyebrow={copy.home.servicesSection.eyebrow}
              title={copy.home.servicesSection.title}
              description={copy.home.servicesSection.description}
            />
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-medium text-brand-red hover:text-brand-red-dark">
              {copy.home.servicesSection.cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {homepageServices.map((service) => {
              const Icon = service.icon;

              return (
                <Card
                  key={service.title}
                  className="group rounded-2xl border border-brand-gray-modern bg-white transition-all duration-200 hover:-translate-y-1 hover:border-brand-red-dark hover:shadow-corporate"
                >
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gray-modern/60 bg-white text-brand-red transition-colors duration-200 group-hover:border-brand-red-dark group-hover:bg-brand-red-dark group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-brand-black transition-colors duration-200 group-hover:text-brand-red-dark">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-brand-gray-dark">{service.description}</p>
                    <Link href="/services" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-red hover:text-brand-red-dark">
                      {copy.home.servicesSection.itemCta} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 rounded-[2rem] border border-brand-red/10 bg-brand-red-light/10 p-6 lg:flex lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-red">{copy.home.servicesSection.whyEyebrow}</p>
              <p className="mt-2 max-w-3xl text-base leading-7 text-brand-gray-dark">
                {copy.home.servicesSection.whyDescription}
              </p>
            </div>
            <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-black hover:text-brand-red lg:mt-0">
              {copy.home.servicesSection.whyCta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow={copy.home.trainingsSection.eyebrow}
              title={copy.home.trainingsSection.title}
              description={copy.home.trainingsSection.description}
            />
            <Link href="/trainings" className="inline-flex items-center gap-2 text-sm font-medium text-brand-red hover:text-brand-red-dark">
              {copy.home.trainingsSection.cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
	            {featuredTrainings.length ? featuredTrainings.map((training) => {
	              const trainingMeta = [training.duration, training.audience].filter(Boolean).join(' • ');

	              return (
	                <Card key={training.slug} className="card-corporate border-brand-gray-modern/20">
	                  <CardHeader>
	                    <div className="flex items-start justify-between gap-4">
	                      <div>
	                        <Badge className="mb-4 bg-brand-red/10 text-brand-red hover:bg-brand-red/10">{training.format}</Badge>
	                        <CardTitle className="text-brand-black">{training.title}</CardTitle>
	                        {trainingMeta ? <CardDescription className="mt-3 text-brand-gray-dark">{trainingMeta}</CardDescription> : null}
	                      </div>
	                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
	                        <CalendarRange className="h-6 w-6" />
	                      </div>
	                    </div>
	                  </CardHeader>
	                  <CardContent>
	                    <p className="text-sm leading-7 text-brand-gray-dark">{training.summary}</p>
	                    <div className="mt-6 space-y-3 rounded-2xl bg-brand-gray-modern/10 p-4 text-sm text-brand-gray-dark">
	                      {training.nextSession ? (
	                        <div className="flex items-center gap-2">
	                          <CalendarRange className="h-4 w-4 text-brand-red" />
	                          <span>{copy.home.trainingsSection.nextSession}: {formatDate(training.nextSession, locale)}</span>
	                        </div>
	                      ) : null}
	                      <div className="flex items-center gap-2">
	                        <MapPin className="h-4 w-4 text-brand-red" />
	                        <span>{training.format} {copy.home.trainingsSection.deliverySuffix}</span>
	                      </div>
	                    </div>
	                    <div className="mt-6 flex items-center justify-between gap-4">
	                      <p className="text-lg font-semibold text-brand-black">{training.priceLabel}</p>
	                      <Link href={`/trainings/${training.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-brand-red hover:text-brand-red-dark">
	                        {copy.home.trainingsSection.viewProgram} <ArrowRight className="h-4 w-4" />
	                      </Link>
	                    </div>
	                  </CardContent>
	                </Card>
	              );
	            }) : (
	              <Card className="lg:col-span-3 card-corporate border-brand-gray-modern/20">
	                <CardContent className="space-y-2 p-8 text-center">
	                  <p className="text-lg font-semibold text-brand-black">{copy.home.trainingsSection.noTrainingsTitle}</p>
	                  <p className="text-brand-gray-dark">{copy.home.trainingsSection.noTrainingsDescription}</p>
	                </CardContent>
	              </Card>
	            )}
          </div>
        </div>
      </section>

      <TeamMembersSection members={teamMembers} copy={copy.home.teamSection} />
    </>
  );
}

export default HomePage;
