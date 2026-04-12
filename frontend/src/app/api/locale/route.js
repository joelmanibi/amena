import { NextResponse } from 'next/server';
import { LOCALE_COOKIE_NAME, normalizeLocale } from '@/lib/i18n';

function sanitizeRedirectPath(value) {
  if (!value || !value.startsWith('/')) {
    return '/';
  }

  return value;
}

function getForwardedHeader(request, name) {
  const value = request.headers.get(name);
  if (!value) {
    return null;
  }

  return value.split(',')[0]?.trim() || null;
}

export function GET(request) {
  const url = new URL(request.url);
  const locale = normalizeLocale(url.searchParams.get('lang'));
  const nextPath = sanitizeRedirectPath(url.searchParams.get('next'));
  const forwardedProto = getForwardedHeader(request, 'x-forwarded-proto');
  const forwardedHost = getForwardedHeader(request, 'x-forwarded-host');
  const forwardedPort = getForwardedHeader(request, 'x-forwarded-port');
  const hostHeader = getForwardedHeader(request, 'host');
  const protocol = forwardedProto || url.protocol.replace(':', '') || 'https';
  const baseHost = forwardedHost || hostHeader || url.host;
  const hostAlreadyHasPort = baseHost.includes(':');
  const shouldAppendPort = forwardedPort && !hostAlreadyHasPort && !['80', '443'].includes(forwardedPort);
  const finalHost = shouldAppendPort ? `${baseHost}:${forwardedPort}` : baseHost;
  const response = NextResponse.redirect(new URL(`${protocol}://${finalHost}${nextPath}`));

  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}