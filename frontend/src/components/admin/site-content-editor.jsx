import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const TEXTAREA = 'textarea';

const SITE_CONTENT_FORM_SECTIONS = [
  {
    key: 'global',
    title: 'Contenu global',
    description: 'Libellés transverses du site, navigation principale et page 404.',
    fields: [
      { path: 'companyDescription', label: 'Description société', type: TEXTAREA },
      { path: 'header.eyebrow', label: 'Header · Sur-titre' },
      { path: 'header.consultationCta', label: 'Header · Bouton consultation' },
      { path: 'header.mobileToggleLabel', label: 'Header · Label menu mobile' },
      ...['Accueil', 'À propos', 'Services', 'Actualités', 'Formations', 'Contact'].map((label, index) => ({ path: `navigation.${index}.label`, label: `Navigation · ${label}` })),
      ...['Stat 1', 'Stat 2', 'Stat 3', 'Stat 4'].flatMap((label, index) => [{ path: `stats.${index}.label`, label: `${label} · Libellé` }, { path: `stats.${index}.value`, label: `${label} · Valeur` }]),
      { path: 'language.label', label: 'Langue · Libellé' },
      { path: 'language.fr', label: 'Langue · FR' },
      { path: 'language.en', label: 'Langue · EN' },
      { path: 'notFound.title', label: '404 · Titre' },
      { path: 'notFound.description', label: '404 · Description', type: TEXTAREA },
      { path: 'notFound.cta', label: '404 · Bouton' },
    ],
  },
  {
    key: 'home',
    title: 'Accueil',
    description: 'Hero, focus, services, actualités et bloc formations de la page d’accueil.',
    fields: [
      { path: 'home.title', label: 'Hero · Titre', type: TEXTAREA },
      { path: 'home.description', label: 'Hero · Description', type: TEXTAREA },
      { path: 'home.primaryCta', label: 'Hero · Bouton principal' },
      { path: 'home.secondaryCta', label: 'Hero · Bouton secondaire' },
      { path: 'home.panelBadge', label: 'Panneau · Badge' },
      { path: 'home.panelTitle', label: 'Panneau · Titre', type: TEXTAREA },
      { path: 'home.panelDescription', label: 'Panneau · Description', type: TEXTAREA },
      ...[1, 2, 3].map((index) => ({ path: `home.highlights.${index - 1}`, label: `Highlights · Élément ${index}` })),
      ...[1, 2, 3].map((index) => ({ path: `home.priorities.${index - 1}`, label: `Priorités · Élément ${index}`, type: TEXTAREA })),
      { path: 'home.focusEyebrow', label: 'Axes · Sur-titre' },
      { path: 'home.focusAreas.0.title', label: 'Axe 1 · Titre' },
      { path: 'home.focusAreas.0.description', label: 'Axe 1 · Description', type: TEXTAREA },
      { path: 'home.focusAreas.1.title', label: 'Axe 2 · Titre' },
      { path: 'home.focusAreas.1.description', label: 'Axe 2 · Description', type: TEXTAREA },
      { path: 'home.servicesSection.eyebrow', label: 'Services accueil · Sur-titre' },
      { path: 'home.servicesSection.title', label: 'Services accueil · Titre', type: TEXTAREA },
      { path: 'home.servicesSection.description', label: 'Services accueil · Description', type: TEXTAREA },
      { path: 'home.servicesSection.cta', label: 'Services accueil · Bouton principal' },
      { path: 'home.servicesSection.itemCta', label: 'Services accueil · Bouton carte' },
      { path: 'home.servicesSection.whyEyebrow', label: 'Services accueil · Sur-titre pourquoi nous' },
      { path: 'home.servicesSection.whyDescription', label: 'Services accueil · Description pourquoi nous', type: TEXTAREA },
      { path: 'home.servicesSection.whyCta', label: 'Services accueil · Bouton pourquoi nous' },
      { path: 'home.insightsSection.eyebrow', label: 'Actualités accueil · Sur-titre' },
      { path: 'home.insightsSection.title', label: 'Actualités accueil · Titre', type: TEXTAREA },
      { path: 'home.insightsSection.description', label: 'Actualités accueil · Description', type: TEXTAREA },
      { path: 'home.insightsSection.cta', label: 'Actualités accueil · Bouton' },
      { path: 'home.insightsSection.defaultCategory', label: 'Actualités accueil · Catégorie par défaut' },
      { path: 'home.insightsSection.latestInsight', label: 'Actualités accueil · Dernière publication' },
      { path: 'home.insightsSection.readArticle', label: 'Actualités accueil · Lire l’article' },
      { path: 'home.trainingsSection.eyebrow', label: 'Formations accueil · Sur-titre' },
      { path: 'home.trainingsSection.title', label: 'Formations accueil · Titre', type: TEXTAREA },
      { path: 'home.trainingsSection.description', label: 'Formations accueil · Description', type: TEXTAREA },
      { path: 'home.trainingsSection.cta', label: 'Formations accueil · Bouton' },
      { path: 'home.trainingsSection.nextSession', label: 'Formations accueil · Prochaine session' },
      { path: 'home.trainingsSection.deliverySuffix', label: 'Formations accueil · Suffixe format' },
      { path: 'home.trainingsSection.viewProgram', label: 'Formations accueil · Voir le programme' },
      { path: 'home.trainingsSection.noTrainingsTitle', label: 'Formations accueil · Titre si vide' },
      { path: 'home.trainingsSection.noTrainingsDescription', label: 'Formations accueil · Description si vide', type: TEXTAREA },
    ],
  },
  {
    key: 'about',
    title: 'À propos',
    description: 'Titres, métadonnées, cartes éditoriales et raisons de confiance.',
    fields: [
      { path: 'about.metadataTitle', label: 'Méta · Titre' },
      { path: 'about.metadataDescription', label: 'Méta · Description', type: TEXTAREA },
      { path: 'about.eyebrow', label: 'Sur-titre' },
      { path: 'about.title', label: 'Titre', type: TEXTAREA },
      { path: 'about.description', label: 'Description', type: TEXTAREA },
      ...[1, 2, 3].flatMap((index) => [{ path: `about.cards.${index - 1}.0`, label: `Carte ${index} · Titre` }, { path: `about.cards.${index - 1}.1`, label: `Carte ${index} · Description`, type: TEXTAREA }]),
      { path: 'about.reasonsTitle', label: 'Raisons · Titre' },
      ...[1, 2, 3, 4].map((index) => ({ path: `about.reasons.${index - 1}`, label: `Raisons · Élément ${index}`, type: TEXTAREA })),
    ],
  },
  {
    key: 'pages',
    title: 'Pages Services & Contact',
    description: 'Contenus principaux des pages Services et Contact.',
    fields: [
      { path: 'servicesPage.metadataTitle', label: 'Services · Méta titre' },
      { path: 'servicesPage.metadataDescription', label: 'Services · Méta description', type: TEXTAREA },
      { path: 'servicesPage.eyebrow', label: 'Services · Sur-titre' },
      { path: 'servicesPage.title', label: 'Services · Titre', type: TEXTAREA },
      { path: 'servicesPage.description', label: 'Services · Description', type: TEXTAREA },
      ...['scopeLabel', 'formatLabel', 'durationLabel', 'pricingLabel', 'deliverablesLabel', 'outcomeLabel', 'audienceLabel', 'specialtiesLabel'].map((key) => ({ path: `servicesPage.${key}`, label: `Services · ${key}` })),
      { path: 'servicesPage.ctaTitle', label: 'Services · CTA titre', type: TEXTAREA },
      { path: 'servicesPage.ctaDescription', label: 'Services · CTA description', type: TEXTAREA },
      { path: 'servicesPage.ctaButton', label: 'Services · CTA bouton' },
      { path: 'contact.metadataTitle', label: 'Contact · Méta titre' },
      { path: 'contact.metadataDescription', label: 'Contact · Méta description', type: TEXTAREA },
      { path: 'contact.eyebrow', label: 'Contact · Sur-titre' },
      { path: 'contact.title', label: 'Contact · Titre', type: TEXTAREA },
      { path: 'contact.description', label: 'Contact · Description', type: TEXTAREA },
      { path: 'contact.socialTitle', label: 'Contact · Titre réseaux' },
      { path: 'contact.socialDescription', label: 'Contact · Description réseaux', type: TEXTAREA },
      { path: 'contact.formTitle', label: 'Contact · Titre formulaire' },
      ...['name', 'email', 'company', 'phone', 'subject', 'message'].map((key) => ({ path: `contact.placeholders.${key}`, label: `Contact · Placeholder ${key}` })),
      { path: 'contact.submit', label: 'Contact · Bouton envoyer' },
    ],
  },
  {
    key: 'content',
    title: 'Actualités & Formations',
    description: 'Textes les plus visibles des pages listes et détails.',
    fields: [
      { path: 'news.metadataTitle', label: 'Actualités · Méta titre' },
      { path: 'news.metadataDescription', label: 'Actualités · Méta description', type: TEXTAREA },
      { path: 'news.title', label: 'Actualités · Titre' },
      { path: 'news.heroTitle', label: 'Actualités · Hero titre', type: TEXTAREA },
      { path: 'news.heroDescription', label: 'Actualités · Hero description', type: TEXTAREA },
      { path: 'news.totalArticles', label: 'Actualités · Total articles' },
      { path: 'news.searchPlaceholder', label: 'Actualités · Placeholder recherche' },
      { path: 'news.searchButton', label: 'Actualités · Bouton recherche' },
      { path: 'news.noArticlesTitle', label: 'Actualités · Titre vide' },
      { path: 'news.noArticlesDescription', label: 'Actualités · Description vide', type: TEXTAREA },
      { path: 'news.previous', label: 'Actualités · Pagination précédent' },
      { path: 'news.next', label: 'Actualités · Pagination suivant' },
      { path: 'news.readMore', label: 'Actualités · Lire la suite' },
      { path: 'news.backToAll', label: 'Actualités · Retour liste' },
      { path: 'news.articleNotFound', label: 'Actualités · Article introuvable' },
      { path: 'trainingsPage.metadataTitle', label: 'Formations · Méta titre' },
      { path: 'trainingsPage.metadataDescription', label: 'Formations · Méta description', type: TEXTAREA },
      { path: 'trainingsPage.eyebrow', label: 'Formations · Sur-titre' },
      { path: 'trainingsPage.title', label: 'Formations · Titre', type: TEXTAREA },
      { path: 'trainingsPage.description', label: 'Formations · Description', type: TEXTAREA },
      { path: 'trainingsPage.availablePrograms', label: 'Formations · Programmes disponibles' },
      { path: 'trainingsPage.searchPlaceholder', label: 'Formations · Placeholder recherche' },
      { path: 'trainingsPage.searchButton', label: 'Formations · Bouton recherche' },
      { path: 'trainingsPage.noTrainingsTitle', label: 'Formations · Titre vide' },
      { path: 'trainingsPage.noTrainingsDescription', label: 'Formations · Description vide', type: TEXTAREA },
      { path: 'trainingsPage.noPublishedTrainingsDescription', label: 'Formations · Description sans publication', type: TEXTAREA },
      { path: 'trainingsPage.previous', label: 'Formations · Pagination précédent' },
      { path: 'trainingsPage.next', label: 'Formations · Pagination suivant' },
      { path: 'trainingsPage.registerNow', label: 'Formations · Bouton inscription' },
      { path: 'trainingsPage.viewProgramDetails', label: 'Formations · Voir le détail' },
      { path: 'trainingsPage.backToAll', label: 'Formations · Retour liste' },
      { path: 'trainingsPage.trainingNotFound', label: 'Formations · Introuvable' },
      { path: 'trainingsPage.registerInterest', label: 'Formations · Demander des informations' },
    ],
  },
  {
    key: 'footer',
    title: 'Footer',
    description: 'Textes de fin de page et labels de liens.',
    fields: [
      { path: 'footer.headline', label: 'Footer · Accroche', type: TEXTAREA },
      { path: 'footer.consultationCta', label: 'Footer · Bouton consultation' },
      { path: 'footer.quickLinks', label: 'Footer · Liens rapides' },
      { path: 'footer.contactInformation', label: 'Footer · Coordonnées' },
      { path: 'footer.socialMedia', label: 'Footer · Réseaux sociaux' },
      { path: 'footer.socialNote', label: 'Footer · Note réseaux', type: TEXTAREA },
      { path: 'footer.rights', label: 'Footer · Droits réservés' },
      { path: 'footer.support', label: 'Footer · Support', type: TEXTAREA },
      { path: 'footer.languageLabel', label: 'Footer · Label langue' },
    ],
  },
];

