import Link from 'next/link';
import { ArrowRight, CalendarDays, Newspaper, User2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

function getArticleDate(article, locale, copy) {
  return article.publishedAt ? formatDate(article.publishedAt, locale) : copy.upcomingPublication;
}

function getArticleImageStyle(article) {
  return article.featuredImageUrl ? { backgroundImage: `url('${article.featuredImageUrl}')` } : undefined;
}

function getArticleCategory(article, copy) {
  return article.categories?.[0]?.name || article.category || copy.defaultCategory;
}

function getArticleAuthor(article, copy) {
  return article.author?.fullName || article.author || copy.defaultAuthor;
}

function ArticleCard({ article, locale, copy, variant = 'default' }) {
  const primaryCategory = getArticleCategory(article, copy);
  const authorName = getArticleAuthor(article, copy);
  const publicationLabel = getArticleDate(article, locale, copy);
  const imageStyle = getArticleImageStyle(article);
  const summary = article.excerpt || copy.excerptFallback;

  if (variant === 'featured') {
    return (
      <article className="group overflow-hidden rounded-[1.5rem] border border-brand-gray-modern/20 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-corporate">
        <div className="grid gap-8 p-0 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <div className="relative min-h-[22rem] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(241,106,111,0.18),transparent_35%),linear-gradient(135deg,#7f1017_0%,#c4161c_48%,#1f1f23_100%)]">
            {article.featuredImageUrl ? (
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={imageStyle} />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/75 via-brand-black/25 to-transparent" />

            <div className="absolute left-5 top-5 flex flex-wrap items-center gap-3">
              <Badge className="border-0 bg-white/90 text-brand-black hover:bg-white">{primaryCategory}</Badge>
            </div>

            {!article.featuredImageUrl ? (
              <div className="absolute bottom-5 left-5 inline-flex items-center gap-3 text-white/90">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                  <Newspaper className="h-6 w-6" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.22em]">AMENA NEWSROOM</span>
              </div>
            ) : null}
          </div>

          <div className="flex h-full flex-col justify-center px-6 pb-6 pt-2 lg:px-0 lg:pb-8 lg:pr-8 lg:pt-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-brand-gray-dark">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-brand-red" />
                {publicationLabel}
              </span>
              <span className="inline-flex items-center gap-2">
                <User2 className="h-4 w-4 text-brand-red" />
                {authorName}
              </span>
            </div>

            <h3 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-brand-black transition-colors duration-200 group-hover:text-brand-red xl:text-[2.6rem]">
              {article.title}
            </h3>
            <p className="mt-5 text-base leading-8 text-brand-gray-dark">{summary}</p>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-brand-gray-modern/15 pt-5">
              <span className="text-sm font-medium text-brand-gray-dark">{primaryCategory}</span>
              <Link href={`/news/${article.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red transition-colors hover:text-brand-red-dark">
                {copy.readMore} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group">
        <Link href={`/news/${article.slug}`} className="block space-y-4">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1rem] bg-[radial-gradient(circle_at_top_left,rgba(241,106,111,0.18),transparent_35%),linear-gradient(135deg,#7f1017_0%,#c4161c_48%,#1f1f23_100%)]">
            {article.featuredImageUrl ? (
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={imageStyle} />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-brand-black/10 to-transparent" />
            {!article.featuredImageUrl ? (
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 text-white/90">
                <Newspaper className="h-5 w-5" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">News</span>
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-red">{primaryCategory}</p>
            <h3 className="text-lg font-semibold leading-6 text-brand-black transition-colors duration-200 group-hover:text-brand-red">
              {article.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-brand-gray-dark">
              <span>{publicationLabel}</span>
              <span>{authorName}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'list') {
    return (
      <article className="group border-b border-brand-gray-modern/15 pb-6 last:border-b-0 last:pb-0">
        <div className="grid gap-5 sm:grid-cols-[12rem_1fr] sm:items-start">
          <Link href={`/news/${article.slug}`} className="block">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1rem] bg-[radial-gradient(circle_at_top_left,rgba(241,106,111,0.18),transparent_35%),linear-gradient(135deg,#7f1017_0%,#c4161c_48%,#1f1f23_100%)]">
              {article.featuredImageUrl ? (
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={imageStyle} />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-brand-black/10 to-transparent" />
            </div>
          </Link>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-red">{primaryCategory}</p>
            <Link href={`/news/${article.slug}`} className="mt-2 block text-xl font-semibold leading-7 text-brand-black transition-colors duration-200 group-hover:text-brand-red">
              {article.title}
            </Link>
            <p className="mt-3 text-sm leading-7 text-brand-gray-dark">{summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-brand-gray-dark">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-brand-red" />
                {publicationLabel}
              </span>
              <span className="inline-flex items-center gap-2">
                <User2 className="h-3.5 w-3.5 text-brand-red" />
                {authorName}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-brand-gray-modern/20 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/20 hover:shadow-corporate">
      <div className="relative aspect-[16/10] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(241,106,111,0.18),transparent_35%),linear-gradient(135deg,#7f1017_0%,#c4161c_48%,#1f1f23_100%)]">
        {article.featuredImageUrl ? (
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={imageStyle} />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 via-brand-black/20 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
          <Badge className="border-0 bg-white/90 text-brand-black hover:bg-white">{primaryCategory}</Badge>
          <span className="rounded-full bg-brand-black/45 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur">{publicationLabel}</span>
        </div>
      </div>

      <div className="flex h-full flex-col p-5">
        <div className="flex flex-wrap items-center gap-4 text-sm text-brand-gray-dark">
          <span className="inline-flex items-center gap-2">
            <User2 className="h-4 w-4 text-brand-red" />
            {authorName}
          </span>
        </div>

        <h3 className="mt-4 line-clamp-2 text-xl font-semibold tracking-tight text-brand-black transition-colors duration-200 group-hover:text-brand-red">
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-4 text-sm leading-7 text-brand-gray-dark">{summary}</p>
        <Link href={`/news/${article.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-red transition-colors hover:text-brand-red-dark">
          {copy.readMore} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export { ArticleCard };