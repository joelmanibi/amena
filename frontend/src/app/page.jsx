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
import { HeroSlider } from '@/components/home/hero-slider';
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
      <HeroSlider slides={copy.home.heroSlides} />

      <section className="relative bg-white py-24 sm:py-32 overflow-hidden">
        {/* Éléments de design en arrière-plan */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container-shell relative">
          <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-start">
            <div className="space-y-10">
              <div className="space-y-6">
                <Badge className="px-4 py-1.5 bg-brand-black text-white hover:bg-brand-black/90 rounded-full text-xs font-bold tracking-widest uppercase">
                  {copy.home.panelBadge}
                </Badge>
                <h2 className="text-4xl font-extrabold tracking-tight text-brand-black sm:text-5xl lg:text-6xl leading-[1.1]">
                  {copy.home.panelTitle}
                </h2>
                <div className="h-1.5 w-24 bg-brand-red rounded-full" />
                <p className="max-w-xl text-xl leading-relaxed text-brand-gray-dark font-medium">
                  {copy.home.panelDescription}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {copy.home.focusAreas.map((item, index) => (
                  <div 
                    key={item.title} 
                    className="group relative overflow-hidden rounded-[2rem] border border-brand-gray-modern/40 bg-white p-8 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-brand-red/20"
                  >
                    <p className="text-2xl font-bold text-brand-red mb-3">{item.title}</p>
                    <p className="text-base leading-relaxed text-brand-gray-dark font-medium opacity-80 group-hover:opacity-100 transition-opacity">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-brand-red/5 rounded-[2.5rem] rotate-1 scale-[1.02]" />
              <div className="relative space-y-4 bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] border border-brand-gray-modern/30 shadow-2xl">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-brand-black mb-10 flex items-center gap-4">
                  <span className="h-px w-8 bg-brand-red" />
                  Nos engagements
                </h3>
                {copy.home.priorities.map((item) => (
                  <div 
                    key={item} 
                    className="flex items-start gap-6 p-4 rounded-2xl transition-all duration-300 hover:bg-brand-red/5 group"
                  >
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white text-brand-red shadow-sm border border-brand-gray-modern/20 transition-all group-hover:bg-brand-red group-hover:text-white group-hover:border-brand-red group-hover:scale-110">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-base leading-relaxed text-brand-gray-dark font-semibold group-hover:text-brand-black transition-colors">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 bg-white overflow-hidden border-b border-brand-gray-modern/10">
        <div className="container-shell">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="group relative p-8 rounded-[2rem] bg-brand-gray-light/5 border border-brand-gray-modern/20 transition-all duration-500 hover:bg-white hover:shadow-xl hover:border-brand-red/20 animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
              >
                <div className="absolute top-4 right-6 text-brand-red opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gray-dark group-hover:text-brand-red transition-colors duration-300 mb-2">
                  {stat.label}
                </p>
                <p className="text-4xl font-black text-brand-black group-hover:scale-105 transition-transform duration-500 origin-left">
                  {stat.value}
                </p>
                <div className="mt-4 h-1 w-12 bg-brand-red rounded-full transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 sm:py-32 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container-shell relative">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between mb-16">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-3">
                <span className="h-1.5 w-12 bg-brand-red rounded-full" />
                <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-black">{copy.news.featuredLabel}</p>
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight text-brand-black sm:text-5xl">{copy.home.insightsSection.title}</h2>
              <p className="mt-6 text-xl text-brand-gray-dark leading-relaxed font-medium">
                {copy.home.insightsSection.description}
              </p>
            </div>
            <Link href="/news" className="group inline-flex items-center gap-3 bg-brand-black text-white px-8 py-4 rounded-full text-sm font-bold transition-all hover:bg-brand-red hover:shadow-lg hover:-translate-y-1">
              {copy.home.insightsSection.cta} 
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>

          {leadArticle ? (
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="animate-in fade-in slide-in-from-left-10 duration-1000">
                <ArticleCard article={leadArticle} locale={locale} copy={copy.news} variant="featured" />
              </div>

              <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-10 duration-1000">
                <div className="p-8 rounded-[2.5rem] bg-brand-gray-light/5 border border-brand-gray-modern/20">
                  <h3 className="text-lg font-bold uppercase tracking-widest text-brand-black mb-8 pb-4 border-b border-brand-gray-modern/20">
                    Analyses récentes
                  </h3>
                  <div className="space-y-8">
                    {sideArticles.map((article, idx) => (
                      <div key={article.id || article.slug} className="group cursor-pointer">
                        <Link href={`/news/${article.slug}`}>
                          <p className="text-xs font-bold text-brand-red uppercase tracking-widest mb-2">{article.category}</p>
                          <h4 className="text-lg font-bold text-brand-black group-hover:text-brand-red transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="mt-2 text-sm text-brand-gray-dark flex items-center gap-2">
                            {formatDate(article.publishedAt, locale)} <span className="h-1 w-1 bg-brand-gray-modern rounded-full" /> {article.readTime}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-red p-8 text-white group cursor-pointer">
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60 mb-4">Newsletter</p>
                  <h3 className="text-xl font-bold mb-4">Recevez nos analyses financières directement.</h3>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/10 rounded-full px-4 py-2 text-sm backdrop-blur-sm border border-white/20">Votre email</div>
                    <div className="h-10 w-10 flex items-center justify-center bg-white text-brand-red rounded-full shadow-lg"><ArrowRight className="h-5 w-5" /></div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="relative py-24 sm:py-32 bg-brand-gray-light/5 overflow-hidden">
        {/* Decorative pattern for the background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #C4161C 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="container-shell relative">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-brand-red/10 text-brand-red border-none hover:bg-brand-red/20 rounded-md px-3 py-1 text-xs font-bold uppercase tracking-widest">
                {copy.home.servicesSection.eyebrow}
              </Badge>
              <h2 className="text-4xl font-extrabold tracking-tight text-brand-black sm:text-5xl leading-tight">
                {copy.home.servicesSection.title}
              </h2>
              <p className="mt-6 text-xl text-brand-gray-dark leading-relaxed font-medium">
                {copy.home.servicesSection.description}
              </p>
            </div>
            <Link href="/services" className="group inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-brand-gray-modern shadow-sm text-sm font-bold text-brand-black transition-all hover:border-brand-red hover:text-brand-red">
              {copy.home.servicesSection.cta} 
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {homepageServices.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="group relative flex flex-col bg-white rounded-[2rem] border border-brand-gray-modern/30 p-10 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:border-brand-red/10"
                >
                  {/* Icon Container with dynamic background */}
                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gray-light/20 text-brand-red transition-all duration-500 group-hover:bg-brand-red group-hover:text-white group-hover:shadow-lg">
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-bold text-brand-black group-hover:text-brand-red transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-brand-gray-dark font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-10 pt-8 border-t border-brand-gray-modern/10">
                    <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold text-brand-red group/link">
                      <span className="relative">
                        {copy.home.servicesSection.itemCta}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover/link:w-full" />
                      </span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 relative overflow-hidden rounded-[2.5rem] bg-brand-black p-10 lg:p-16 shadow-2xl">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-brand-red/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-brand-red/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 lg:flex lg:items-center lg:justify-between lg:gap-20">
              <div className="max-w-2xl">
                <span className="inline-block mb-6 text-xs font-black tracking-[0.4em] uppercase text-brand-red">
                  {copy.home.servicesSection.whyEyebrow}
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                  Une expertise reconnue pour des décisions sereines
                </h3>
                <p className="text-lg leading-relaxed text-brand-gray-light/80 font-medium">
                  {copy.home.servicesSection.whyDescription}
                </p>
              </div>
              <div className="mt-12 lg:mt-0 flex-shrink-0">
                <Link href="/contact" className="group relative inline-flex items-center justify-center rounded-full bg-white px-10 py-5 font-bold text-brand-black transition-all hover:scale-105 active:scale-95 shadow-xl">
                  <span className="relative z-10 flex items-center gap-3">
                    {copy.home.servicesSection.whyCta}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container-shell relative">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between mb-16">
            <SectionHeader
              eyebrow={copy.home.trainingsSection.eyebrow}
              title={copy.home.trainingsSection.title}
              description={copy.home.trainingsSection.description}
            />
            <Link href="/trainings" className="group inline-flex items-center gap-3 bg-brand-red text-white px-8 py-4 rounded-full text-sm font-bold transition-all hover:bg-brand-red-dark hover:shadow-xl hover:-translate-y-1">
              {copy.home.trainingsSection.cta} 
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            {featuredTrainings.length ? featuredTrainings.map((training, index) => {
              const trainingMeta = [training.duration, training.audience].filter(Boolean).join(' • ');

              return (
                <div 
                  key={training.slug} 
                  className="group flex flex-col bg-white rounded-[2.5rem] border border-brand-gray-modern/30 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-brand-red/20 animate-in fade-in slide-in-from-bottom-12"
                  style={{ animationDelay: `${index * 200}ms`, animationFillMode: 'both' }}
                >
                  <div className="p-8 flex-1">
                    <div className="flex items-center justify-between mb-6">
                      <Badge className="bg-brand-red/10 text-brand-red border-none px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                        {training.format}
                      </Badge>
                      <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-brand-gray-light/20 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors duration-500">
                        <CalendarRange className="h-6 w-6" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-brand-black group-hover:text-brand-red transition-colors duration-300 mb-4">
                      {training.title}
                    </h3>
                    <p className="text-base text-brand-gray-dark leading-relaxed line-clamp-3 mb-6">
                      {training.summary}
                    </p>

                    <div className="space-y-4 pt-6 border-t border-brand-gray-modern/10">
                      {training.nextSession && (
                        <div className="flex items-center gap-3 text-sm font-bold text-brand-black">
                          <div className="h-8 w-8 rounded-full bg-brand-red/5 flex items-center justify-center text-brand-red">
                            <CalendarRange className="h-4 w-4" />
                          </div>
                          <span>{copy.home.trainingsSection.nextSession}: {formatDate(training.nextSession, locale)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-sm font-bold text-brand-black">
                        <div className="h-8 w-8 rounded-full bg-brand-red/5 flex items-center justify-center text-brand-red">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span>{training.format} {copy.home.trainingsSection.deliverySuffix}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-brand-gray-light/5 flex items-center justify-between gap-4">
                    <p className="text-2xl font-black text-brand-black">{training.priceLabel}</p>
                    <Link href={`/trainings/${training.slug}`} className="group/btn inline-flex items-center gap-2 text-sm font-black text-brand-red uppercase tracking-widest">
                      {copy.home.trainingsSection.viewProgram}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            }) : (
              <div className="lg:col-span-3 p-16 rounded-[3rem] bg-brand-gray-light/5 border border-dashed border-brand-gray-modern/40 text-center">
                <p className="text-xl font-bold text-brand-black mb-2">{copy.home.trainingsSection.noTrainingsTitle}</p>
                <p className="text-brand-gray-dark font-medium">{copy.home.trainingsSection.noTrainingsDescription}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <TeamMembersSection members={teamMembers} copy={copy.home.teamSection} />
    </>
  );
}

export default HomePage;
