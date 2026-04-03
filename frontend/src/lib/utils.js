import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getIntlLocale } from '@/lib/i18n';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function formatDate(date, locale = 'en') {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export { cn, formatDate };
