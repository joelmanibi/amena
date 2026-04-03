const SUPPORTED_LOCALES = ['fr', 'en'];
const DEFAULT_LOCALE = 'fr';
const LOCALE_COOKIE_NAME = 'amena_locale';

function normalizeLocale(value) {
  return SUPPORTED_LOCALES.includes(value) ? value : DEFAULT_LOCALE;
}

function getIntlLocale(locale) {
  return normalizeLocale(locale) === 'fr' ? 'fr-FR' : 'en-US';
}

function getOpenGraphLocale(locale) {
  return normalizeLocale(locale) === 'fr' ? 'fr_FR' : 'en_US';
}

export { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, SUPPORTED_LOCALES, getIntlLocale, getOpenGraphLocale, normalizeLocale };