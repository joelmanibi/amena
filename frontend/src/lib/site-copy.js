import 'server-only';
import { cache } from 'react';
import { getSiteContent as fetchSiteContent } from '@/lib/api';
import { company } from '@/lib/site-data';
import { DEFAULT_LOCALE, normalizeLocale } from '@/lib/i18n';

const siteCopy = {
  fr: {
    companyDescription:
      'Conseil en finance d’entreprise, formations executive et accompagnement stratégique pour les organisations qui recherchent une croissance durable et des décisions résilientes.',
    navigation: [
      { label: 'Accueil', href: '/' },
      { label: 'A propos', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Actualites', href: '/news' },
      { label: 'Formations', href: '/trainings' },
      { label: 'Contact', href: '/contact' },
    ],
    stats: [
      { label: 'Taux de financement', value: '85%' },
      { label: 'Optimisations moyennes', value: '30%' },
      { label: 'Temps de reponse', value: '<24h' },
      { label: 'Marches regionaux couverts', value: '9' },
    ],
    services: [
      {
        slug: 'audit-financier',
        title: 'Audit financier',
        badge: 'Diagnostic complet',
        description: 'Diagnostic complet de la situation financiere pour identifier les risques, les ecarts et les leviers d’amelioration.',
        deliverables: ['Analyse de la situation financiere et des principaux ratios', 'Identification des risques, ecarts et points de vigilance', 'Recommandations prioritaires et plan d’amelioration', 'Restitution claire pour appuyer la decision'],
        format: 'Mission flash ou audit approfondi',
        duration: '5 a 10 jours selon le perimetre',
        pricing: 'Sur devis',
        outcome: 'Une vision claire de la sante financiere de l’entreprise avec des actions prioritaires a engager.',
        audience: 'PME, dirigeants, investisseurs et organisations en restructuration.',
      },
      {
        slug: 'business-plan',
        title: 'Business plan',
        badge: 'Financement & strategie',
        description: 'Structuration de business plans clairs pour soutenir le financement, la strategie et la prise de decision.',
        deliverables: ['Diagnostic du modele economique et des hypotheses', 'Previsions financieres structurees sur 3 a 5 ans', 'Scenario de financement et feuille de route', 'Support de presentation pour banques, investisseurs ou partenaires'],
        format: 'Accompagnement ponctuel ou dossier investisseurs',
        duration: '1 a 3 semaines',
        pricing: 'Sur devis',
        outcome: 'Un dossier credible pour convaincre vos partenaires financiers et cadrer votre trajectoire de croissance.',
        audience: 'Createurs, PME en croissance, porteurs de projet et entreprises en recherche de financement.',
      },
      {
        slug: 'comptabilite',
        title: 'Comptabilité & conformité fiscale',
        badge: 'Gestion comptable',
        description: 'Nous assurons la gestion complète de votre comptabilité et de votre conformité fiscale pour fiabiliser vos obligations, vos états financiers et votre pilotage.',
        format: 'Accompagnement récurrent ou mission premium réglementaire',
        duration: 'Mensuel / trimestriel selon la mission',
        pricing: 'À partir de 50 000 FCFA/mois selon volume',
        sections: [
          {
            title: 'Tenue comptable & conformité fiscale',
            items: ['Tenue de comptabilité complète (mensuelle/trimestrielle)', 'Paramétrage et gestion FNE (Facturation Normalisée Électronique)', 'Déclarations fiscales (TVA, IS, IRPP, Patente, etc.)', 'Établissement des états financiers annuels', 'Préparation et dépôt DSF (Déclaration Statistique et Fiscale)', 'Gestion des relations avec la DGI', 'Conseil fiscal et optimisation légale'],
            deliverables: ['États comptables mensuels', 'Déclarations fiscales à jour', 'Bilan et compte de résultat annuels', 'Liasse fiscale complète', 'Certificat de dépôt DSF'],
            pricing: 'À partir de 50 000 FCFA/mois selon volume',
          },
        ],
        outcome: 'Une fonction comptable sécurisée, une conformité fiscale maîtrisée et des états financiers fiables pour piloter sereinement votre activité.',
        audience: 'PME, structures en croissance et organisations souhaitant externaliser ou renforcer leur discipline comptable.',
      },
      {
        slug: 'ingenierie-entrepreneuriale-agrements',
        title: 'Ingénierie entrepreneuriale & obtention d’agréments',
        badge: 'Service premium réglementaire',
        description: 'Nous accompagnons les Fintech, startups et entreprises réglementées dans leur structuration juridique et financière, ainsi que dans l’obtention de leurs agréments spécifiques.',
        format: 'Mission premium sur mesure',
        duration: '3 à 12 mois selon le type d’agrément',
        pricing: 'Sur devis selon complexité (150 000 à 2 000 000 FCFA)',
        sections: [
          {
            title: 'Ingénierie entrepreneuriale & obtention d’agréments',
            intro: 'Service premium pour Fintech, startups et entreprises réglementées nécessitant des agréments spécifiques.',
            items: ['Structuration juridique et financière de l’entreprise', 'Constitution de dossiers d’agrément (CREPMF, BCEAO, etc.)', 'Mise en conformité réglementaire avant lancement', 'Obtention d’agréments Fintech, E-money, Paiement', 'Agrément établissement de crédit / microfinance', 'Conformité AML/CFT (anti-blanchiment)', 'Accompagnement jusqu’à l’obtention finale'],
            deliverables: ['Dossier de demande d’agrément complet', 'Business plan réglementaire', 'Prévisionnel financier conforme aux exigences', 'Documents juridiques et statuts', 'Procédures de conformité', 'Support lors des audits régulateurs'],
            duration: '3 à 12 mois selon le type d’agrément',
            pricing: 'Sur devis selon complexité (150 000 à 2 000 000 FCFA)',
            specialtiesTitle: 'Spécialités Fintech',
            specialties: ['Agrément E-money (monnaie électronique)', 'Agrément paiement mobile / PSP', 'Agrément transfert d’argent', 'Licence établissement de microfinance', 'Conformité KYC/AML', 'Structuration capitalistique'],
          },
        ],
        outcome: 'Un dossier solide, conforme et défendable pour maximiser vos chances d’obtention d’agrément et sécuriser votre lancement.',
        audience: 'Fintech, startups réglementées, établissements de paiement, microfinance et porteurs de projets nécessitant un agrément spécifique.',
      },
      {
        slug: 'formation',
        title: 'Formation',
        badge: 'Gestion & pilotage',
        description: 'Programmes pratiques en gestion et pilotage pour renforcer les competences des dirigeants et des equipes.',
        deliverables: ['Modules adaptes au niveau et aux besoins des participants', 'Supports pedagogiques et cas pratiques directement exploitables', 'Animation interactive orientee terrain et prise de decision', 'Synthese des acquis et recommandations d’application'],
        format: 'Intra-entreprise, atelier ou seminaire',
        duration: '1/2 journee a 3 jours',
        pricing: 'Sur devis',
        outcome: 'Des equipes mieux outillees pour piloter l’activite, lire les chiffres et agir avec plus d’autonomie.',
        audience: 'Dirigeants, managers, responsables financiers et equipes operationnelles.',
      },
      {
        slug: 'cfo-externalise-dashboard-cfo',
        title: 'CFO externalise / Dashboard CFO',
        badge: 'Pilotage financier',
        description: 'Un appui de direction financiere a temps partage pour structurer le pilotage, les reportings et les decisions de croissance.',
        deliverables: ['Mise en place de tableaux de bord et KPI cles', 'Suivi de la tresorerie, des marges et de la performance', 'Preparation de reportings pour dirigeants, banques ou partenaires', 'Aide a la decision et animation du pilotage financier'],
        format: 'Temps partage ou abonnement mensuel',
        duration: 'Accompagnement recurrent',
        pricing: 'Sur devis',
        outcome: 'Un pilotage financier plus lisible, des decisions plus rapides et une meilleure maitrise de la performance.',
        audience: 'PME, start-up, dirigeants sans direction financiere interne et structures en transformation.',
      },
    ],
    fallbackArticles: [
      {
        slug: 'navigating-capital-planning-in-volatile-markets',
        title: 'Piloter la planification du capital dans des marches volatils',
        excerpt: 'Comment les directions financieres peuvent equilibrer liquidite, discipline d’investissement et resilience dans des cycles incertains.',
        category: 'Finance d’entreprise',
        publishedAt: '2026-01-18',
        readTime: '6 min de lecture',
        author: 'Pôle Recherche Amena',
        content: [
          'La planification du capital est devenue une priorite de gouvernance alors que les organisations font face aux pressions inflationnistes, a l’incertitude sur les taux et a l’evolution des attentes des investisseurs.',
          'Un cadre robuste doit relier les priorites strategiques aux scenarios, a la visibilite sur les flux de tresorerie et a des regles claires d’allocation du capital.',
          'Les equipes dirigeantes qui alignent pilotage operationnel et strategie de financement investissent avec plus de confiance tout en preservant leur resilience.',
        ],
      },
      {
        slug: 'building-a-kpi-framework-for-executive-decision-making',
        title: 'Construire un cadre KPI pour la decision executive',
        excerpt: 'Une approche pratique pour choisir des indicateurs qui structurent vraiment les arbitrages des dirigeants.',
        category: 'Pilotage de la performance',
        publishedAt: '2025-12-09',
        readTime: '5 min de lecture',
        author: 'Equipe Strategie Amena',
        content: [
          'De nombreuses organisations accumulent des indicateurs sans construire un langage commun de performance entre les fonctions.',
          'Les meilleurs cadres KPI equilibrent indicateurs financiers, mesures operationnelles avancees et regles claires de revue.',
          'Une architecture KPI lisible accelere la decision, la priorisation des ressources et l’alignement executive.',
        ],
      },
      {
        slug: 'financial-governance-priorities-for-growing-enterprises',
        title: 'Les priorites de gouvernance financiere pour les entreprises en croissance',
        excerpt: 'La croissance ajoute de la complexite. Les systemes de gouvernance doivent evoluer avant que les faiblesses de controle ne deviennent structurelles.',
        category: 'Gouvernance',
        publishedAt: '2025-10-24',
        readTime: '7 min de lecture',
        author: 'Amena Advisory',
        content: [
          'Les entreprises qui se developpent depassent souvent leurs mecanismes informels de reporting et de validation plus vite que prevu.',
          'La maturite de gouvernance commence par la clarte des roles, les delegations, la discipline de reporting et la responsabilisation sur les risques.',
          'Lorsque la gouvernance est structuree tot, l’expansion devient plus previsible et plus rassurante pour les investisseurs, les banques et les partenaires.',
        ],
      },
    ],
    trainings: [
      {
        slug: 'strategic-financial-analysis-for-managers',
        title: 'Analyse financiere strategique pour managers',
        summary: 'Un programme pratique axe sur la lecture des signaux financiers, la planification de scenarios et l’amelioration des decisions strategiques.',
        description: 'Concu pour les managers et responsables qui doivent transformer le reporting financier en actions operationnelles et strategiques.',
        format: 'Hybride',
        duration: '2 jours',
        audience: 'Managers, business partners finance et responsables fonctionnels',
        nextSession: '2026-04-14',
        price: '$490',
        modules: ['Lecture des etats financiers', 'Cash-flow et besoin en fonds de roulement', 'Planification par scenarios', 'Tableaux de bord d’aide a la decision'],
      },
      {
        slug: 'enterprise-budgeting-and-performance-control',
        title: 'Budgetisation d’entreprise et controle de performance',
        summary: 'Construisez un processus budgetaire qui renforce responsabilisation, agilite et pilotage executive.',
        description: 'Ce programme aide les organisations a moderniser leur budget annuel et a relier les previsions aux routines de performance managériale.',
        format: 'Presentiel',
        duration: '3 jours',
        audience: 'Equipes finance, controleurs et directeurs de departement',
        nextSession: '2026-05-08',
        price: '$650',
        modules: ['Architecture budgetaire', 'Analyse des ecarts', 'Gouvernance des previsions', 'Rituels de revue de gestion'],
      },
      {
        slug: 'risk-governance-for-growth-companies',
        title: 'Gouvernance des risques pour entreprises en croissance',
        summary: 'Dotez les equipes dirigeantes des outils de gouvernance necessaires pour croitre tout en protegeant la resilience financiere et operationnelle.',
        description: 'Un atelier cible sur la responsabilite des risques, la conception des controles, le reporting de gouvernance et les mecanismes d’escalade executive.',
        format: 'En ligne',
        duration: '1 jour',
        audience: 'Dirigeants, responsables controle interne et managers risque',
        nextSession: '2026-06-20',
        price: '$320',
        modules: ['Taxonomie des risques', 'Conception des controles', 'Reporting de gouvernance', 'Escalade au niveau conseil'],
      },
    ],
    header: {
      eyebrow: 'Conseil financier',
      consultationCta: 'Demander une consultation',
      mobileToggleLabel: 'Ouvrir la navigation',
    },
    footer: {
      headline: 'Un conseil financier de confiance pour une croissance d’entreprise durable.',
      consultationCta: 'Demander une consultation',
      quickLinks: 'Liens rapides',
      contactInformation: 'Coordonnees',
      socialMedia: 'Reseaux sociaux',
      socialNote: 'Remplacez les liens sociaux par les profils officiels du cabinet lorsqu’ils seront disponibles.',
      rights: 'Tous droits reserves.',
      support: 'Conseil professionnel, formation executive et accompagnement de transformation financiere.',
      languageLabel: 'Langue',
    },
    home: {
      title: 'Ingenierie financiere et formation professionnelle',
      description: 'Des solutions de conseil et de formation pour accompagner la transformation financiere des organisations.',
      primaryCta: 'Decouvrir nos services',
      secondaryCta: 'Voir les prochaines formations',
      highlights: ['Ingenierie financiere', 'Conseil corporate', 'Formation professionnelle'],
      panelBadge: 'Expertise du cabinet',
      panelTitle: 'Une approche claire et structuree du conseil et du developpement des competences.',
      panelDescription: 'Nous aidons les entreprises a renforcer leur performance financiere grace a des missions ciblees et des programmes de formation pratiques.',
      priorities: [
        'Conseil en transformation financiere pour les organisations en evolution',
        'Programmes de formation adaptes aux dirigeants et aux equipes finance',
        //'Accompagnement concret combinant strategie, gouvernance et execution',
      ],
      focusEyebrow: 'Axes prioritaires',
      focusAreas: [
        {
          title: 'Conseil',
          description: 'Un accompagnement strategique pour la transformation financiere et la performance de l’entreprise.',
        },
        {
          title: 'Formation',
          description: 'Des experiences d’apprentissage concues pour des besoins organisationnels reels.',
        },
      ],
      servicesSection: {
        eyebrow: 'Services',
        title: 'Des expertises ciblees pour la transformation financiere et la performance corporate',
        description: 'Chaque service est presente dans un format clair et premium qui valorise la rigueur, la lisibilite et l’expertise metier.',
        cta: 'Voir tous les services',
        itemCta: 'Explorer le service',
        whyEyebrow: 'Pourquoi nous solliciter',
        whyDescription: 'Conseil independant, forte rigueur analytique et execution construite autour de l’alignement des dirigeants et de l’impact business.',
        whyCta: 'Discuter de vos priorites',
        cards: [
          {
            title: 'Audit financier',
            description: 'Diagnostic complet de la situation financiere pour identifier les risques, les ecarts et les leviers d’amelioration.',
          },
          {
            title: 'Business plan',
            description: 'Structuration de business plans clairs pour soutenir le financement, la strategie et la prise de decision.',
          },
          {
            title: 'Comptabilité & conformité fiscale',
            description: 'Gestion comptable, obligations fiscales et production d’états financiers fiables pour un pilotage serein.',
          },
          {
            title: 'Ingénierie entrepreneuriale',
            description: 'Structuration juridique et financière, conformité réglementaire et accompagnement à l’obtention d’agréments.',
          },
          {
            title: 'Formation',
            description: 'Programmes pratiques en gestion et pilotage pour renforcer les competences des dirigeants et des equipes.',
          },
          {
            title: 'CFO externalise',
            description: 'Pilotage financier a temps partage avec tableaux de bord, KPI et aide a la decision.',
          },
        ],
      },
      insightsSection: {
        eyebrow: 'Actualites',
        title: 'Les dernieres analyses et actualites pour les decideurs financiers',
        description: 'Des points de vue concis sur la finance, la gouvernance, la strategie et la performance utiles aux equipes dirigeantes.',
        cta: 'Voir tous les articles',
        defaultCategory: 'Actualites',
        latestInsight: 'Derniere publication',
        readArticle: 'Lire l’article',
      },
      trainingsSection: {
        eyebrow: 'Formation executive',
        title: 'Des formations a venir qui transforment l’expertise en capacite organisationnelle',
        description: 'Des formats courts et pratiques pensés pour les dirigeants, managers et equipes finance qui ont besoin d’une application immediate.',
        cta: 'Voir les formations',
        nextSession: 'Prochaine session',
        deliverySuffix: 'format',
        viewProgram: 'Voir le programme',
        noTrainingsTitle: 'Aucune formation en cours',
        noTrainingsDescription: 'Les prochaines formations actives apparaitront ici dès leur publication.',
      },
    },
    about: {
      metadataTitle: 'A propos',
      metadataDescription: 'Decouvrez AMENA CONSULTING, notre mission et notre approche du conseil financier strategique et du renforcement des capacites executives.',
      eyebrow: 'A propos',
      title: 'Un partenaire de confiance pour la finance d’entreprise et la transformation strategique',
      description: 'Nous accompagnons les organisations qui ont besoin de rigueur, de clarte et d’un appui concret en finance, gouvernance et performance.',
      cards: [
        ['Notre mission', 'Aider les organisations a prendre de meilleures decisions financieres et strategiques grace a un conseil structure et un accompagnement executive pragmatique.'],
        ['Notre vision', 'Etre un partenaire de reference pour les institutions qui recherchent une croissance resiliente, une execution disciplinee et une gouvernance solide.'],
        ['Notre approche', 'Une demarche guidee par l’insight, centree client et orientee mise en oeuvre, alliant profondeur analytique et realisme business.'],
      ],
      reasonsTitle: 'Pourquoi les clients choisissent AMENA CONSULTING',
      reasons: [
        'Une solide expertise en finance et en pilotage de la performance',
        'Des livrables actionnables pour les dirigeants et instances de decision',
        'Des formations ancrees dans des cas business reels',
        'Un equilibre entre rigueur analytique et execution pragmatique',
      ],
    },
    servicesPage: {
      metadataTitle: 'Services',
      metadataDescription: 'Explorez les services de conseil proposes par AMENA CONSULTING en finance, strategie, gouvernance et formation executive.',
      eyebrow: 'Services',
      title: 'Des services structures pour diagnostiquer, piloter et accelerer votre croissance',
      description: 'De l’audit a la direction financiere externalisee, nous proposons des interventions concretes pour fiabiliser vos chiffres, soutenir vos financements et renforcer vos capacites de pilotage.',
      scopeLabel: 'Interventions',
      formatLabel: 'Formule',
      durationLabel: 'Durée',
      pricingLabel: 'Tarif',
      deliverablesLabel: 'Prestations & livrables',
      outcomeLabel: 'Résultat attendu',
      audienceLabel: 'Public cible',
      specialtiesLabel: 'Spécialités',
      ctaTitle: 'Besoin d’une mission de conseil sur mesure ?',
      ctaDescription: 'Nous pouvons concevoir un accompagnement adapte a votre modele d’affaires, aux priorites du conseil, a votre feuille de route de transformation ou aux besoins de vos equipes.',
      ctaButton: 'Demarrer l’echange',
    },
    contact: {
      metadataTitle: 'Contact',
      metadataDescription: 'Contactez AMENA CONSULTING pour discuter d’une mission de conseil, d’une formation executive ou d’une opportunite de partenariat.',
      eyebrow: 'Contact',
      title: 'Parlons de votre prochaine priorite strategique',
      description: 'Contactez-nous pour vos missions de conseil, workshops executives ou accompagnements sur mesure.',
      socialTitle: 'Reseaux sociaux',
      socialDescription: 'Suivez AMENA CONSULTING sur ses plateformes officielles pour rester informé de ses actualites et publications.',
      formTitle: 'Envoyer un message',
      placeholders: {
        name: 'Nom complet',
        email: 'Adresse e-mail',
        company: 'Entreprise',
        phone: 'Numero de telephone',
        subject: 'Objet',
        message: 'Parlez-nous de votre besoin...',
      },
      submit: 'Envoyer la demande',
    },
    news: {
      metadataTitle: 'Actualites',
      metadataDescription: 'Consultez les dernieres analyses et actualites d’AMENA CONSULTING sur la finance, la strategie et la gouvernance.',
      title: 'Actualites',
      heroTitle: 'Des analyses pour les dirigeants financiers et les decideurs',
      heroDescription: 'Un espace editorial moderne pour les articles, commentaires et points de vue corporate sur la finance, la gouvernance et la transformation.',
      totalArticles: 'Total articles',
      showing: 'Affichage de',
      of: 'sur',
      articleSingular: 'article',
      articlePlural: 'articles',
      activeFilters: 'Filtres actifs',
      searchPrefix: 'Recherche',
      noArticlesTitle: 'Aucun article trouve',
      noArticlesDescription: 'Essayez un autre mot-cle ou une autre categorie pour explorer davantage de contenus.',
      allCategories: 'Toutes les categories',
      searchPlaceholder: 'Rechercher des articles, sujets ou mots-cles',
      searchButton: 'Rechercher',
      paginationLabel: 'Pagination',
      previous: 'Precedent',
      next: 'Suivant',
      readMore: 'Lire la suite',
      upcomingPublication: 'Publication a venir',
      excerptFallback: 'Lisez l’article complet pour beneficier d’une analyse detaillee et d’un regard expert.',
      defaultCategory: 'Actualites',
      defaultAuthor: 'AMENA CONSULTING',
      backToAll: 'Retour a toutes les actualites',
      articleNotFound: 'Article introuvable',
      draft: 'Brouillon',
      sectionSingular: 'section',
      sectionPlural: 'sections',
    },
    trainingsPage: {
      metadataTitle: 'Formations',
      metadataDescription: 'Decouvrez les seminaires et programmes de formation executive proposes par AMENA CONSULTING.',
      eyebrow: 'Formations et seminaires',
      title: 'Des programmes d’apprentissage corporate concus pour un impact financier concret',
      description: 'Explorez des formats de formation et de seminarie professionnels pour renforcer les capacites financieres, les pratiques de gouvernance et la qualite des decisions.',
      availablePrograms: 'Programmes disponibles',
      showing: 'Affichage de',
      of: 'sur',
      programSingular: 'programme',
      programPlural: 'programmes',
      activeFilters: 'Filtres actifs',
      searchPrefix: 'Recherche',
      searchPlaceholder: 'Rechercher une formation, un sujet ou un mot-clé',
      searchButton: 'Rechercher',
      paginationLabel: 'Pagination des formations',
      previous: 'Précédent',
      next: 'Suivant',
      sessionDate: 'Date de session',
      price: 'Tarif',
      programFee: 'Frais du programme',
      registerNow: 'S’inscrire',
      viewProgramDetails: 'Voir le detail du programme',
      trainingNotFound: 'Formation introuvable',
      noTrainingsTitle: 'Aucune formation trouvée',
      noTrainingsDescription: 'Essayez un autre mot-clé pour élargir votre recherche.',
      noPublishedTrainingsDescription: 'Aucune formation publiée n’est disponible pour le moment.',
      backToAll: 'Retour a toutes les formations',
      programModules: 'Modules du programme',
      programInformation: 'Informations du programme',
      duration: 'Duree',
      audience: 'Public',
      nextSession: 'Prochaine session',
      registerInterest: 'Demander des informations',
    },
    notFound: {
      title: 'Page introuvable',
      description: 'La page que vous recherchez n’existe pas ou a ete deplacee.',
      cta: 'Retour a l’accueil',
    },
    language: {
      label: 'Langue',
      fr: 'FR',
      en: 'EN',
    },
  },
  en: {
    companyDescription:
      'Corporate finance advisory, executive training, and strategic insight for institutions seeking sustainable growth and resilient decision-making.',
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'News', href: '/news' },
      { label: 'Trainings', href: '/trainings' },
      { label: 'Contact', href: '/contact' },
    ],
    stats: [
      { label: 'Years of advisory experience', value: '12+' },
      { label: 'Corporate transformation projects', value: '85+' },
      { label: 'Training participants supported', value: '1,500+' },
      { label: 'Regional markets covered', value: '9' },
    ],
    services: [
      {
        slug: 'audit-financier',
        title: 'Financial Audit',
        badge: 'Full diagnosis',
        description: 'A complete financial diagnosis to identify risks, gaps, and opportunities for improvement.',
        deliverables: ['Financial situation analysis and key ratio review', 'Identification of risks, gaps, and critical issues', 'Prioritized recommendations and improvement roadmap', 'Clear debrief to support decision-making'],
        format: 'Rapid review or in-depth audit',
        duration: '5 to 10 days depending on scope',
        pricing: 'Quotation on request',
        outcome: 'A clear view of the company’s financial health and the priority actions to launch.',
        audience: 'SMEs, executives, investors, and organizations under restructuring.',
      },
      {
        slug: 'business-plan',
        title: 'Business Plan',
        badge: 'Funding & strategy',
        description: 'Clear business plan structuring to support financing, strategy, and executive decision-making.',
        deliverables: ['Business model and assumptions review', 'Structured 3-to-5-year financial projections', 'Funding scenarios and implementation roadmap', 'Presentation support for banks, investors, or partners'],
        format: 'Project-based support or investor-ready package',
        duration: '1 to 3 weeks',
        pricing: 'Quotation on request',
        outcome: 'A credible file to convince funding partners and frame your growth trajectory.',
        audience: 'Founders, growing SMEs, project sponsors, and companies seeking financing.',
      },
      {
        slug: 'comptabilite',
        title: 'Accounting & Tax Compliance',
        badge: 'Accounting operations',
        description: 'We manage your accounting and tax compliance to strengthen reporting reliability, statutory obligations, and day-to-day financial control.',
        format: 'Recurring support or premium regulatory mission',
        duration: 'Monthly / quarterly depending on mission',
        pricing: 'From 50,000 FCFA/month depending on volume',
        sections: [
          {
            title: 'Accounting management & tax compliance',
            items: ['Full bookkeeping support (monthly/quarterly)', 'FNE setup and management (electronic invoicing)', 'Tax filings (VAT, corporate tax, payroll tax, business tax, etc.)', 'Annual financial statements preparation', 'DSF preparation and filing', 'Coordination with the tax administration', 'Tax advisory and lawful optimization'],
            deliverables: ['Monthly accounting statements', 'Up-to-date tax filings', 'Annual balance sheet and income statement', 'Complete tax package', 'DSF filing certificate'],
            pricing: 'From 50,000 FCFA/month depending on volume',
          },
        ],
        outcome: 'A secure accounting function, controlled tax compliance, and reliable financial statements for better management control.',
        audience: 'SMEs, growing companies, and organizations seeking to outsource or strengthen their accounting discipline.',
      },
      {
        slug: 'entrepreneurial-engineering-licensing',
        title: 'Entrepreneurial Engineering & Licensing Support',
        badge: 'Premium regulatory advisory',
        description: 'We support Fintech, start-ups, and regulated businesses with legal-financial structuring and licensing processes for specific approvals.',
        format: 'Tailored premium engagement',
        duration: '3 to 12 months depending on the license type',
        pricing: 'Quotation based on complexity (150,000 to 2,000,000 FCFA)',
        sections: [
          {
            title: 'Entrepreneurial engineering & licensing support',
            intro: 'Premium service for Fintech, start-ups, and regulated businesses requiring specific approvals.',
            items: ['Legal and financial structuring of the business', 'Preparation of licensing files (CREPMF, BCEAO, etc.)', 'Regulatory compliance setup before launch', 'Support for Fintech, e-money, and payment approvals', 'Credit institution / microfinance licensing support', 'AML/CFT compliance support', 'Assistance through final approval'],
            deliverables: ['Complete licensing application package', 'Regulatory business plan', 'Financial projections aligned with regulatory requirements', 'Legal documents and articles of association', 'Compliance procedures', 'Support during regulator audits'],
            duration: '3 to 12 months depending on the license type',
            pricing: 'Quotation based on complexity (150,000 to 2,000,000 FCFA)',
            specialtiesTitle: 'Fintech specialties',
            specialties: ['E-money approval', 'Mobile payment / PSP approval', 'Money transfer approval', 'Microfinance institution license', 'KYC/AML compliance', 'Capital structuring'],
          },
        ],
        outcome: 'A robust, compliant, and defensible licensing file to maximize approval chances and secure your market launch.',
        audience: 'Fintech, regulated start-ups, payment institutions, microfinance entities, and founders needing a specific license.',
      },
      {
        slug: 'formation',
        title: 'Training',
        badge: 'Management & steering',
        description: 'Practical programs in management and steering to strengthen leadership and team capabilities.',
        deliverables: ['Modules tailored to participant level and needs', 'Training materials and practical cases ready to use', 'Interactive facilitation focused on operational realities', 'Learning summary and application recommendations'],
        format: 'In-company sessions, workshops, or seminars',
        duration: 'Half-day to 3 days',
        pricing: 'Quotation on request',
        outcome: 'Teams better equipped to steer activity, read financial signals, and act more confidently.',
        audience: 'Executives, managers, finance leads, and operational teams.',
      },
      {
        slug: 'cfo-externalise-dashboard-cfo',
        title: 'Fractional CFO / CFO Dashboard',
        badge: 'Financial steering',
        description: 'Part-time finance leadership to structure reporting, dashboards, and growth decisions.',
        deliverables: ['Setup of dashboards and key KPI monitoring', 'Cash, margin, and performance tracking', 'Reporting packs for executives, lenders, or partners', 'Decision support and financial steering routines'],
        format: 'Fractional support or monthly retainer',
        duration: 'Ongoing engagement',
        pricing: 'Quotation on request',
        outcome: 'Sharper financial steering, faster decisions, and better control of performance.',
        audience: 'SMEs, start-ups, leaders without an internal finance head, and transforming organizations.',
      },
    ],
    fallbackArticles: [
      {
        slug: 'navigating-capital-planning-in-volatile-markets',
        title: 'Navigating Capital Planning in Volatile Markets',
        excerpt: 'How finance leaders can balance liquidity, investment discipline, and resilience in uncertain market cycles.',
        category: 'Corporate Finance',
        publishedAt: '2026-01-18',
        readTime: '6 min read',
        author: 'Amena Research Desk',
        content: [
          'Capital planning has become a board-level priority as organizations face inflationary pressures, rate uncertainty, and shifting investor expectations.',
          'A robust capital planning framework should connect strategic priorities with scenario testing, cash-flow visibility, and disciplined capital allocation rules.',
          'Executive teams that align operating planning with financing strategy are better positioned to invest confidently while protecting downside resilience.',
        ],
      },
      {
        slug: 'building-a-kpi-framework-for-executive-decision-making',
        title: 'Building a KPI Framework for Executive Decision-Making',
        excerpt: 'A practical approach to selecting metrics that truly guide performance conversations at leadership level.',
        category: 'Performance Management',
        publishedAt: '2025-12-09',
        readTime: '5 min read',
        author: 'Amena Strategy Team',
        content: [
          'Many organizations collect metrics without building a coherent performance language across business units.',
          'The most effective KPI frameworks balance financial indicators, operational leading measures, and accountability rules for review cadence.',
          'A clear KPI architecture improves decision speed, resource prioritization, and executive alignment.',
        ],
      },
      {
        slug: 'financial-governance-priorities-for-growing-enterprises',
        title: 'Financial Governance Priorities for Growing Enterprises',
        excerpt: 'Growth introduces complexity. Governance systems must evolve before financial control gaps become structural risks.',
        category: 'Governance',
        publishedAt: '2025-10-24',
        readTime: '7 min read',
        author: 'Amena Advisory',
        content: [
          'Scaling enterprises often outgrow informal reporting and approval mechanisms faster than leadership expects.',
          'Governance maturity begins with role clarity, delegated authority, reporting discipline, and risk ownership at management level.',
          'When governance is embedded early, expansion becomes more predictable and attractive to investors, lenders, and partners.',
        ],
      },
    ],
    trainings: [
      {
        slug: 'strategic-financial-analysis-for-managers',
        title: 'Strategic Financial Analysis for Managers',
        summary: 'A practical executive program focused on reading financial signals, planning scenarios, and improving strategic decisions.',
        description: 'Designed for managers and department heads who need to translate financial reporting into operational and strategic action.',
        format: 'Hybrid',
        duration: '2 days',
        audience: 'Managers, finance business partners, and functional leaders',
        nextSession: '2026-04-14',
        price: '$490',
        modules: ['Financial statement interpretation', 'Cash-flow and working capital', 'Scenario planning', 'Decision support dashboards'],
      },
      {
        slug: 'enterprise-budgeting-and-performance-control',
        title: 'Enterprise Budgeting and Performance Control',
        summary: 'Build a budgeting process that improves accountability, agility, and executive oversight.',
        description: 'This program helps organizations modernize annual budgeting and connect forecasts to management performance routines.',
        format: 'Onsite',
        duration: '3 days',
        audience: 'Finance teams, controllers, and department directors',
        nextSession: '2026-05-08',
        price: '$650',
        modules: ['Budget architecture', 'Variance analysis', 'Forecast governance', 'Management review rituals'],
      },
      {
        slug: 'risk-governance-for-growth-companies',
        title: 'Risk Governance for Growth Companies',
        summary: 'Equip leadership teams with the governance tools needed to scale while protecting financial and operational resilience.',
        description: 'A focused workshop covering risk ownership, control design, governance reporting, and executive escalation mechanisms.',
        format: 'Online',
        duration: '1 day',
        audience: 'Executives, internal control leads, and risk managers',
        nextSession: '2026-06-20',
        price: '$320',
        modules: ['Risk taxonomy', 'Control design', 'Governance reporting', 'Board-ready escalation'],
      },
    ],
    header: {
      eyebrow: 'Financial advisory',
      consultationCta: 'Request a consultation',
      mobileToggleLabel: 'Toggle navigation',
    },
    footer: {
      headline: 'Trusted financial consulting for resilient corporate growth.',
      consultationCta: 'Request a consultation',
      quickLinks: 'Quick links',
      contactInformation: 'Contact information',
      socialMedia: 'Social media',
      socialNote: 'Replace the social links with the firm\'s official profiles when they are available.',
      rights: 'All rights reserved.',
      support: 'Professional advisory, executive training, and financial transformation support.',
      languageLabel: 'Language',
    },
    home: {
      title: 'Financial Engineering & Professional Training',
      description: 'Expert consulting and training solutions for corporate financial transformation.',
      primaryCta: 'Discover our services',
      secondaryCta: 'View upcoming trainings',
      highlights: ['Financial Engineering', 'Corporate Advisory', 'Professional Training'],
      panelBadge: 'Consulting firm expertise',
      panelTitle: 'A clean, structured approach to consulting and capability development.',
      panelDescription: 'We help companies strengthen financial performance through targeted advisory work and practical training programs.',
      priorities: [
        'Corporate financial transformation advisory for evolving organizations',
        'Professional training programs tailored to leadership and finance teams',
        'Practical support combining strategy, governance, and execution',
      ],
      focusEyebrow: 'Core focus areas',
      focusAreas: [
        {
          title: 'Consulting',
          description: 'Strategic support for financial transformation and business performance.',
        },
        {
          title: 'Training',
          description: 'Professional learning experiences designed for real organizational needs.',
        },
      ],
      servicesSection: {
        eyebrow: 'Services',
        title: 'Specialized services for financial transformation and corporate performance',
        description: 'Each service is presented through a clean card-based layout designed to communicate rigor, clarity, and financial expertise.',
        cta: 'View all services',
        itemCta: 'Explore service',
        whyEyebrow: 'Why clients engage us',
        whyDescription: 'Independent advice, strong analytical rigor, and a delivery style built around leadership alignment and business impact.',
        whyCta: 'Discuss your priorities',
        cards: [
          {
            title: 'Financial Audit',
            description: 'A complete financial diagnosis to identify risks, gaps, and opportunities for improvement.',
          },
          {
            title: 'Business Plan',
            description: 'Clear business plan structuring to support financing, strategy, and executive decision-making.',
          },
          {
            title: 'Accounting & tax compliance',
            description: 'Accounting operations, tax obligations, and reliable financial reporting for better management visibility.',
          },
          {
            title: 'Entrepreneurial engineering',
            description: 'Legal-financial structuring, regulatory compliance, and support to secure required licenses and approvals.',
          },
          {
            title: 'Training',
            description: 'Practical programs in management and steering to strengthen leadership and team capabilities.',
          },
          {
            title: 'Fractional CFO',
            description: 'Part-time financial steering with dashboards, KPIs, and decision support.',
          },
        ],
      },
      insightsSection: {
        eyebrow: 'Insights',
        title: 'Latest news and thought leadership for financial decision-makers',
        description: 'Concise perspectives on finance, governance, strategy, and performance topics relevant to leadership teams.',
        cta: 'View all articles',
        defaultCategory: 'News',
        latestInsight: 'Latest insight',
        readArticle: 'Read article',
      },
      trainingsSection: {
        eyebrow: 'Executive training',
        title: 'Upcoming trainings that turn expertise into organizational capability',
        description: 'Short-format, practical programs designed for leaders, managers, and finance teams who need immediate application.',
        cta: 'Browse trainings',
        nextSession: 'Next session',
        deliverySuffix: 'delivery',
        viewProgram: 'View program',
        noTrainingsTitle: 'No active training yet',
        noTrainingsDescription: 'Upcoming active trainings will appear here as soon as they are published.',
      },
    },
    about: {
      metadataTitle: 'About',
      metadataDescription: 'Learn about AMENA CONSULTING, our mission, and our approach to strategic financial advisory and executive capability building.',
      eyebrow: 'About us',
      title: 'A trusted partner for corporate finance and strategic transformation',
      description: 'We work with organizations that need rigor, clarity, and practical implementation support across finance, governance, and performance.',
      cards: [
        ['Our mission', 'Help organizations make better financial and strategic decisions through structured advisory and practical executive support.'],
        ['Our vision', 'To be a leading partner for institutions seeking resilient growth, disciplined execution, and stronger governance.'],
        ['Our approach', 'Insight-led, client-centered, and implementation-focused—combining analytical depth with business realism.'],
      ],
      reasonsTitle: 'Why clients choose AMENA CONSULTING',
      reasons: [
        'Strong expertise in finance and performance management',
        'Executive-ready deliverables and decision frameworks',
        'Training programs grounded in real business cases',
        'A balance of analytical rigor and practical execution',
      ],
    },
    servicesPage: {
      metadataTitle: 'Services',
      metadataDescription: 'Explore the consulting services offered by AMENA CONSULTING across corporate finance, strategy, governance, and executive training.',
      eyebrow: 'Services',
      title: 'Structured services to diagnose, steer, and accelerate growth',
      description: 'From audit to fractional finance leadership, we deliver practical interventions to strengthen reporting, secure financing, and improve executive steering.',
      scopeLabel: 'Scope',
      formatLabel: 'Format',
      durationLabel: 'Duration',
      pricingLabel: 'Pricing',
      deliverablesLabel: 'Services & deliverables',
      outcomeLabel: 'Expected outcome',
      audienceLabel: 'Target audience',
      specialtiesLabel: 'Specialties',
      ctaTitle: 'Need a tailored advisory engagement?',
      ctaDescription: 'We can design a mission around your business model, board priorities, transformation roadmap, or team capability needs.',
      ctaButton: 'Start a conversation',
    },
    contact: {
      metadataTitle: 'Contact',
      metadataDescription: 'Contact AMENA CONSULTING to discuss advisory engagements, executive training, or partnership opportunities.',
      eyebrow: 'Contact',
      title: 'Let’s discuss your next strategic priority',
      description: 'Reach out for consulting engagements, executive workshops, or tailored advisory support.',
      socialTitle: 'Social media',
      socialDescription: 'Follow AMENA CONSULTING on its official platforms to stay informed about news and publications.',
      formTitle: 'Send a message',
      placeholders: {
        name: 'Full name',
        email: 'Email address',
        company: 'Company',
        phone: 'Phone number',
        subject: 'Subject',
        message: 'Tell us about your needs...',
      },
      submit: 'Send inquiry',
    },
    news: {
      metadataTitle: 'News',
      metadataDescription: 'Read the latest insights and corporate news from AMENA CONSULTING on finance, strategy, and governance.',
      title: 'News',
      heroTitle: 'Insights for financial leaders and decision-makers',
      heroDescription: 'A modern editorial space for articles, commentary, and corporate perspectives on finance, governance, and transformation.',
      totalArticles: 'Total articles',
      showing: 'Showing',
      of: 'of',
      articleSingular: 'article',
      articlePlural: 'articles',
      activeFilters: 'Active filters',
      searchPrefix: 'Search',
      noArticlesTitle: 'No articles found',
      noArticlesDescription: 'Try a different keyword or category filter to explore more insights.',
      allCategories: 'All categories',
      searchPlaceholder: 'Search articles, topics, or keywords',
      searchButton: 'Search',
      paginationLabel: 'Pagination',
      previous: 'Previous',
      next: 'Next',
      readMore: 'Read more',
      upcomingPublication: 'Upcoming publication',
      excerptFallback: 'Read the full article for detailed insight and expert commentary.',
      defaultCategory: 'News',
      defaultAuthor: 'AMENA CONSULTING',
      backToAll: 'Back to all news',
      articleNotFound: 'Article not found',
      draft: 'Draft',
      sectionSingular: 'section',
      sectionPlural: 'sections',
    },
    trainingsPage: {
      metadataTitle: 'Trainings',
      metadataDescription: 'Discover seminars and executive training programs offered by AMENA CONSULTING.',
      eyebrow: 'Training & seminars',
      title: 'Corporate learning programs designed for practical financial impact',
      description: 'Explore professional training and seminar formats built to strengthen financial capability, governance practices, and decision-making across organizations.',
      availablePrograms: 'Available programs',
      showing: 'Showing',
      of: 'of',
      programSingular: 'program',
      programPlural: 'programs',
      activeFilters: 'Active filters',
      searchPrefix: 'Search',
      searchPlaceholder: 'Search trainings, topics, or keywords',
      searchButton: 'Search',
      paginationLabel: 'Training pagination',
      previous: 'Previous',
      next: 'Next',
      sessionDate: 'Session date',
      price: 'Price',
      programFee: 'Program fee',
      registerNow: 'Register now',
      viewProgramDetails: 'View program details',
      trainingNotFound: 'Training not found',
      noTrainingsTitle: 'No training found',
      noTrainingsDescription: 'Try a different keyword to broaden your search.',
      noPublishedTrainingsDescription: 'No published training is available at the moment.',
      backToAll: 'Back to all trainings',
      programModules: 'Program modules',
      programInformation: 'Program information',
      duration: 'Duration',
      audience: 'Audience',
      nextSession: 'Next session',
      registerInterest: 'Register interest',
    },
    notFound: {
      title: 'Page not found',
      description: 'The page you requested does not exist or has been moved.',
      cta: 'Return home',
    },
    language: {
      label: 'Language',
      fr: 'FR',
      en: 'EN',
    },
  },
};

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeSiteCopy(fallbackValue, overrideValue) {
  if (overrideValue === undefined) {
    return fallbackValue;
  }

  if (Array.isArray(overrideValue)) {
    return overrideValue;
  }

  if (!isPlainObject(fallbackValue) || !isPlainObject(overrideValue)) {
    return overrideValue;
  }

  const merged = { ...fallbackValue };

  Object.entries(overrideValue).forEach(([key, value]) => {
    merged[key] = mergeSiteCopy(fallbackValue?.[key], value);
  });

  return merged;
}