function getSiteContentFieldValue(content, path) {
  const value = path.split('.').reduce((current, segment) => {
    if (current == null) {
      return undefined;
    }

    if (Array.isArray(current)) {
      const index = Number(segment);
      return Number.isInteger(index) ? current[index] : undefined;
    }

    return current[segment];
  }, content);

  return typeof value === 'string' ? value : '';
}

function getFieldInputClassName(isTextarea) {
  return isTextarea
    ? 'min-h-[7.5rem] rounded-2xl border-brand-gray-modern/20 bg-white text-sm leading-6 shadow-sm shadow-brand-gray-modern/10'
    : 'h-12 rounded-2xl border-brand-gray-modern/20 bg-white text-sm shadow-sm shadow-brand-gray-modern/10';
}

function SiteContentEditor({ action, siteCopyFr, siteCopyEn }) {
  const totalFields = SITE_CONTENT_FORM_SECTIONS.reduce((total, section) => total + section.fields.length, 0);

  return (
    <form action={action} className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-brand-gray-modern/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(246,247,249,0.96))] shadow-sm shadow-brand-gray-modern/10">
        <div className="border-b border-brand-gray-modern/15 bg-[radial-gradient(circle_at_top_left,rgba(241,106,111,0.16),transparent_38%),radial-gradient(circle_at_right,rgba(196,22,28,0.10),transparent_30%)] p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red-dark/80">Édition premium</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-brand-black">Contenu éditorial multilingue</h3>
              <p className="mt-3 text-sm leading-6 text-brand-gray-dark">
                Cette version masque complètement le JSON. Tu modifies directement les textes les plus importants du site via des champs FR/EN, avec une navigation rapide entre sections et une zone d’action plus confortable.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[24rem]">
              <div className="rounded-2xl border border-white/60 bg-white/80 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">Sections</p>
                <p className="mt-2 text-2xl font-semibold text-brand-black">{SITE_CONTENT_FORM_SECTIONS.length}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/80 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">Champs</p>
                <p className="mt-2 text-2xl font-semibold text-brand-black">{totalFields}</p>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white/80 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">Langues</p>
                <p className="mt-2 text-lg font-semibold text-brand-black">FR + EN</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="rounded-2xl border border-brand-gray-modern/20 bg-white/90 p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-black">Navigation rapide</p>
                <p className="mt-1 text-sm text-brand-gray-dark">Va directement à la zone que tu veux éditer, sans parcourir tout le formulaire.</p>
              </div>

              <button type="submit" className="btn-brand-primary whitespace-nowrap">
                Enregistrer le contenu éditorial
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {SITE_CONTENT_FORM_SECTIONS.map((section, index) => (
                <a
                  key={section.key}
                  href={`#site-content-section-${section.key}`}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-gray-modern/20 bg-brand-gray-modern/5 px-3 py-2 text-sm font-medium text-brand-gray-dark transition hover:border-brand-red/25 hover:bg-brand-red/5 hover:text-brand-black"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-brand-black shadow-sm shadow-brand-gray-modern/10">
                    {index + 1}
                  </span>
                  <span>{section.title}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200/70 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
            Les structures secondaires et catalogues de secours restent conservés automatiquement en arrière-plan au moment de la sauvegarde.
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {SITE_CONTENT_FORM_SECTIONS.map((section, sectionIndex) => (
          <section
            key={section.key}
            id={`site-content-section-${section.key}`}
            className="scroll-mt-24 rounded-[2rem] border border-brand-gray-modern/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,249,250,0.95))] p-5 shadow-sm shadow-brand-gray-modern/10"
          >
            <div className="mb-5 flex flex-col gap-4 border-b border-brand-gray-modern/15 pb-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-red/10 text-sm font-semibold text-brand-red-dark">
                    {sectionIndex + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-black">{section.title}</h3>
                    <p className="mt-1 text-sm text-brand-gray-dark">{section.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-brand-gray-modern/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">
                  {section.fields.length} champs
                </span>
                <span className="rounded-full border border-brand-red/15 bg-brand-red/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-red-dark">
                  FR / EN synchronisés
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {section.fields.map((field) => {
                const isTextarea = field.type === TEXTAREA;
                const fieldClassName = getFieldInputClassName(isTextarea);

                return (
                  <div
                    key={field.path}
                    className="rounded-[1.5rem] border border-brand-gray-modern/15 bg-white/95 p-4 shadow-sm shadow-brand-gray-modern/5 transition hover:border-brand-red/15"
                  >
                    <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-brand-black">{field.label}</p>
                        <p className="mt-1 text-xs text-brand-gray-dark">Chemin interne : {field.path}</p>
                      </div>
                      <span className="inline-flex rounded-full border border-brand-gray-modern/20 bg-brand-gray-modern/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">
                        {isTextarea ? 'Texte long' : 'Texte court'}
                      </span>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                      <div className="rounded-2xl border border-brand-gray-modern/10 bg-brand-gray-modern/5 p-3">
                        <label htmlFor={`siteContentField-fr-${field.path}`} className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">
                          FR
                        </label>
                        {isTextarea ? (
                          <Textarea
                            id={`siteContentField-fr-${field.path}`}
                            name={`siteContentField__fr__${field.path}`}
                            defaultValue={getSiteContentFieldValue(siteCopyFr, field.path)}
                            className={fieldClassName}
                            spellCheck
                          />
                        ) : (
                          <Input
                            id={`siteContentField-fr-${field.path}`}
                            name={`siteContentField__fr__${field.path}`}
                            defaultValue={getSiteContentFieldValue(siteCopyFr, field.path)}
                            className={fieldClassName}
                          />
                        )}
                      </div>

                      <div className="rounded-2xl border border-brand-gray-modern/10 bg-brand-gray-modern/5 p-3">
                        <label htmlFor={`siteContentField-en-${field.path}`} className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray-dark">
                          EN
                        </label>
                        {isTextarea ? (
                          <Textarea
                            id={`siteContentField-en-${field.path}`}
                            name={`siteContentField__en__${field.path}`}
                            defaultValue={getSiteContentFieldValue(siteCopyEn, field.path)}
                            className={fieldClassName}
                            spellCheck
                          />
                        ) : (
                          <Input
                            id={`siteContentField-en-${field.path}`}
                            name={`siteContentField__en__${field.path}`}
                            defaultValue={getSiteContentFieldValue(siteCopyEn, field.path)}
                            className={fieldClassName}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="sticky bottom-4 z-10 rounded-[1.75rem] border border-brand-gray-modern/20 bg-white/95 p-4 shadow-lg shadow-brand-gray-modern/15 backdrop-blur lg:px-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-black">Prêt à enregistrer ?</p>
            <p className="mt-1 text-sm text-brand-gray-dark">Chaque sauvegarde met à jour les versions FR et EN en base de données puis invalide le cache des pages publiques principales.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#site-content-section-global" className="inline-flex items-center justify-center rounded-full border border-brand-gray-modern/20 px-4 py-2 text-sm font-medium text-brand-gray-dark transition hover:border-brand-red/20 hover:text-brand-black">
              Revenir en haut
            </a>
            <button type="submit" className="btn-brand-primary whitespace-nowrap">
              Enregistrer le contenu éditorial
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export { SiteContentEditor };