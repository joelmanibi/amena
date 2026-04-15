import 'server-only';
import { redirect } from 'next/navigation';
import { clearAdminSession, requireAdminSession } from '@/lib/admin-auth';

const API_BASE_URL = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

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

async function parseResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.message || 'La requête a échoué.');
    error.status = response.status;
    error.errors = payload?.errors;
    throw error;
  }

  return payload;
}

async function adminRequest(path, { method = 'GET', query, body, cache = 'no-store' } = {}) {
  const session = await requireAdminSession();
  let response;

  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${session.token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache,
    });
  } catch (error) {
    const requestError = new Error('Impossible de joindre l’API backend. Vérifiez que le serveur backend est démarré et que l’URL API est correcte.');
    requestError.status = 503;
    requestError.cause = error;
    throw requestError;
  }

  if (response.status === 401 || response.status === 403) {
    await clearAdminSession();
    redirect('/admin/login?error=Votre+session+a+expiré.');
  }

  return parseResponse(response);
}

async function loginAdmin(credentials) {
  let response;

  try {
    response = await fetch(buildUrl('/auth/login'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      cache: 'no-store',
    });
  } catch (error) {
    const requestError = new Error('Impossible de joindre l’API backend. Vérifiez que le serveur backend est démarré et que l’URL API est correcte.');
    requestError.status = 503;
    requestError.cause = error;
    throw requestError;
  }

  return parseResponse(response);
}

async function listAdminArticles() {
  return adminRequest('/articles', { query: { page: 1, limit: 50, status: 'all' } });
}

async function listAdminCategories() {
  return adminRequest('/categories', { query: { includeInactive: 'true' } });
}

async function listAdminTrainings() {
  return adminRequest('/trainings', { query: { page: 1, limit: 50, status: 'all' } });
}

async function listAdminRegistrations({ page = 1, limit = 20, status, sessionId, programId, search } = {}) {
  return adminRequest('/registrations', {
    query: {
      page,
      limit,
      ...(status && status !== 'all' ? { status } : {}),
      ...(sessionId && sessionId !== 'all' ? { sessionId } : {}),
      ...(programId && programId !== 'all' ? { programId } : {}),
      ...(search ? { search } : {}),
    },
  });
}

async function listAdminContactMessages() {
  return adminRequest('/contact-messages', { query: { page: 1, limit: 100 } });
}

async function listAdminTeamMembers() {
  return adminRequest('/team-members', { query: { includeInactive: 'true' } });
}

async function getAdminCompanyProfile() {
  return adminRequest('/company-profile');
}

async function getAdminSiteContent() {
  return adminRequest('/site-content');
}

export {
  adminRequest,
  getAdminCompanyProfile,
  getAdminSiteContent,
  listAdminArticles,
  listAdminCategories,
  listAdminContactMessages,
  listAdminRegistrations,
  listAdminTeamMembers,
  listAdminTrainings,
  loginAdmin,
};