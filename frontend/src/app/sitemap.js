import { getAllArticles } from '@/lib/api';
import { trainings } from '@/lib/site-data';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const staticRoutes = ['', '/about', '/services', '/news', '/trainings', '/contact'];
  const articles = await getAllArticles();

  return [
    ...staticRoutes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date() })),
    ...articles.map((article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: new Date(article.updatedAt || article.publishedAt || Date.now()),
    })),
    ...trainings.map((training) => ({ url: `${baseUrl}/trainings/${training.slug}`, lastModified: new Date(training.nextSession) })),
  ];
}
