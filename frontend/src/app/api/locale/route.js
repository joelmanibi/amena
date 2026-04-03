import { NextResponse } from 'next/server';
import { LOCALE_COOKIE_NAME, normalizeLocale } from '@/lib/i18n';

function sanitizeRedirectPath(value) {
  if (!value || !value.startsWith('/')) {
    return '/';
  }

  return value;
}

export function GET(request) {
  const url = new URL(request.url);
  const locale = normalizeLocale(url.searchParams.get('lang'));
  const nextPath = sanitizeRedirectPath(url.searchParams.get('next'));
  const response = NextResponse.redirect(new URL(nextPath, request.url));

  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}