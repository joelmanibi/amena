export const company = {
  name: 'AMENA CONSULTING',
  shortName: 'Amena',
  description:
    'Corporate finance advisory, executive training, and strategic insight for institutions seeking sustainable growth and resilient decision-making.',
  email: 'amena.cons@gmail.com',
  phone: '+225 07 49 64 40 55 / +225 27 24 18 77',
  address: 'Cocody Angré, Abidjan, Côte d’Ivoire',
};

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'News', href: '/news' },
  { label: 'Trainings', href: '/trainings' },
  { label: 'Contact', href: '/contact' },
];

export const stats = [
  { label: 'Years of advisory experience', value: '12+' },
  { label: 'Corporate transformation projects', value: '85+' },
  { label: 'Training participants supported', value: '1,500+' },
  { label: 'Regional markets covered', value: '9' },
];

export const services = [
  {
    title: 'Corporate Finance Advisory',
    description: 'Financial modeling, business planning, feasibility studies, and decision support for boards and executive teams.',
  },
  {
    title: 'Strategy & Performance',
    description: 'Business diagnostics, growth roadmaps, KPI design, and transformation support for sustainable results.',
  },
  {
    title: 'Risk & Governance',
    description: 'Internal control, financial risk assessment, governance strengthening, and policy framework design.',
  },
  {
    title: 'Executive Learning',
    description: 'High-impact seminars and practical training programs in finance, compliance, and leadership execution.',
  },
];

export const articles = [
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
];

export const trainings = [
  {
    slug: 'strategic-financial-analysis-for-managers',
    title: 'Strategic Financial Analysis for Managers',
    summary: 'A practical executive program focused on reading financial signals, planning scenarios, and improving strategic decisions.',
    description:
      'Designed for managers and department heads who need to translate financial reporting into operational and strategic action.',
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
    description:
      'This program helps organizations modernize annual budgeting and connect forecasts to management performance routines.',
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
    description:
      'A focused workshop covering risk ownership, control design, governance reporting, and executive escalation mechanisms.',
    format: 'Online',
    duration: '1 day',
    audience: 'Executives, internal control leads, and risk managers',
    nextSession: '2026-06-20',
    price: '$320',
    modules: ['Risk taxonomy', 'Control design', 'Governance reporting', 'Board-ready escalation'],
  },
];

function getArticleBySlug(slug) {
  return articles.find((article) => article.slug === slug);
}

function getTrainingBySlug(slug) {
  return trainings.find((training) => training.slug === slug);
}

export { getArticleBySlug, getTrainingBySlug };
