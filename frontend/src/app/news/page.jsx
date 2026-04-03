import { SectionHeader } from '@/components/section-header';
import { ArticleCard } from '@/components/news/article-card';
import { NewsCategoryFilter } from '@/components/news/news-category-filter';
import { PaginationControls } from '@/components/news/pagination-controls';
import { NewsSearchForm } from '@/components/news/news-search-form';
import { getArticleCategories, getArticles } from '@/lib/api';
import { getLocale } from '@/lib/locale';
import { getSiteCopy } from '@/lib/site-copy';

const PAGE_SIZE = 6;

function normalizePage(value) {
  const page = Number(value || 1);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function buildNewsHref({ page = 1, query, category }) {
  const params = new URLSearchParams();

  if (page > 1) {
    params.set('page', String(page));
  }

  if (query) {
    params.set('q', query);
  }

  if (category) {
    params.set('category', category);
  }

  const queryString = params.toString();
  return queryString ? `/news?${queryString}` : '/news';
}

export async function generateMetadata({ searchParams }) {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);
  const params = await searchParams;
  const query = typeof params?.q === 'string' ? params.q.trim() : '';
  const category = typeof params?.category === 'string' ? params.category : '';
  const page = normalizePage(params?.page);
  const categories = category ? await getArticleCategories() : [];
  const selectedCategory = categories.find((item) => item.slug === category);

  const titleParts = [copy.news.metadataTitle];
  if (selectedCategory?.name) titleParts.unshift(selectedCategory.name);
  if (query) titleParts.unshift(`${copy.news.searchPrefix}: ${query}`);
  if (page > 1) titleParts.push(`Page ${page}`);

  return {
    title: titleParts.join(' · '),
    description: selectedCategory?.description || copy.news.metadataDescription,
    alternates: {
      canonical: buildNewsHref({ page, query, category }),
    },
    robots: query
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

async function NewsPage({ searchParams }) {
  const locale = await getLocale();
  const copy = await getSiteCopy(locale);
  const params = await searchParams;
  const query = typeof params?.q === 'string' ? params.q.trim() : '';
  const selectedCategorySlug = typeof params?.category === 'string' ? params.category : '';
  const currentPage = normalizePage(params?.page);

  const [categories, articleResponse] = await Promise.all([
    getArticleCategories(),
    getArticles({
      page: currentPage,
      limit: PAGE_SIZE,
      search: query || undefined,
      category: selectedCategorySlug || undefined,
    }),
  ]);
  const selectedCategory = categories.find((category) => category.slug === selectedCategorySlug);
  const activeFilters = [query ? `${copy.news.searchPrefix} “${query}”` : null, selectedCategory?.name || null].filter(Boolean);

  const articles = articleResponse.data || [];
  const meta = articleResponse.meta || { page: 1, totalPages: 1, total: 0 };
  const totalArticles = meta.total || 0;

  return (
    <div className="bg-white py-20">
      <div className="container-shell space-y-12">
        <section className="rounded-[2rem] border border-brand-gray-modern/20 bg-[radial-gradient(circle_at_top_left,rgba(241,106,111,0.12),transparent_35%),linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] p-8 shadow-sm lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionHeader
              eyebrow={copy.news.title}
              title={copy.news.heroTitle}
              description={copy.news.heroDescription}
            />
            <div className="rounded-2xl border border-brand-gray-modern/20 bg-white px-5 py-4 text-sm text-brand-gray-dark shadow-sm">
              <p>
                {copy.news.totalArticles}: <span className="font-semibold text-brand-black">{totalArticles}</span>
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-6 rounded-[1.75rem] border border-brand-gray-modern/30 bg-white p-6 shadow-sm">
          <NewsSearchForm query={query} selectedCategory={selectedCategorySlug} copy={copy.news} />
          <NewsCategoryFilter categories={categories} selectedCategory={selectedCategorySlug} query={query} copy={copy.news} />
        </div>

        <div className="flex flex-col gap-3 text-sm text-brand-gray-dark sm:flex-row sm:items-center sm:justify-between">
          <p>
            {copy.news.showing} <span className="font-medium text-brand-black">{articles.length}</span> {copy.news.of}{' '}
            <span className="font-medium text-brand-black">{totalArticles}</span>{' '}
            {totalArticles === 1 ? copy.news.articleSingular : copy.news.articlePlural}
          </p>
          {(query || selectedCategorySlug) ? (
            <p>
              {copy.news.activeFilters}:{' '}
              <span className="font-medium text-brand-black">{activeFilters.join(' · ')}</span>
            </p>
          ) : null}
        </div>

        {articles.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id || article.slug} article={article} locale={locale} copy={copy.news} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-brand-gray-modern bg-white px-6 py-14 text-center">
            <h2 className="text-xl font-semibold text-brand-black">{copy.news.noArticlesTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-brand-gray-dark">
              {copy.news.noArticlesDescription}
            </p>
          </div>
        )}

        <PaginationControls
          page={meta.page || currentPage}
          totalPages={meta.totalPages || 1}
          query={query}
          category={selectedCategorySlug}
          copy={copy.news}
        />
      </div>
    </div>
  );
}

export default NewsPage;
