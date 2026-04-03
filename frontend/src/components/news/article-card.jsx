import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

function ArticleCard({ article, locale, copy }) {
  const primaryCategory = article.categories?.[0]?.name || article.category || copy.defaultCategory;
  const authorName = article.author?.fullName || article.author || copy.defaultAuthor;

  return (
    <Card className="group h-full rounded-[1.5rem] border-brand-gray-modern bg-white transition-all duration-200 hover:-translate-y-1 hover:border-brand-red hover:shadow-corporate">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Badge className="bg-brand-red-light text-white hover:bg-brand-red-light">{primaryCategory}</Badge>
          <CardDescription className="text-brand-gray-dark">{authorName}</CardDescription>
        </div>
        <CardTitle className="line-clamp-2 text-brand-black transition-colors duration-200 group-hover:text-brand-red">{article.title}</CardTitle>
        <CardDescription className="text-brand-gray-dark">{article.publishedAt ? formatDate(article.publishedAt, locale) : copy.upcomingPublication}</CardDescription>
      </CardHeader>
      <CardContent className="flex h-full flex-col">
        <p className="line-clamp-4 text-sm leading-7 text-brand-gray-dark">{article.excerpt || copy.excerptFallback}</p>
        <Link href={`/news/${article.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-red transition-colors hover:text-brand-red-dark">
          {copy.readMore} <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export { ArticleCard };
