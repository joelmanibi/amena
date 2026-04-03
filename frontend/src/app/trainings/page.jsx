import Link from 'next/link';
import { ArrowRight, CalendarRange, GraduationCap, Wallet } from 'lucide-react';
import { TrainingsPaginationControls } from '@/components/trainings/pagination-controls';
import { TrainingsSearchForm } from '@/components/trainings/trainings-search-form';
import { SectionHeader } from '@/components/section-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTrainings } from '@/lib/api';
import { getLocale } from '@/lib/locale';
import { getSiteCopy } from '@/lib/site-copy';
import { formatDate } from '@/lib/utils';

const PAGE_SIZE = 6;

function normalizePage(value) {
  const page = Number(value || 1);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export async function generateMetadata() {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);

  return {
    title: copy.trainingsPage.metadataTitle,
    description: copy.trainingsPage.metadataDescription,
  };
}

async function TrainingsPage({ searchParams }) {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);
  const params = await searchParams;
  const query = typeof params?.q === 'string' ? params.q.trim() : '';
  const currentPage = normalizePage(params?.page);
  const trainingsResponse = await getTrainings({
    locale,
    page: currentPage,
    limit: PAGE_SIZE,
    search: query || undefined,
  });
  const trainings = trainingsResponse.data || [];
  const meta = trainingsResponse.meta || { page: 1, totalPages: 1, total: 0 };
  const totalTrainings = meta.total || 0;
  const activeFilters = query ? [`${copy.trainingsPage.searchPrefix} “${query}”`] : [];

  return (
    <div className="bg-white py-20">
      <div className="container-shell space-y-12">
        <section className="rounded-[2rem] border border-brand-gray-modern/20 bg-[radial-gradient(circle_at_top_left,rgba(241,106,111,0.14),transparent_34%),linear-gradient(180deg,#ffffff_0%,#fff9f9_100%)] p-8 shadow-sm lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionHeader
              eyebrow={copy.trainingsPage.eyebrow}
              title={copy.trainingsPage.title}
              description={copy.trainingsPage.description}
            />
            <div className="rounded-2xl border border-brand-gray-modern/20 bg-white px-5 py-4 text-sm text-brand-gray-dark shadow-sm">
              <p>
                {copy.trainingsPage.availablePrograms}: <span className="font-semibold text-brand-black">{totalTrainings}</span>
              </p>
            </div>
          </div>
        </section>

        <div className="rounded-[1.75rem] border border-brand-gray-modern/30 bg-white p-6 shadow-sm">
          <TrainingsSearchForm query={query} copy={copy.trainingsPage} />
        </div>

        <div className="flex flex-col gap-3 text-sm text-brand-gray-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            {copy.trainingsPage.showing} <span className="font-medium text-brand-black">{trainings.length}</span> {copy.trainingsPage.of}{' '}
            <span className="font-medium text-brand-black">{totalTrainings}</span>{' '}
            {totalTrainings === 1 ? copy.trainingsPage.programSingular : copy.trainingsPage.programPlural}
          </p>
          {activeFilters.length ? (
            <p>
              {copy.trainingsPage.activeFilters}:{' '}
              <span className="font-medium text-brand-black">{activeFilters.join(' · ')}</span>
            </p>
          ) : null}
        </div>

        {trainings.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {trainings.map((training) => {
              const trainingMeta = [training.duration, training.audience].filter(Boolean).join(' • ');

              return (
                <Card
                  key={training.slug}
                  className="group flex h-full flex-col rounded-[1.5rem] border border-brand-gray-modern bg-white transition-all duration-200 hover:-translate-y-1 hover:border-brand-red-dark hover:shadow-corporate"
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <Badge className="bg-brand-red/10 text-brand-red hover:bg-brand-red/10">{training.format}</Badge>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gray-modern/60 bg-white text-brand-red transition-colors duration-200 group-hover:border-brand-red-dark group-hover:bg-brand-red-dark group-hover:text-white">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <CardTitle className="text-brand-black transition-colors duration-200 group-hover:text-brand-red-dark">{training.title}</CardTitle>
                      {trainingMeta ? <CardDescription className="text-brand-gray-dark">{trainingMeta}</CardDescription> : null}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="text-sm leading-7 text-brand-gray-dark">{training.summary}</p>

                    <div className="mt-6 space-y-3 rounded-2xl bg-brand-gray-modern/10 p-4 text-sm text-brand-gray-dark">
                      {training.nextSession ? (
                        <div className="flex items-center gap-2">
                          <CalendarRange className="h-4 w-4 text-brand-red" />
                          <span>
                            <span className="font-medium text-brand-black">{copy.trainingsPage.sessionDate}:</span> {formatDate(training.nextSession, locale)}
                          </span>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-brand-red" />
                        <span>
                          <span className="font-medium text-brand-black">{copy.trainingsPage.price}:</span> {training.priceLabel}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4 border-t border-brand-gray-modern/30 pt-6">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">{copy.trainingsPage.programFee}</p>
                        <p className="mt-1 text-2xl font-semibold text-brand-black">{training.priceLabel}</p>
                      </div>
                      <Link href={`/trainings/${training.slug}`} className="btn-brand-primary px-5 py-3 text-sm">
                        {copy.trainingsPage.registerNow}
                      </Link>
                    </div>

                    <Link href={`/trainings/${training.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-red transition-colors hover:text-brand-red-dark">
                      {copy.trainingsPage.viewProgramDetails} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="rounded-[1.5rem] border border-brand-gray-modern/20 bg-white shadow-sm">
            <CardContent className="space-y-3 p-8 text-center">
              <p className="text-lg font-semibold text-brand-black">{copy.trainingsPage.noTrainingsTitle}</p>
              <p className="text-brand-gray-dark">
                {query ? copy.trainingsPage.noTrainingsDescription : copy.trainingsPage.noPublishedTrainingsDescription}
              </p>
            </CardContent>
          </Card>
        )}

        <TrainingsPaginationControls page={meta.page || currentPage} totalPages={meta.totalPages || 1} query={query} copy={copy.trainingsPage} />
      </div>
    </div>
  );
}

export default TrainingsPage;
