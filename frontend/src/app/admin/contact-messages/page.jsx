import { deleteContactMessageAction, updateContactMessageAction } from '@/app/admin/actions';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { listAdminContactMessages } from '@/lib/admin-api';
import { formatDateTime, getRecordDate } from '@/lib/admin-format';

const messageStatuses = ['new', 'read', 'replied', 'archived'];
const messageStatusLabels = {
  new: 'Nouveau',
  read: 'Lu',
  replied: 'Répondu',
  archived: 'Archivé',
};

async function ContactMessagesAdminPage() {
  const payload = await listAdminContactMessages();
  const messages = payload.data || [];

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Messages de contact" description="Suivez les demandes entrantes, marquez leur avancement et archivez les échanges terminés." />

      <div className="space-y-6">
        {messages.map((message) => (
          <Card key={message.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>{message.subject}</CardTitle>
                  <CardDescription>
                    {message.fullName} • {message.email} • {formatDateTime(getRecordDate(message, 'createdAt'))}
                  </CardDescription>
                </div>
                <AdminStatusBadge status={message.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Téléphone :</span> {message.phone || '—'}</p>
                <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Entreprise :</span> {message.company || '—'}</p>
                <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Assigné à :</span> {message.assignedUser?.fullName || 'Non assigné'}</p>
                <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Statut :</span> {messageStatusLabels[message.status] || message.status}</p>
              </div>

              <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">{message.message}</p>

              <div className="flex flex-wrap gap-3">
                <form action={updateContactMessageAction} className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="id" value={message.id} />
                  <label className="flex min-w-52 flex-col gap-2 text-sm font-medium text-slate-700">
                    <span>Statut</span>
                    <Select name="status" defaultValue={message.status}>
                      {messageStatuses.map((status) => (
                        <option key={status} value={status}>
                          {messageStatusLabels[status] || status}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <Button type="submit">Mettre à jour le statut</Button>
                </form>

                <form action={deleteContactMessageAction}>
                  <input type="hidden" name="id" value={message.id} />
                  <Button type="submit" variant="outline">
                    Supprimer
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
        {!messages.length ? <p className="text-sm text-slate-500">Aucun message de contact disponible.</p> : null}
      </div>
    </div>
  );
}

export default ContactMessagesAdminPage;