import { getIntlLocale, normalizeLocale } from '@/lib/i18n';

const API_BASE_URL = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const trainingDeliveryModeLabels = {
  fr: {
    onsite: 'Présentiel',
    online: 'En ligne',
    hybrid: 'Hybride',
  },
  en: {
    onsite: 'Onsite',
    online: 'Online',
    hybrid: 'Hybrid',
  },
};

function buildUrl(path, query = {}) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ''}`;
}

async function fetchJson(path, { query, ...options } = {}) {
  const response = await fetch(buildUrl(path, query), {
    headers: {
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = new Error(`API request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

function getArticleMeta(payload, fallbackPage = 1, fallbackLimit = 6) {
  return payload.meta || {
    total: 0,
    page: fallbackPage,
    limit: fallbackLimit,
    totalPages: 1,
  };
}

function getTrainingMeta(payload, fallbackPage = 1, fallbackLimit = 6) {
  return payload.meta || {
    total: 0,
    page: fallbackPage,
    limit: fallbackLimit,
    totalPages: 1,
  };
}

function getTrainingDeliveryModeLabel(deliveryMode, locale = 'fr') {
  const normalizedLocale = normalizeLocale(locale);
  return trainingDeliveryModeLabels[normalizedLocale]?.[deliveryMode] || deliveryMode || '—';
}

function getTrainingPriceLabel(value, currency = 'USD', locale = 'fr') {
  if (value === null || value === undefined || value === '') {
    return normalizeLocale(locale) === 'fr' ? 'Sur devis' : 'On request';
  }

  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function getNextSessionDate(sessions = []) {
  const sortableSessions = sessions
    .filter((session) => session?.startDate && session.status !== 'cancelled')
    .sort((left, right) => new Date(left.startDate).getTime() - new Date(right.startDate).getTime());

  if (!sortableSessions.length) {
    return null;
  }

  const now = Date.now();
  return sortableSessions.find((session) => new Date(session.startDate).getTime() >= now)?.startDate || sortableSessions[0].startDate;
}

function normalizeTraining(training, locale = 'fr') {
  if (!training) {
    return null;
  }

  return {
    ...training,
    format: getTrainingDeliveryModeLabel(training.deliveryMode, locale),
    duration: training.durationText || '',
    nextSession: getNextSessionDate(training.sessions || []),
    priceLabel: getTrainingPriceLabel(training.price, training.currency, locale),
    summary: training.summary || training.description || '',
    audience: training.audience || '',
    modules: Array.isArray(training.modules) ? training.modules : [],
  };
}

export async function getArticleCategories() {
  try {
    const payload = await fetchJson('/categories', { next: { revalidate: 300 } });
    return payload.data || [];
  } catch {
    return [];
  }
}

export async function getCompanyProfile() {
  try {
    const payload = await fetchJson('/company-profile', { next: { revalidate: 120 } });
    return payload.data || null;
  } catch {
    return null;
  }
}

export async function getSiteContent() {
  try {
    const payload = await fetchJson('/site-content', { next: { revalidate: 120 } });
    return payload.data || null;
  } catch {
    return null;
  }
}

export async function getArticles({ page = 1, limit = 6, search, category, categoryId, ...options } = {}) {
  try {
    return await fetchJson('/articles', {
      query: { page, limit, search, category, categoryId },
      cache: 'no-store',
      ...options,
    });
  } catch {
    return {
      data: [],
      meta: getArticleMeta({}, page, limit),
    };
  }
}

export async function getLatestArticles(limit = 3) {
  const payload = await getArticles({ page: 1, limit });
  return payload.data || [];
}

export async function getAllArticles({ limit = 100 } = {}) {
  try {
    const firstPage = await getArticles({
      page: 1,
      limit,
      cache: 'force-cache',
      next: { revalidate: 300 },
    });
    const firstPageMeta = getArticleMeta(firstPage, 1, limit);

    if (firstPageMeta.totalPages <= 1) {
      return firstPage.data || [];
    }

    const remainingPages = await Promise.all(
      Array.from({ length: firstPageMeta.totalPages - 1 }, (_, index) =>
        getArticles({
          page: index + 2,
          limit,
          cache: 'force-cache',
          next: { revalidate: 300 },
        })
      )
    );

    return [firstPage, ...remainingPages].flatMap((payload) => payload.data || []);
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug) {
  try {
    const payload = await fetchJson(`/articles/${slug}`, { next: { revalidate: 120 } });
    return payload.data || null;
  } catch (error) {
    if (error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function getTrainings({ page = 1, limit = 50, search, deliveryMode, locale = 'fr', ...options } = {}) {
  try {
    const payload = await fetchJson('/trainings', {
      query: { page, limit, search, deliveryMode },
      cache: 'no-store',
      ...options,
    });

    return {
      ...payload,
      data: (payload.data || []).map((training) => normalizeTraining(training, locale)),
      meta: getTrainingMeta(payload, page, limit),
    };
  } catch {
    return {
      data: [],
      meta: getTrainingMeta({}, page, limit),
    };
  }
}

export async function getTrainingBySlug(slug, { locale = 'fr', ...options } = {}) {
  if (!slug) {
    return null;
  }

  try {
    const payload = await fetchJson(`/trainings/slug/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      ...options,
    });

    return normalizeTraining(payload.data, locale);
  } catch (error) {
    if (error.status === 404) {
      return null;
    }

    throw error;
  }
}
