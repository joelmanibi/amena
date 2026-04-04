import { NextResponse } from 'next/server';

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

function hasValidAdminSession(token) {
  const payload = decodeTokenPayload(token);
  if (!payload?.id || !payload?.email || !payload?.role) {
    return false;
  }

  if (!ADMIN_ROLES.includes(payload.role)) {
    return false;
  }

  if (payload.exp && payload.exp * 1000 <= Date.now()) {
    return false;
  }

  return true;
}

function getForwardedHeader(request, name) {
  const value = request.headers.get(name);
  if (!value) {
    return null;
  }

  return value.split(',')[0]?.trim() || null;
}

function buildProxyAwareUrl(request, pathname) {
  const forwardedProto = getForwardedHeader(request, 'x-forwarded-proto');
  const forwardedHost = getForwardedHeader(request, 'x-forwarded-host');
  const forwardedPort = getForwardedHeader(request, 'x-forwarded-port');
  const hostHeader = getForwardedHeader(request, 'host');
  const protocol = forwardedProto || request.nextUrl.protocol.replace(':', '') || 'https';
  const baseHost = forwardedHost || hostHeader || request.nextUrl.host;

  if (!baseHost) {
    return new URL(pathname, request.url);
  }

  const hostAlreadyHasPort = baseHost.includes(':');
  const shouldAppendPort = forwardedPort && !hostAlreadyHasPort && !['80', '443'].includes(forwardedPort);
  const finalHost = shouldAppendPort ? `${baseHost}:${forwardedPort}` : baseHost;

  return new URL(`${protocol}://${finalHost}${pathname}`);
}

export function middleware(request) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const { pathname, search } = request.nextUrl;
  const hasValidSession = hasValidAdminSession(token);

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (pathname === '/admin/login') {
    if (hasValidSession) {
      return NextResponse.redirect(buildProxyAwareUrl(request, '/admin'));
    }

    const response = NextResponse.next();
    if (token && !hasValidSession) {
      response.cookies.delete(ADMIN_COOKIE_NAME);
    }

    return response;
  }

  if (!hasValidSession) {
    const loginUrl = buildProxyAwareUrl(request, '/admin/login');
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      response.cookies.delete(ADMIN_COOKIE_NAME);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};