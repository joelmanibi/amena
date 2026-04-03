import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_COOKIE_NAME = 'amena_admin_token';
const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'];

function decodeTokenPayload(token) {
  const parts = token?.split('.') || [];
  if (parts.length < 2) {
    return null;
  }

  try {
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(Buffer.from(normalized, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

function buildSession(token) {
  const payload = decodeTokenPayload(token);
  if (!payload?.id || !payload?.email || !payload?.role) {
    return null;
  }

  return {
    token,
    user: {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    },
    expiresAt: payload.exp ? payload.exp * 1000 : null,
  };
}

async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const session = buildSession(token);
  if (!session) {
    cookieStore.delete(ADMIN_COOKIE_NAME);
    return null;
  }

  if (session.expiresAt && session.expiresAt <= Date.now()) {
    cookieStore.delete(ADMIN_COOKIE_NAME);
    return null;
  }

  return session;
}

async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session || !ADMIN_ROLES.includes(session.user.role)) {
    redirect('/admin/login');
  }

  return session;
}

async function setAdminSession(token) {
  const cookieStore = await cookies();
  const session = buildSession(token);
  const maxAge = session?.expiresAt ? Math.max(1, Math.floor((session.expiresAt - Date.now()) / 1000)) : 60 * 60 * 8;

  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });

  return session;
}

async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export { ADMIN_COOKIE_NAME, ADMIN_ROLES, clearAdminSession, getAdminSession, requireAdminSession, setAdminSession };