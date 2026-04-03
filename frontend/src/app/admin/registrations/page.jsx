import { updateRegistrationStatusAction } from '@/app/admin/actions';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { listAdminRegistrations } from '@/lib/admin-api';
import { formatDateTime, getRecordDate } from '@/lib/admin-format';

const registrationStatuses = ['pending', 'confirmed', 'cancelled'];
const registrationStatusLabels = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
};

async function RegistrationsAdminPage() {
  const payload = await listAdminRegistrations();
  const registrations = payload.data || [];

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Liste des inscriptions" description="Examinez les demandes des participants, confirmez les inscriptions et maintenez les statuts à jour." />

      <div className="space-y-6">
        {registrations.map((registration) => (
          <Card key={registration.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>{registration.fullName}</CardTitle>
                  <CardDescription>
                    {registration.session?.program?.title || 'Formation inconnue'} • {registration.session?.sessionTitle || 'Session inconnue'}
                  </CardDescription>
                </div>
                <AdminStatusBadge status={registration.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">E-mail :</span> {registration.email}</p>
                <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Téléphone :</span> {registration.phone || '—'}</p>
                <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Entreprise :</span> {registration.company || '—'}</p>
                <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Soumise le :</span> {formatDateTime(getRecordDate(registration, 'createdAt'))}</p>
              </div>

              {registration.message ? <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">{registration.message}</p> : null}

              <form action={updateRegistrationStatusAction} className="flex flex-wrap items-end gap-3">
                <input type="hidden" name="id" value={registration.id} />
                <label className="flex min-w-52 flex-col gap-2 text-sm font-medium text-slate-700">
                  <span>Statut</span>
                  <Select name="status" defaultValue={registration.status}>
                    {registrationStatuses.map((status) => (
                      <option key={status} value={status}>
                        {registrationStatusLabels[status] || status}
                      </option>
                    ))}
                  </Select>
                </label>
                <Button type="submit">Mettre à jour le statut</Button>
              </form>
            </CardContent>
          </Card>
        ))}
        {!registrations.length ? <p className="text-sm text-slate-500">Aucune demande d’inscription disponible.</p> : null}
      </div>
    </div>
  );
}

export default RegistrationsAdminPage;