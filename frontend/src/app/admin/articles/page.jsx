import { createArticleAction, deleteArticleAction, updateArticleAction } from '@/app/admin/actions';
import { AdminField } from '@/components/admin/admin-field';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { listAdminArticles, listAdminCategories } from '@/lib/admin-api';
import { formatDateTime, getRecordDate, toDateTimeLocal } from '@/lib/admin-format';

const articleStatuses = ['draft', 'published', 'archived'];
const articleStatusLabels = {
  draft: 'Brouillon',
  published: 'Publié',
  archived: 'Archivé',
};

async function ArticlesAdminPage() {
  const [articlesPayload, categoriesPayload] = await Promise.all([listAdminArticles(), listAdminCategories()]);
  const articles = articlesPayload.data || [];
  const categories = categoriesPayload.data || [];

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Gestion des articles" description="Créez, mettez à jour, publiez et organisez les actualités avec des métadonnées SEO prêtes à l’emploi." />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Créer un article</CardTitle>
            <CardDescription>Rédigez un nouveau contenu éditorial et rattachez-le à une ou plusieurs catégories.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createArticleAction} className="space-y-4">
              <AdminField label="Titre">
                <Input name="title" required />
              </AdminField>

              <AdminField label="Slug" description="Laissez vide pour le générer automatiquement à partir du titre.">
                <Input name="slug" placeholder="reforme-financiere-2026" />
              </AdminField>

              <AdminField label="Extrait">
                <Textarea name="excerpt" rows={3} />
              </AdminField>

              <AdminField label="Contenu">
                <Textarea name="content" rows={10} required />
              </AdminField>

              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="URL de l’image mise en avant">
                  <Input name="featuredImageUrl" type="url" placeholder="https://..." />
                </AdminField>

                <AdminField label="Uploader une image" description="Si tu ajoutes un fichier, il sera utilisé à la place de l’URL ci-contre.">
                  <Input name="featuredImageFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" />
                </AdminField>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Statut">
                  <Select name="status" defaultValue="draft">
                    {articleStatuses.map((status) => (
                      <option key={status} value={status}>
                        {articleStatusLabels[status] || status}
                      </option>
                    ))}
                  </Select>
                </AdminField>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Titre SEO">
                  <Input name="seoTitle" />
                </AdminField>

                <AdminField label="Date de publication">
                  <Input name="publishedAt" type="datetime-local" />
                </AdminField>
              </div>

              <AdminField label="Description SEO">
                <Textarea name="seoDescription" rows={3} />
              </AdminField>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">Catégories</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                      <input type="checkbox" name="categoryIds" value={category.id} className="h-4 w-4 rounded border-slate-300" />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit">Créer l’article</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>
                      Slug : {article.slug} • {article.author?.fullName || 'Auteur inconnu'}
                    </CardDescription>
                  </div>
                  <AdminStatusBadge status={article.status} />
                </div>
                <p className="text-xs text-slate-500">Dernière mise à jour le {formatDateTime(getRecordDate(article, 'updatedAt'))}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={updateArticleAction} className="space-y-4">
                  <input type="hidden" name="id" value={article.id} />

                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Titre">
                      <Input name="title" defaultValue={article.title} required />
                    </AdminField>
                    <AdminField label="Slug">
                      <Input name="slug" defaultValue={article.slug} />
                    </AdminField>
                  </div>

                  <AdminField label="Extrait">
                    <Textarea name="excerpt" rows={3} defaultValue={article.excerpt || ''} />
                  </AdminField>

                  <AdminField label="Contenu">
                    <Textarea name="content" rows={8} defaultValue={article.content || ''} required />
                  </AdminField>

                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="URL de l’image mise en avant">
                      <Input name="featuredImageUrl" type="url" defaultValue={article.featuredImageUrl || ''} />
                    </AdminField>

                    <AdminField label="Remplacer par un fichier" description="Si tu uploades une nouvelle image, elle remplacera l’URL actuelle.">
                      <Input name="featuredImageFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" />
                    </AdminField>
                  </div>

                  {article.featuredImageUrl ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <img src={article.featuredImageUrl} alt={article.title} className="h-48 w-full object-cover" />
                    </div>
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Statut">
                      <Select name="status" defaultValue={article.status}>
                        {articleStatuses.map((status) => (
                          <option key={status} value={status}>
                            {articleStatusLabels[status] || status}
                          </option>
                        ))}
                      </Select>
                    </AdminField>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Titre SEO">
                      <Input name="seoTitle" defaultValue={article.seoTitle || ''} />
                    </AdminField>
                    <AdminField label="Date de publication">
                      <Input name="publishedAt" type="datetime-local" defaultValue={toDateTimeLocal(article.publishedAt)} />
                    </AdminField>
                  </div>

                  <AdminField label="Description SEO">
                    <Textarea name="seoDescription" rows={3} defaultValue={article.seoDescription || ''} />
                  </AdminField>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-700">Catégories</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {categories.map((category) => (
                        <label key={`${article.id}-${category.id}`} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            name="categoryIds"
                            value={category.id}
                            defaultChecked={article.categories?.some((item) => item.id === category.id)}
                            className="h-4 w-4 rounded border-slate-300"
                          />
                          <span>{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit">Enregistrer les modifications</Button>
                  </div>
                </form>

                <form action={deleteArticleAction}>
                  <input type="hidden" name="id" value={article.id} />
                  <Button type="submit" variant="outline">
                    Supprimer
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
          {!articles.length ? <p className="text-sm text-slate-500">Aucun article disponible pour le moment.</p> : null}
        </div>
      </div>
    </div>
  );
}

export default ArticlesAdminPage;