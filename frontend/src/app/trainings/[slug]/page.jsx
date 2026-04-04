import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarRange, Clock3, Users, Wallet } from 'lucide-react';
import { submitTrainingRegistrationAction } from '@/app/trainings/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getTrainingBySlug, getTrainings } from '@/lib/api';
import { getLocale } from '@/lib/locale';
import { getSiteCopy } from '@/lib/site-copy';
import { formatDate } from '@/lib/utils';

function getSearchParamValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function getSessionTimestamp(value) {
  return value ? new Date(value).getTime() : Number.MAX_SAFE_INTEGER;
}

function getOpenSessions(sessions = []) {
  const now = Date.now();

  return sessions
    .filter((session) => session?.status === 'open')
    .filter((session) => !session.registrationDeadline || new Date(session.registrationDeadline).getTime() >= now)
    .sort((left, right) => getSessionTimestamp(left?.startDate) - getSessionTimestamp(right?.startDate));
}

function getSortedSessions(sessions = []) {
  return [...sessions].sort((left, right) => getSessionTimestamp(left?.startDate) - getSessionTimestamp(right?.startDate));
}

function getRegistrationFeedback(searchParams, copy) {
  const status = getSearchParamValue(searchParams?.registration);
  const message = getSearchParamValue(searchParams?.message);

  if (status === 'success') {
    return {
      title: copy.registrationSuccessTitle,
      message: message || copy.registrationSuccessMessage,
      className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    };
  }

  if (status === 'error') {
    return {
      title: copy.registrationErrorTitle,
      message: message || copy.registrationFallbackError,
      className: 'border-red-200 bg-red-50 text-red-800',
    };
  }

  return null;
}

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

async function TrainingDetailPage({ params, searchParams }) {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);
  const { slug } = await params;
  const training = await getTrainingBySlug(slug, { locale });
  if (!training) notFound();

  const modules = training.modules || [];
  const sessions = getSortedSessions(training.sessions || []);
  const openSessions = getOpenSessions(training.sessions || []);
  const registrationFeedback = getRegistrationFeedback((await searchParams) || {}, copy.trainingsPage);

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

          <Card className="rounded-[2rem] border border-brand-gray-modern/20 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-brand-black">{copy.trainingsPage.registrationTitle}</CardTitle>
              <p className="text-sm leading-7 text-brand-gray-dark">{copy.trainingsPage.registrationDescription}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              {registrationFeedback ? (
                <div className={`rounded-2xl border px-4 py-3 ${registrationFeedback.className}`}>
                  <p className="text-sm font-semibold">{registrationFeedback.title}</p>
                  <p className="mt-1 text-sm">{registrationFeedback.message}</p>
                </div>
              ) : null}

              {openSessions.length ? (
                <form action={submitTrainingRegistrationAction} className="grid gap-5 sm:grid-cols-2">
                  <input type="hidden" name="trainingSlug" value={training.slug} />

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-brand-black">{copy.trainingsPage.sessionLabel}</label>
                    <Select name="sessionId" defaultValue={String(openSessions[0].id)} className="input-corporate h-12 rounded-xl border-brand-gray-modern bg-white text-brand-black">
                      {openSessions.map((session) => (
                        <option key={session.id} value={session.id}>
                          {session.sessionTitle} — {formatDate(session.startDate, locale)}{session.location ? ` · ${session.location}` : ''}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-brand-black">{copy.trainingsPage.fullNameLabel}</label>
                    <Input name="fullName" required className="h-12" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-brand-black">{copy.trainingsPage.emailLabel}</label>
                    <Input name="email" type="email" required className="h-12" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-brand-black">{copy.trainingsPage.phoneLabel}</label>
                    <Input name="phone" className="h-12" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-brand-black">{copy.trainingsPage.companyLabel}</label>
                    <Input name="company" className="h-12" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-brand-black">{copy.trainingsPage.jobTitleLabel}</label>
                    <Input name="jobTitle" className="h-12" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-brand-black">{copy.trainingsPage.messageLabel}</label>
                    <Textarea name="message" placeholder={copy.trainingsPage.messagePlaceholder} className="min-h-[150px]" />
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" className="btn-brand-primary h-12 px-6">
                      {copy.trainingsPage.submitRegistration}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-dashed border-brand-gray-modern/40 bg-brand-gray-modern/5 px-5 py-6">
                  <p className="text-lg font-semibold text-brand-black">{copy.trainingsPage.noOpenSessionsTitle}</p>
                  <p className="mt-2 text-sm leading-7 text-brand-gray-dark">{copy.trainingsPage.noOpenSessionsDescription}</p>
                  <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-red transition-colors hover:text-brand-red-dark">
                    {copy.trainingsPage.registerInterest}
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
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

            {sessions.length ? (
              <div className="space-y-3 border-t border-brand-gray-modern/20 pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">{copy.trainingsPage.sessionsAvailable}</p>
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="rounded-2xl border border-brand-gray-modern/20 bg-white p-4">
                      <p className="font-medium text-brand-black">{session.sessionTitle}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-brand-red">{session.status}</p>
                      <p className="mt-2 text-sm text-brand-gray-dark">{formatDate(session.startDate, locale)} → {formatDate(session.endDate, locale)}</p>
                      {session.location ? <p className="mt-1 text-sm text-brand-gray-dark">{session.location}</p> : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TrainingDetailPage;
