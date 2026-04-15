import Link from 'next/link';
import { updateRegistrationStatusAction } from '@/app/admin/actions';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { listAdminRegistrations, listAdminTrainings } from '@/lib/admin-api';
import { formatDateTime, getRecordDate } from '@/lib/admin-format';
import { cn } from '@/lib/utils';

const registrationStatuses = ['pending', 'confirmed', 'cancelled'];
const registrationStatusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
};
const PAGE_SIZE = 20;

function isInterestSession(session) {
  return typeof session?.sessionCode === 'string' && session.sessionCode.startsWith('interest-program-');
}

function getSearchParamValue(searchParams, key) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

function normalizePositiveInteger(value, fallback = 1) {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function buildPageHref(page, filters) {
  const params = new URLSearchParams();
  params.set('page', String(page));

  if (filters.status && filters.status !== 'all') params.set('status', filters.status);
  if (filters.programId) params.set('programId', filters.programId);
  if (filters.sessionId) params.set('sessionId', filters.sessionId);
  if (filters.search) params.set('search', filters.search);

  const queryString = params.toString();
  return `/admin/registrations${queryString ? `?${queryString}` : ''}`;
}

function getRegistrationSessionLabel(registration) {
  const sessionCode = registration.session?.sessionCode || '';

  if (sessionCode.startsWith('interest-program-')) {
    return 'Demande sans session planifiée';
  }

  return registration.session?.sessionTitle || 'Session inconnue';
}

async function RegistrationsAdminPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const currentPage = normalizePositiveInteger(getSearchParamValue(resolvedSearchParams, 'page'));
  const statusFilter = getSearchParamValue(resolvedSearchParams, 'status') || 'all';
  const rawProgramIdFilter = getSearchParamValue(resolvedSearchParams, 'programId') || '';
  const rawSessionIdFilter = getSearchParamValue(resolvedSearchParams, 'sessionId') || '';
  const programIdFilter = rawProgramIdFilter === 'all' ? '' : rawProgramIdFilter;
  const sessionIdFilter = rawSessionIdFilter === 'all' ? '' : rawSessionIdFilter;
  const searchFilter = (getSearchParamValue(resolvedSearchParams, 'search') || '').trim();
  const filters = {
    status: statusFilter,
    programId: programIdFilter,
    sessionId: sessionIdFilter,
    search: searchFilter,
  };

  const [payload, trainingsPayload] = await Promise.all([
    listAdminRegistrations({
      page: currentPage,
      limit: PAGE_SIZE,
      status: statusFilter,
      programId: programIdFilter,
      sessionId: sessionIdFilter,
      search: searchFilter,
    }),
    listAdminTrainings(),
  ]);

  const registrations = payload.data || [];
  const meta = payload.meta || { total: registrations.length, page: currentPage, totalPages: 1, limit: PAGE_SIZE };
  const trainings = trainingsPayload.data || [];
  const sessionOptions = trainings
    .filter((training) => !programIdFilter || String(training.id) === programIdFilter)
    .flatMap((training) =>
      (training.sessions || [])
        .filter((session) => !isInterestSession(session))
        .map((session) => ({
          id: String(session.id),
          label: `${training.title} — ${session.sessionTitle}`,
          startDate: session.startDate,
        }))
    )
    .sort((left, right) => new Date(left.startDate).getTime() - new Date(right.startDate).getTime());

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Liste des inscriptions" description="Examinez les demandes des participants, confirmez les inscriptions et maintenez les statuts à jour." />

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Affinez la liste par mot-clé, statut, formation ou session.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))_auto]" method="get">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>Recherche</span>
              <Input name="search" defaultValue={searchFilter} placeholder="Nom, email ou entreprise" />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>Statut</span>
              <Select name="status" defaultValue={statusFilter}>
                <option value="all">Tous les statuts</option>
                {registrationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {registrationStatusLabels[status] || status}
                  </option>
                ))}
              </Select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>Formation</span>
              <Select name="programId" defaultValue={programIdFilter || 'all'}>
                <option value="all">Toutes les formations</option>
                {trainings.map((training) => (
                  <option key={training.id} value={training.id}>
                    {training.title}
                  </option>
                ))}
              </Select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              <span>Session</span>
              <Select name="sessionId" defaultValue={sessionIdFilter || 'all'}>
                <option value="all">Toutes les sessions</option>
                {sessionOptions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.label}
                  </option>
                ))}
              </Select>
            </label>

            <div className="flex flex-wrap items-end gap-3">
              <Button type="submit">Filtrer</Button>
              <Link href="/admin/registrations" className={buttonVariants({ variant: 'outline' })}>
                Réinitialiser
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Inscriptions</CardTitle>
              <CardDescription>
                {meta.total} demande{meta.total > 1 ? 's' : ''} • page {meta.page} sur {meta.totalPages}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Participant</th>
                  <th className="px-4 py-3">Formation</th>
                  <th className="px-4 py-3">Session</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Soumise le</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white align-top text-slate-600">
                {registrations.map((registration) => (
                  <tr key={registration.id}>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{registration.fullName}</p>
                      <p>{registration.jobTitle || 'Poste non renseigné'}</p>
                      <p>{registration.company || 'Entreprise non renseignée'}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-900">{registration.session?.program?.title || 'Formation inconnue'}</td>
                    <td className="px-4 py-4">{getRegistrationSessionLabel(registration)}</td>
                    <td className="px-4 py-4">
                      <p>{registration.email}</p>
                      <p>{registration.phone || '—'}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatDateTime(getRecordDate(registration, 'createdAt'))}</td>
                    <td className="max-w-xs px-4 py-4">
                      <p className="whitespace-normal break-words">{registration.message || '—'}</p>
                    </td>
                    <td className="px-4 py-4">
                      <AdminStatusBadge status={registration.status} />
                    </td>
                    <td className="px-4 py-4">
                      <form action={updateRegistrationStatusAction} className="flex min-w-52 flex-col gap-2">
                        <input type="hidden" name="id" value={registration.id} />
                        <Select name="status" defaultValue={registration.status}>
                          {registrationStatuses.map((status) => (
                            <option key={status} value={status}>
                              {registrationStatusLabels[status] || status}
                            </option>
                          ))}
                        </Select>
                        <Button type="submit" size="sm">Mettre à jour</Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!registrations.length ? <p className="text-sm text-slate-500">Aucune demande d’inscription disponible pour ces filtres.</p> : null}

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Affichage de {(meta.page - 1) * meta.limit + (registrations.length ? 1 : 0)} à {(meta.page - 1) * meta.limit + registrations.length} sur {meta.total}
            </p>
            <div className="flex items-center gap-3">
              {meta.page > 1 ? (
                <Link href={buildPageHref(Math.max(meta.page - 1, 1), filters)} className={buttonVariants({ variant: 'outline' })}>
                  Précédent
                </Link>
              ) : (
                <span className={cn(buttonVariants({ variant: 'outline' }), 'cursor-not-allowed opacity-50')}>
                  Précédent
                </span>
              )}
              <span className="text-sm font-medium text-slate-700">Page {meta.page} / {meta.totalPages}</span>
              {meta.page < meta.totalPages ? (
                <Link href={buildPageHref(Math.min(meta.page + 1, meta.totalPages), filters)} className={buttonVariants({ variant: 'outline' })}>
                  Suivant
                </Link>
              ) : (
                <span className={cn(buttonVariants({ variant: 'outline' }), 'cursor-not-allowed opacity-50')}>
                  Suivant
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegistrationsAdminPage;