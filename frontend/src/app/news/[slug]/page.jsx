import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, User2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getCompanyContent } from '@/lib/company';
import { getLocale } from '@/lib/locale';
import { getSiteCopy } from '@/lib/site-copy';
import { getAllArticles, getArticleBySlug } from '@/lib/api';
import { formatDate } from '@/lib/utils';

function toParagraphs(content) {
  if (!content) {
    return [];
  }

  if (Array.isArray(content)) {
    return content;
  }

  return String(content)
    .split(/\n{2,}|\r\n\r\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export async function generateMetadata({ params }) {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: copy.news.articleNotFound };

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      type: 'article',
      url: `/news/${article.slug}`,
      publishedTime: article.publishedAt,
      authors: article.author?.fullName ? [article.author.fullName] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

async function ArticleDetailPage({ params }) {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);
  const company = await getCompanyContent(locale);
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const paragraphs = toParagraphs(article.content);
  const authorName = article.author?.fullName || copy.news.defaultAuthor;
  const categories = article.categories?.length ? article.categories : [];
  const siteUrl = company.websiteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || article.title,
    datePublished: article.publishedAt || undefined,
    dateModified: article.updatedAt || article.publishedAt || undefined,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: company.name,
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/news/${article.slug}`,
    articleSection: categories.map((category) => category.name),
    image: article.featuredImageUrl || undefined,
  };

  return (
    <article className="page-shell bg-white">
      <div className="container-shell max-w-5xl">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <div className="space-y-8 rounded-[2rem] border border-brand-gray-modern/20 bg-[radial-gradient(circle_at_top_left,rgba(241,106,111,0.12),transparent_34%),linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] p-8 shadow-sm lg:p-10">
          <Link href="/news" className="inline-flex items-center gap-2 text-sm font-medium text-brand-red transition-colors hover:text-brand-red-dark">
            <ArrowLeft className="h-4 w-4" />
            {copy.news.backToAll}
          </Link>

          <div className="flex flex-wrap gap-3">
            {categories.length ? (
              categories.map((category) => (
                <Link key={category.id} href={`/news?category=${category.slug}`}>
                  <Badge className="bg-brand-red-light/20 text-brand-red-dark">{category.name}</Badge>
                </Link>
              ))
            ) : (
              <Badge className="bg-brand-red-light/20 text-brand-red-dark">{copy.news.defaultCategory}</Badge>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-brand-black sm:text-5xl">{article.title}</h1>
            <div className="mt-5 flex flex-wrap gap-5 text-sm text-brand-gray-dark">
              <span className="inline-flex items-center gap-2"><User2 className="h-4 w-4 text-brand-red" />{authorName}</span>
              <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-red" />{article.publishedAt ? formatDate(article.publishedAt, locale) : copy.news.draft}</span>
              <span>{paragraphs.length || 1} {paragraphs.length === 1 ? copy.news.sectionSingular : copy.news.sectionPlural}</span>
            </div>
          </div>

          {article.excerpt ? <p className="max-w-4xl text-lg leading-8 text-brand-gray-dark">{article.excerpt}</p> : null}
        </div>

        <div className="mt-10 rounded-[2rem] border border-brand-gray-modern/20 bg-white p-8 shadow-sm lg:p-10">
          <div className="space-y-7 prose-corporate">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ArticleDetailPage;