function getStaticSiteCopy(locale) {
  return siteCopy[normalizeLocale(locale)] || siteCopy[DEFAULT_LOCALE];
}

const getStoredSiteContent = cache(async () => (await fetchSiteContent()) || null);

const getSiteCopy = cache(async (locale) => {
  const normalizedLocale = normalizeLocale(locale);
  const fallbackCopy = getStaticSiteCopy(normalizedLocale);
  const storedContent = await getStoredSiteContent();
  const localizedOverride = isPlainObject(storedContent?.[normalizedLocale]) ? storedContent[normalizedLocale] : {};

  return mergeSiteCopy(fallbackCopy, localizedOverride);
});

async function getCompanyContent(locale) {
  const copy = await getSiteCopy(locale);
  return {
    ...company,
    description: copy.companyDescription,
  };
}

async function getNavigation(locale) {
  return (await getSiteCopy(locale)).navigation;
}

async function getStats(locale) {
  return (await getSiteCopy(locale)).stats;
}

async function getServices(locale) {
  return (await getSiteCopy(locale)).services;
}

async function getFallbackArticles(locale) {
  return (await getSiteCopy(locale)).fallbackArticles;
}

async function getTrainings(locale) {
  return (await getSiteCopy(locale)).trainings;
}

async function getTrainingBySlug(slug, locale) {
  return (await getTrainings(locale)).find((training) => training.slug === slug);
}

export {
  getCompanyContent,
  getFallbackArticles,
  getNavigation,
  getServices,
  getSiteCopy,
  getStats,
  getTrainingBySlug,
  getTrainings,
};