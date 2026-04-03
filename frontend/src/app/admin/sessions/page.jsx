import { createSessionAction, deleteSessionAction, updateSessionAction } from '@/app/admin/actions';
import { AdminField } from '@/components/admin/admin-field';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { listAdminTrainings } from '@/lib/admin-api';
import { formatDateTime, toDateTimeLocal } from '@/lib/admin-format';

const sessionStatuses = ['open', 'closed', 'completed', 'cancelled'];
const sessionStatusLabels = {
  open: 'Ouvert',
  closed: 'Fermé',
  completed: 'Terminé',
  cancelled: 'Annulé',
};

async function SessionsAdminPage() {
  const payload = await listAdminTrainings();
  const trainings = payload.data || [];
  const sessions = trainings
    .flatMap((training) =>
      (training.sessions || []).map((session) => ({
        ...session,
        programTitle: training.title,
        programId: training.id,
      }))
    )
    .sort((left, right) => new Date(left.startDate).getTime() - new Date(right.startDate).getTime());

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Gestion des sessions" description="Planifiez les dates, les capacités et le statut d’inscription pour chaque programme de formation." />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Créer une session</CardTitle>
            <CardDescription>Rattachez une nouvelle session à un programme de formation et publiez la période d’inscription.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createSessionAction} className="space-y-4">
              <AdminField label="Programme de formation">
                <Select name="programId" defaultValue={trainings[0]?.id ? String(trainings[0].id) : ''} required>
                  {trainings.map((training) => (
                    <option key={training.id} value={training.id}>
                      {training.title}
                    </option>
                  ))}
                </Select>
              </AdminField>

              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Titre de la session">
                  <Input name="sessionTitle" required />
                </AdminField>
                <AdminField label="Code de session">
                  <Input name="sessionCode" />
                </AdminField>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Date de début">
                  <Input name="startDate" type="datetime-local" required />
                </AdminField>
                <AdminField label="Date de fin">
                  <Input name="endDate" type="datetime-local" required />
                </AdminField>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <AdminField label="Lieu">
                  <Input name="location" />
                </AdminField>
                <AdminField label="Capacité">
                  <Input name="capacity" type="number" min="1" defaultValue="1" />
                </AdminField>
                <AdminField label="Statut">
                  <Select name="status" defaultValue="open">
                    {sessionStatuses.map((status) => (
                      <option key={status} value={status}>
                        {sessionStatusLabels[status] || status}
                      </option>
                    ))}
                  </Select>
                </AdminField>
              </div>

              <AdminField label="Date limite d’inscription">
                <Input name="registrationDeadline" type="datetime-local" />
              </AdminField>

              <Button type="submit" disabled={!trainings.length}>
                Créer la session
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle>{session.sessionTitle}</CardTitle>
                    <CardDescription>
                      {session.programTitle} • {session.location || 'Lieu à définir'} • capacité {session.capacity}
                    </CardDescription>
                  </div>
                  <AdminStatusBadge status={session.status} />
                </div>
                <p className="text-xs text-slate-500">
                  {formatDateTime(session.startDate)} → {formatDateTime(session.endDate)}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={updateSessionAction} className="space-y-4">
                  <input type="hidden" name="id" value={session.id} />

                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Titre de la session">
                      <Input name="sessionTitle" defaultValue={session.sessionTitle} required />
                    </AdminField>
                    <AdminField label="Code de session">
                      <Input name="sessionCode" defaultValue={session.sessionCode || ''} />
                    </AdminField>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Date de début">
                      <Input name="startDate" type="datetime-local" defaultValue={toDateTimeLocal(session.startDate)} required />
                    </AdminField>
                    <AdminField label="Date de fin">
                      <Input name="endDate" type="datetime-local" defaultValue={toDateTimeLocal(session.endDate)} required />
                    </AdminField>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <AdminField label="Lieu">
                      <Input name="location" defaultValue={session.location || ''} />
                    </AdminField>
                    <AdminField label="Capacité">
                      <Input name="capacity" type="number" min="1" defaultValue={session.capacity || 1} />
                    </AdminField>
                    <AdminField label="Statut">
                      <Select name="status" defaultValue={session.status}>
                        {sessionStatuses.map((status) => (
                          <option key={status} value={status}>
                            {sessionStatusLabels[status] || status}
                          </option>
                        ))}
                      </Select>
                    </AdminField>
                  </div>

                  <AdminField label="Date limite d’inscription">
                    <Input name="registrationDeadline" type="datetime-local" defaultValue={toDateTimeLocal(session.registrationDeadline)} />
                  </AdminField>

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit">Enregistrer les modifications</Button>
                  </div>
                </form>

                <form action={deleteSessionAction}>
                  <input type="hidden" name="id" value={session.id} />
                  <Button type="submit" variant="outline">
                    Supprimer
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
          {!sessions.length ? <p className="text-sm text-slate-500">Aucune session créée pour le moment.</p> : null}
        </div>
      </div>
    </div>
  );
}

export default SessionsAdminPage;