import { createTeamMemberAction, deleteTeamMemberAction, updateTeamMemberAction } from '@/app/admin/actions';
import { AdminField } from '@/components/admin/admin-field';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { listAdminTeamMembers } from '@/lib/admin-api';
import { formatDateTime, getRecordDate } from '@/lib/admin-format';

function getFullName(member) {
  return [member.firstName, member.lastName].filter(Boolean).join(' ');
}

function VisibilityBadge({ isActive }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        isActive ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
      ].join(' ')}
    >
      {isActive ? 'Visible sur le site' : 'Masqué'}
    </span>
  );
}

async function TeamAdminPage() {
  const payload = await listAdminTeamMembers();
  const teamMembers = payload.data || [];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Gestion de l’équipe"
        description="Ajoutez, modifiez et supprimez les membres affichés sur l’accueil et la page À propos, avec photo, poste et courte présentation."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Ajouter un membre</CardTitle>
            <CardDescription>Renseignez les informations publiques du collaborateur et uploadez sa photo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createTeamMemberAction} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Prénom">
                  <Input name="firstName" required />
                </AdminField>
                <AdminField label="Nom">
                  <Input name="lastName" required />
                </AdminField>
              </div>

              <AdminField label="Poste">
                <Input name="jobTitle" required placeholder="Directrice conseil, CFO advisor..." />
              </AdminField>

              <AdminField label="Brève description">
                <Textarea name="shortDescription" rows={5} required />
              </AdminField>

              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Photo du membre" description="Formats acceptés : JPG, PNG, WEBP, GIF, AVIF – 5 MB max.">
                  <Input name="photoFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" required />
                </AdminField>

                <AdminField label="Ordre d’affichage" description="Les plus petits nombres apparaissent en premier.">
                  <Input name="sortOrder" type="number" min="0" defaultValue="0" />
                </AdminField>
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                <input type="checkbox" name="isActive" defaultChecked className="h-4 w-4 rounded border-slate-300" />
                <span>Afficher ce membre sur le site public</span>
              </label>

              <Button type="submit">Ajouter le membre</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{getFullName(member)}</CardTitle>
                    <CardDescription>{member.jobTitle}</CardDescription>
                  </div>
                  <VisibilityBadge isActive={member.isActive} />
                </div>
                <p className="text-xs text-slate-500">Dernière mise à jour le {formatDateTime(getRecordDate(member, 'updatedAt'))}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {member.photoUrl ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <img src={member.photoUrl} alt={getFullName(member)} className="h-56 w-full object-cover" />
                  </div>
                ) : null}

                <form action={updateTeamMemberAction} className="space-y-4">
                  <input type="hidden" name="id" value={member.id} />
                  <input type="hidden" name="existingPhotoUrl" value={member.photoUrl || ''} />

                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Prénom">
                      <Input name="firstName" defaultValue={member.firstName} required />
                    </AdminField>
                    <AdminField label="Nom">
                      <Input name="lastName" defaultValue={member.lastName} required />
                    </AdminField>
                  </div>

                  <AdminField label="Poste">
                    <Input name="jobTitle" defaultValue={member.jobTitle} required />
                  </AdminField>

                  <AdminField label="Brève description">
                    <Textarea name="shortDescription" rows={5} defaultValue={member.shortDescription || ''} required />
                  </AdminField>

                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Remplacer la photo">
                      <Input name="photoFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" />
                    </AdminField>

                    <AdminField label="Ordre d’affichage">
                      <Input name="sortOrder" type="number" min="0" defaultValue={member.sortOrder ?? 0} />
                    </AdminField>
                  </div>

                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                    <input type="checkbox" name="isActive" defaultChecked={member.isActive} className="h-4 w-4 rounded border-slate-300" />
                    <span>Afficher ce membre sur le site public</span>
                  </label>

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit">Enregistrer les modifications</Button>
                  </div>
                </form>

                <form action={deleteTeamMemberAction}>
                  <input type="hidden" name="id" value={member.id} />
                  <Button type="submit" variant="outline">
                    Supprimer
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}

          {!teamMembers.length ? <p className="text-sm text-slate-500">Aucun membre d’équipe n’a encore été ajouté.</p> : null}
        </div>
      </div>
    </div>
  );
}

export default TeamAdminPage;