import { Archive, CalendarDays, Eye, FileText, GraduationCap, Layers3, Sparkles } from 'lucide-react';
import { createTrainingAction, deleteTrainingAction, updateTrainingAction } from '@/app/admin/actions';
import { AdminField } from '@/components/admin/admin-field';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { listAdminTrainings } from '@/lib/admin-api';
import { formatMoney } from '@/lib/admin-format';

const deliveryModes = ['onsite', 'online', 'hybrid'];
const trainingStatuses = ['draft', 'published', 'archived'];
const deliveryModeLabels = {
  onsite: 'Présentiel',
  online: 'En ligne',
  hybrid: 'Hybride',
};
const trainingStatusLabels = {
  draft: 'Brouillon',
  published: 'Publié',
  archived: 'Archivé',
};

const overviewIcons = {
  total: Layers3,
  published: Eye,
  draft: FileText,
  archived: Archive,
};

function getVisibilityLabel(status) {
  if (status === 'published') return 'Visible sur le site public';
  if (status === 'draft') return 'Masquée tant que la formation n’est pas publiée';
  return 'Archivée et retirée du catalogue public';
}

async function TrainingsAdminPage() {
  let trainings = [];
  let loadError = null;

  try {
    const payload = await listAdminTrainings();
    trainings = payload.data || [];
  } catch (error) {
    loadError = error.message || 'Impossible de charger les formations.';
  }

  const publishedCount = trainings.filter((training) => training.status === 'published').length;
  const draftCount = trainings.filter((training) => training.status === 'draft').length;
  const archivedCount = trainings.filter((training) => training.status === 'archived').length;
  const totalSessions = trainings.reduce((total, training) => total + (training.sessions?.length || 0), 0);
  const overviewCards = [
    { key: 'total', label: 'Programmes', value: trainings.length, note: `${totalSessions} session(s) planifiée(s)` },
    { key: 'published', label: 'Publiées', value: publishedCount, note: 'Visibles sur le site public' },
    { key: 'draft', label: 'Brouillons', value: draftCount, note: 'À relire avant publication' },
    { key: 'archived', label: 'Archivées', value: archivedCount, note: 'Conservées hors catalogue' },
  ];

  if (loadError) {
    return (
      <div className="space-y-8">
        <AdminPageHeader title="Gestion des formations" description="Gérez le catalogue de formations affiché sur le site AMENA CONSULTING." />
        <Card>
          <CardHeader>
            <CardTitle>Backend indisponible</CardTitle>
            <CardDescription>{loadError}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Démarrez le serveur backend puis actualisez cette page pour charger les formations et activer les actions d’administration.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Gestion des formations" description="Gérez le catalogue de formations affiché sur le site AMENA CONSULTING." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((item) => {
          const Icon = overviewIcons[item.key];

          return (
            <Card key={item.key} className="overflow-hidden border-brand-gray-modern/20 bg-white shadow-sm">
              <CardContent className="flex items-start justify-between gap-4 p-5">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">{item.label}</p>
                  <p className="text-3xl font-semibold tracking-tight text-brand-black">{item.value}</p>
                  <p className="text-sm text-brand-gray-dark">{item.note}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Card className="overflow-hidden border-brand-gray-modern/20 bg-white shadow-sm">
            <div className="border-b border-brand-gray-modern/15 bg-[radial-gradient(circle_at_top_left,rgba(196,22,28,0.12),transparent_38%),linear-gradient(180deg,#ffffff_0%,#fff7f7_100%)]">
              <CardHeader className="space-y-4 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <Badge className="w-fit bg-brand-red/10 text-brand-red hover:bg-brand-red/10">
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Nouveau programme
                    </Badge>
                    <div className="space-y-1">
                      <CardTitle className="text-brand-black">Créer une formation</CardTitle>
                      <CardDescription className="max-w-xl text-brand-gray-dark">
                        Ajoutez un nouveau programme avec les modalités, le tarif et les informations de publication.
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-red shadow-sm ring-1 ring-brand-red/10">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-brand-gray-modern/15 bg-white/80 p-4 text-sm text-brand-gray-dark">
                    <p className="font-medium text-brand-black">Identité claire</p>
                    <p className="mt-1">Titre, slug et résumé servent de base au catalogue public.</p>
                  </div>
                  <div className="rounded-2xl border border-brand-gray-modern/15 bg-white/80 p-4 text-sm text-brand-gray-dark">
                    <p className="font-medium text-brand-black">Publication maîtrisée</p>
                    <p className="mt-1">Choisissez <span className="font-semibold text-brand-red">Publié</span> pour rendre la formation visible.</p>
                  </div>
                </div>
              </CardHeader>
            </div>

            <CardContent className="pt-6">
              <form action={createTrainingAction} className="space-y-6">
                <div className="space-y-4 rounded-2xl border border-brand-gray-modern/15 bg-white p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">Contenu principal</p>
                    <p className="mt-1 text-sm text-brand-gray-dark">Renseignez les informations éditoriales qui seront visibles dans la fiche formation.</p>
                  </div>

                  <AdminField label="Titre">
                    <Input name="title" required placeholder="Ex. Contrôle budgétaire et performance" />
                  </AdminField>
                  <AdminField label="Slug" description="Laissez vide pour le générer automatiquement à partir du titre.">
                    <Input name="slug" placeholder="controle-budgetaire-et-performance" />
                  </AdminField>
                  <AdminField label="Résumé" description="Texte court affiché dans les cartes et extraits.">
                    <Textarea name="summary" rows={3} className="min-h-[110px]" />
                  </AdminField>
                  <AdminField label="Description" description="Présentez les objectifs, bénéfices et déroulé global du programme.">
                    <Textarea name="description" rows={8} required className="min-h-[180px]" />
                  </AdminField>
                  <AdminField label="Public cible">
                    <Textarea name="audience" rows={3} className="min-h-[110px]" />
                  </AdminField>
                </div>

                <div className="space-y-4 rounded-2xl border border-brand-gray-modern/15 bg-brand-gray-modern/5 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">Diffusion et tarification</p>
                    <p className="mt-1 text-sm text-brand-gray-dark">Définissez le mode, la durée et le niveau de prix de la formation.</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Mode de diffusion">
                      <Select name="deliveryMode" defaultValue="onsite">
                        {deliveryModes.map((mode) => (
                          <option key={mode} value={mode}>
                            {deliveryModeLabels[mode] || mode}
                          </option>
                        ))}
                      </Select>
                    </AdminField>
                    <AdminField label="Durée">
                      <Input name="durationText" placeholder="2 jours" />
                    </AdminField>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <AdminField label="Prix">
                      <Input name="price" type="number" step="0.01" min="0" placeholder="490" />
                    </AdminField>
                    <AdminField label="Devise">
                      <Input name="currency" defaultValue="USD" maxLength={3} />
                    </AdminField>
                    <AdminField label="Statut">
                      <Select name="status" defaultValue="draft">
                        {trainingStatuses.map((status) => (
                          <option key={status} value={status}>
                            {trainingStatusLabels[status] || status}
                          </option>
                        ))}
                      </Select>
                    </AdminField>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-brand-gray-modern/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-brand-gray-dark">Astuce : publiez uniquement les formations prêtes à être visibles sur le site public.</p>
                  <Button type="submit" size="lg" className="sm:min-w-[220px]">
                    Créer la formation
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-brand-gray-modern/20 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
                  <Eye className="h-5 w-5" />
                </div>
                <div className="space-y-1 text-sm text-brand-gray-dark">
                  <p className="font-semibold text-brand-black">Rappel de visibilité publique</p>
                  <p>Les visiteurs du site ne voient que les formations dont le statut est <span className="font-semibold text-brand-red">Publié</span>.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-3 rounded-[1.5rem] border border-brand-gray-modern/20 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-brand-black">Catalogue existant</h2>
              <p className="text-sm text-brand-gray-dark">Modifiez rapidement le contenu, le tarif et la visibilité de chaque programme.</p>
            </div>
            <Badge className="w-fit bg-brand-gray-modern/10 text-brand-black hover:bg-brand-gray-modern/10">
              {trainings.length} formation(s)
            </Badge>
          </div>

          {trainings.map((training) => {
            const sessionsCount = training.sessions?.length || 0;
            const deliveryLabel = deliveryModeLabels[training.deliveryMode] || training.deliveryMode;

            return (
              <Card key={training.id} className="overflow-hidden border-brand-gray-modern/20 bg-white shadow-sm">
                <CardHeader className="border-b border-brand-gray-modern/15 bg-[linear-gradient(180deg,#ffffff_0%,#fcfcfc_100%)] pb-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <AdminStatusBadge status={training.status} />
                        <Badge className="bg-brand-red/10 text-brand-red hover:bg-brand-red/10">{deliveryLabel}</Badge>
                        <Badge className="bg-brand-gray-modern/10 text-brand-black hover:bg-brand-gray-modern/10">
                          {sessionsCount ? `${sessionsCount} session(s)` : 'Aucune session'}
                        </Badge>
                      </div>

                      <div>
                        <CardTitle className="text-brand-black">{training.title}</CardTitle>
                        <CardDescription className="mt-2 break-all font-mono text-xs text-brand-gray-dark">{training.slug}</CardDescription>
                      </div>
                    </div>

                    <div className="grid min-w-full gap-3 sm:min-w-[280px] sm:grid-cols-2 xl:min-w-[320px]">
                      <div className="rounded-2xl border border-brand-gray-modern/15 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">Tarif</p>
                        <p className="mt-1 text-lg font-semibold text-brand-black">{formatMoney(training.price, training.currency)}</p>
                      </div>
                      <div className="rounded-2xl border border-brand-gray-modern/15 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">Durée</p>
                        <p className="mt-1 text-lg font-semibold text-brand-black">{training.durationText || 'À définir'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 pt-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <p className="text-sm leading-6 text-brand-gray-dark">
                      {training.summary || 'Ajoutez un résumé pour clarifier la promesse et améliorer la lisibilité du catalogue public.'}
                    </p>
                    <div className="flex items-center gap-2 rounded-full bg-brand-gray-modern/10 px-4 py-2 text-xs font-medium text-brand-gray-dark">
                      <CalendarDays className="h-4 w-4 text-brand-red" />
                      {getVisibilityLabel(training.status)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                  <form action={updateTrainingAction} className="space-y-6">
                    <input type="hidden" name="id" value={training.id} />

                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                      <div className="space-y-4 rounded-2xl border border-brand-gray-modern/15 bg-white p-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">Contenu éditorial</p>
                          <p className="mt-1 text-sm text-brand-gray-dark">Mettez à jour l’intitulé, le résumé et la présentation du programme.</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <AdminField label="Titre">
                            <Input name="title" defaultValue={training.title} required />
                          </AdminField>
                          <AdminField label="Slug">
                            <Input name="slug" defaultValue={training.slug} />
                          </AdminField>
                        </div>

                        <AdminField label="Résumé">
                          <Textarea name="summary" rows={3} className="min-h-[110px]" defaultValue={training.summary || ''} />
                        </AdminField>

                        <AdminField label="Description">
                          <Textarea name="description" rows={7} className="min-h-[170px]" defaultValue={training.description || ''} required />
                        </AdminField>

                        <AdminField label="Public cible">
                          <Textarea name="audience" rows={3} className="min-h-[110px]" defaultValue={training.audience || ''} />
                        </AdminField>
                      </div>

                      <div className="space-y-4 rounded-2xl border border-brand-gray-modern/15 bg-brand-gray-modern/5 p-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">Paramètres de publication</p>
                          <p className="mt-1 text-sm text-brand-gray-dark">Ajustez la diffusion, la durée, le prix et la visibilité publique.</p>
                        </div>

                        <AdminField label="Mode de diffusion">
                          <Select name="deliveryMode" defaultValue={training.deliveryMode}>
                            {deliveryModes.map((mode) => (
                              <option key={mode} value={mode}>
                                {deliveryModeLabels[mode] || mode}
                              </option>
                            ))}
                          </Select>
                        </AdminField>

                        <AdminField label="Durée">
                          <Input name="durationText" defaultValue={training.durationText || ''} placeholder="2 jours" />
                        </AdminField>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                          <AdminField label="Prix">
                            <Input name="price" type="number" step="0.01" min="0" defaultValue={training.price || ''} />
                          </AdminField>
                          <AdminField label="Devise">
                            <Input name="currency" defaultValue={training.currency || 'USD'} maxLength={3} />
                          </AdminField>
                        </div>

                        <AdminField label="Statut" description={getVisibilityLabel(training.status)}>
                          <Select name="status" defaultValue={training.status}>
                            {trainingStatuses.map((status) => (
                              <option key={status} value={status}>
                                {trainingStatusLabels[status] || status}
                              </option>
                            ))}
                          </Select>
                        </AdminField>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-brand-gray-modern/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-brand-gray-dark">Pensez à publier la formation une fois le contenu validé et les informations tarifaires relues.</p>
                      <div className="flex flex-wrap gap-3">
                        <Button type="submit">Enregistrer les modifications</Button>
                        <Button form={`delete-training-${training.id}`} type="submit" variant="outline" className="border-brand-red/20 text-brand-red hover:bg-brand-red/5 hover:text-brand-red-dark">
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </form>

                  <form id={`delete-training-${training.id}`} action={deleteTrainingAction}>
                    <input type="hidden" name="id" value={training.id} />
                  </form>
                </CardContent>
              </Card>
            );
          })}

          {!trainings.length ? (
            <Card className="border-dashed border-brand-gray-modern/30 bg-white shadow-sm">
              <CardContent className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-brand-black">Aucune formation disponible pour le moment</p>
                  <p className="text-sm text-brand-gray-dark">Commencez par créer votre premier programme dans le panneau de gauche.</p>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TrainingsAdminPage;