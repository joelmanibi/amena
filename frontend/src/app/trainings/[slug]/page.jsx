import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarRange, Clock3, Users, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTrainingBySlug, getTrainings } from '@/lib/api';
import { getLocale } from '@/lib/locale';
import { getSiteCopy } from '@/lib/site-copy';
import { formatDate } from '@/lib/utils';

export async function generateStaticParams() {
  const payload = await getTrainings({ locale: 'fr', limit: 100 });
  return (payload.data || []).map((training) => ({ slug: training.slug }));
}

export async function generateMetadata({ params }) {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);
  const { slug } = await params;
  const training = await getTrainingBySlug(slug, { locale });
  if (!training) return { title: copy.trainingsPage.trainingNotFound };
  return { title: training.title, description: training.summary };
}

async function TrainingDetailPage({ params }) {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);
  const { slug } = await params;
  const training = await getTrainingBySlug(slug, { locale });
  if (!training) notFound();

  const modules = training.modules || [];

  return (
    <div className="page-shell bg-white">
      <div className="container-shell grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
        <div className="space-y-8">
          <div className="space-y-6 rounded-[2rem] border border-brand-gray-modern/20 bg-[radial-gradient(circle_at_top_left,rgba(241,106,111,0.12),transparent_32%),linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] p-8 shadow-sm lg:p-10">
            <Link href="/trainings" className="inline-flex items-center gap-2 text-sm font-medium text-brand-red transition-colors hover:text-brand-red-dark">
              <ArrowLeft className="h-4 w-4" />
              {copy.trainingsPage.backToAll}
            </Link>
            <Badge className="bg-brand-red-light/20 text-brand-red-dark">{training.format}</Badge>
            <div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-brand-black sm:text-5xl">{training.title}</h1>
              <p className="mt-6 text-lg leading-8 text-brand-gray-dark">{training.description}</p>
            </div>
          </div>

          {modules.length ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-black">{copy.trainingsPage.programModules}</h2>
              <ul className="space-y-3 text-brand-gray-dark">
                {modules.map((module) => (
                  <li key={module} className="rounded-2xl border border-brand-gray-modern/20 bg-white p-5 text-sm leading-7 shadow-sm">{module}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <Card className="h-fit rounded-[2rem] border border-brand-gray-modern/20 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-brand-black">{copy.trainingsPage.programInformation}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-brand-gray-dark">
            {training.duration ? <div className="flex items-start gap-3 rounded-2xl bg-brand-gray-modern/10 p-4"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" /><p><strong className="text-brand-black">{copy.trainingsPage.duration}:</strong> {training.duration}</p></div> : null}
            {training.audience ? <div className="flex items-start gap-3 rounded-2xl bg-brand-gray-modern/10 p-4"><Users className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" /><p><strong className="text-brand-black">{copy.trainingsPage.audience}:</strong> {training.audience}</p></div> : null}
            {training.nextSession ? <div className="flex items-start gap-3 rounded-2xl bg-brand-gray-modern/10 p-4"><CalendarRange className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" /><p><strong className="text-brand-black">{copy.trainingsPage.nextSession}:</strong> {formatDate(training.nextSession, locale)}</p></div> : null}
            <div className="flex items-start gap-3 rounded-2xl bg-brand-red/10 p-4"><Wallet className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" /><p><strong className="text-brand-black">{copy.trainingsPage.price}:</strong> {training.priceLabel}</p></div>
            <Link href="/contact" className="btn-brand-primary inline-flex w-full items-center justify-center">
              {copy.trainingsPage.registerInterest}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TrainingDetailPage;
