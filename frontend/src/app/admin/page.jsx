import Link from 'next/link';
import { ArrowRight, CalendarDays, ClipboardList, GraduationCap, Mail, Newspaper, Tags } from 'lucide-react';
import { updateCompanySettingsAction, updateSiteContentAction } from '@/app/admin/actions';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { SiteContentEditor } from '@/components/admin/site-content-editor';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  getAdminCompanyProfile,
  listAdminArticles,
  listAdminCategories,
  listAdminContactMessages,
  listAdminRegistrations,
  listAdminTrainings,
} from '@/lib/admin-api';
import { formatDateTime, getRecordDate } from '@/lib/admin-format';
import { getSiteCopy } from '@/lib/site-copy';

function getSearchParamValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

async function AdminDashboardPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const companySettingsStatus = getSearchParamValue(resolvedSearchParams.companySettings);
  const companySettingsMessage = getSearchParamValue(resolvedSearchParams.message);
  const siteContentStatus = getSearchParamValue(resolvedSearchParams.siteContent);
  const siteContentMessage = getSearchParamValue(resolvedSearchParams.siteContentMessage);
  const [articlesPayload, categoriesPayload, trainingsPayload, registrationsPayload, contactPayload, companyProfilePayload, siteCopyFr, siteCopyEn] = await Promise.all([
    listAdminArticles(),
    listAdminCategories(),
    listAdminTrainings(),
    listAdminRegistrations(),
    listAdminContactMessages(),
    getAdminCompanyProfile(),
    getSiteCopy('fr'),
    getSiteCopy('en'),
  ]);

  const articles = articlesPayload.data || [];
  const categories = categoriesPayload.data || [];
  const trainings = trainingsPayload.data || [];
  const registrations = registrationsPayload.data || [];
  const contactMessages = contactPayload.data || [];
  const companyProfile = companyProfilePayload.data || {};
  const sessionsCount = trainings.reduce((total, training) => total + (training.sessions?.length || 0), 0);
  const companySettingsFeedback =
    companySettingsStatus === 'success'
      ? {
          title: 'Coordonnées mises à jour',
          message: companySettingsMessage || 'Les informations publiques ont bien été enregistrées.',
          className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        }
      : companySettingsStatus === 'error'
        ? {
            title: 'Mise à jour impossible',
            message: companySettingsMessage || 'Une erreur est survenue lors de l’enregistrement.',
            className: 'border-brand-red/20 bg-brand-red/5 text-brand-red-dark',
          }
        : null;
  const siteContentFeedback =
    siteContentStatus === 'success'
      ? {
          title: 'Contenu éditorial mis à jour',
          message: siteContentMessage || 'Les textes du site ont bien été enregistrés.',
          className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        }
      : siteContentStatus === 'error'
        ? {
            title: 'Mise à jour impossible',
            message: siteContentMessage || 'Une erreur est survenue lors de l’enregistrement du contenu éditorial.',
            className: 'border-brand-red/20 bg-brand-red/5 text-brand-red-dark',
          }
        : null;

  const summaries = [
    {
      label: 'Articles',
      value: articlesPayload.meta?.total || articles.length,
      href: '/admin/articles',
      icon: Newspaper,
      tone: 'Publication de contenu',
    },
    {
      label: 'Catégories',
      value: categories.length,
      href: '/admin/categories',
      icon: Tags,
      tone: 'Structure de taxonomie',
    },
    {
      label: 'Formations',
      value: trainingsPayload.meta?.total || trainings.length,
      href: '/admin/trainings',
      icon: GraduationCap,
      tone: 'Catalogue des programmes',
    },
    {
      label: 'Sessions',
      value: sessionsCount,
      href: '/admin/sessions',
      icon: CalendarDays,
      tone: 'Planification',
    },
    {
      label: 'Inscriptions',
      value: registrationsPayload.meta?.total || registrations.length,
      href: '/admin/registrations',
      icon: ClipboardList,
      tone: 'Suivi des participants',
    },
    {
      label: 'Messages de contact',
      value: contactPayload.meta?.total || contactMessages.length,
      href: '/admin/contact-messages',
      icon: Mail,
      tone: 'Demandes entrantes',
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Vue d’ensemble"
        description="Suivez les contenus, les formations, les inscriptions et l’activité de contact depuis un espace sécurisé unique."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaries.map((item) => (
          <Card key={item.label} className="rounded-[1.5rem] border border-brand-gray-modern/25 bg-white shadow-sm transition-shadow hover:shadow-corporate">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription className="text-brand-gray-dark">{item.label}</CardDescription>
                  <CardTitle className="mt-2 text-3xl text-brand-black">{item.value}</CardTitle>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-brand-gray-dark">{item.tone}</p>
              <Link href={item.href} className="inline-flex items-center gap-2 text-sm font-medium text-brand-red hover:text-brand-red-dark">
                Ouvrir le module <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[1.75rem] border border-brand-gray-modern/25 bg-[#66666B] text-white shadow-sm">
          <CardHeader>
            <CardDescription className="text-brand-gray-modern">Statistiques du tableau de bord</CardDescription>
            <CardTitle className="text-white">Vue opérationnelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-gray-modern">Articles publiés</p>
                <p className="mt-3 text-3xl font-semibold text-white">{articles.filter((article) => article.status === 'published').length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-gray-modern">Sessions ouvertes</p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {trainings.reduce(
                    (total, training) => total + (training.sessions || []).filter((session) => session.status === 'open').length,
                    0
                  )}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-gray-modern">Nouvelles demandes</p>
                <p className="mt-3 text-3xl font-semibold text-white">{contactMessages.filter((message) => message.status === 'new').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border border-brand-gray-modern/25 bg-white shadow-sm">
          <CardHeader>
            <CardDescription className="text-brand-gray-dark">État de l’espace</CardDescription>
            <CardTitle className="text-brand-black">Priorités administratives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-brand-gray-dark">
            <div className="rounded-2xl bg-brand-red/8 p-4">
              <p className="font-medium text-brand-black">Gestion des contenus</p>
              <p className="mt-1">Gérez les contenus éditoriaux, les catégories et la cohérence de publication sur l’ensemble du site.</p>
            </div>
            <div className="rounded-2xl bg-brand-gray-modern/10 p-4">
              <p className="font-medium text-brand-black">Gestion des formations</p>
              <p className="mt-1">Suivez les programmes, les sessions et les inscriptions entrantes depuis une interface unique.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[1.75rem] border border-brand-gray-modern/25 bg-white shadow-sm">
        <CardHeader>
          <CardDescription className="text-brand-gray-dark">Coordonnées publiques de la société</CardDescription>
          <CardTitle className="text-brand-black">Informations affichées sur le site</CardTitle>
        </CardHeader>
        <CardContent>
          {companySettingsFeedback ? (
            <div className={`mb-6 rounded-2xl border px-4 py-3 ${companySettingsFeedback.className}`}>
              <p className="text-sm font-semibold">{companySettingsFeedback.title}</p>
              <p className="mt-1 text-sm">{companySettingsFeedback.message}</p>
            </div>
          ) : null}

          <form action={updateCompanySettingsAction} className="space-y-6">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <label htmlFor="address" className="mb-2 block text-sm font-medium text-brand-black">
                  Adresse
                </label>
                <Textarea
                  id="address"
                  name="address"
                  defaultValue={companyProfile.address || ''}
                  placeholder="Cocody Angré, Abidjan, Côte d’Ivoire"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-brand-black">
                  Email
                </label>
                <Input id="email" name="email" type="email" defaultValue={companyProfile.email || ''} placeholder="amena.cons@gmail.com" />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-brand-black">
                  Téléphone
                </label>
                <Input id="phone" name="phone" defaultValue={companyProfile.phone || ''} placeholder="+225 07 49 64 40 55 / +225 27 24 18 77" />
              </div>

              <div>
                <label htmlFor="websiteUrl" className="mb-2 block text-sm font-medium text-brand-black">
                  URL du site
                </label>
                <Input id="websiteUrl" name="websiteUrl" type="url" defaultValue={companyProfile.websiteUrl || ''} placeholder="https://www.amena-consulting.com" />
              </div>

              <div>
                <label htmlFor="linkedinUrl" className="mb-2 block text-sm font-medium text-brand-black">
                  LinkedIn
                </label>
                <Input id="linkedinUrl" name="linkedinUrl" type="url" defaultValue={companyProfile.linkedinUrl || ''} placeholder="https://www.linkedin.com/company/..." />
              </div>

              <div>
                <label htmlFor="facebookUrl" className="mb-2 block text-sm font-medium text-brand-black">
                  Facebook
                </label>
                <Input id="facebookUrl" name="facebookUrl" type="url" defaultValue={companyProfile.facebookUrl || ''} placeholder="https://www.facebook.com/..." />
              </div>

              <div>
                <label htmlFor="instagramUrl" className="mb-2 block text-sm font-medium text-brand-black">
                  Instagram
                </label>
                <Input id="instagramUrl" name="instagramUrl" type="url" defaultValue={companyProfile.instagramUrl || ''} placeholder="https://www.instagram.com/..." />
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl bg-brand-gray-modern/10 p-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-brand-gray-dark">
                Ces informations sont utilisées dans le footer, la page contact et les métadonnées publiques du site.
              </p>
              <button type="submit" className="btn-brand-primary whitespace-nowrap">
                Enregistrer les coordonnées
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem] border border-brand-gray-modern/25 bg-white shadow-sm">
        <CardHeader>
          <CardDescription className="text-brand-gray-dark">Contenus éditoriaux multilingues</CardDescription>
          <CardTitle className="text-brand-black">Site copy modifiable en base de données</CardTitle>
        </CardHeader>
        <CardContent>
          {siteContentFeedback ? (
            <div className={`mb-6 rounded-2xl border px-4 py-3 ${siteContentFeedback.className}`}>
              <p className="text-sm font-semibold">{siteContentFeedback.title}</p>
              <p className="mt-1 text-sm">{siteContentFeedback.message}</p>
            </div>
          ) : null}

          <SiteContentEditor action={updateSiteContentAction} siteCopyFr={siteCopyFr} siteCopyEn={siteCopyEn} />
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[1.75rem] border border-brand-gray-modern/25 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-brand-black">Inscriptions récentes</CardTitle>
            <CardDescription className="text-brand-gray-dark">Dernières demandes de participation envoyées depuis les formulaires publics de formation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {registrations.slice(0, 5).map((registration) => (
              <div key={registration.id} className="rounded-2xl border border-brand-gray-modern/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-brand-black">{registration.fullName}</p>
                    <p className="text-sm text-brand-gray-dark">{registration.session?.program?.title || 'Programme inconnu'}</p>
                  </div>
                  <AdminStatusBadge status={registration.status} />
                </div>
                <p className="mt-3 text-sm text-brand-gray-dark">{registration.email}</p>
                <p className="mt-1 text-xs text-brand-gray-dark">Soumise le {formatDateTime(getRecordDate(registration, 'createdAt'))}</p>
              </div>
            ))}
            {!registrations.length ? <p className="text-sm text-brand-gray-dark">Aucune inscription pour le moment.</p> : null}
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border border-brand-gray-modern/25 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-brand-black">Messages de contact récents</CardTitle>
            <CardDescription className="text-brand-gray-dark">Suivez les nouvelles demandes et leur état de traitement.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contactMessages.slice(0, 5).map((message) => (
              <div key={message.id} className="rounded-2xl border border-brand-gray-modern/25 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-brand-black">{message.subject}</p>
                    <p className="text-sm text-brand-gray-dark">{message.fullName}</p>
                  </div>
                  <AdminStatusBadge status={message.status} />
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-brand-gray-dark">{message.message}</p>
                <p className="mt-1 text-xs text-brand-gray-dark">Reçu le {formatDateTime(getRecordDate(message, 'createdAt'))}</p>
              </div>
            ))}
            {!contactMessages.length ? <p className="text-sm text-brand-gray-dark">Aucun message de contact pour le moment.</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboardPage;