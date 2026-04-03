import { createCategoryAction, deleteCategoryAction, updateCategoryAction } from '@/app/admin/actions';
import { AdminField } from '@/components/admin/admin-field';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatusBadge } from '@/components/admin/admin-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { listAdminCategories } from '@/lib/admin-api';

async function CategoriesAdminPage() {
  const payload = await listAdminCategories();
  const categories = payload.data || [];

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Gestion des catégories" description="Maintenez la taxonomie utilisée pour organiser le module actualités et la découverte des articles." />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Créer une catégorie</CardTitle>
            <CardDescription>Ajoutez une catégorie pour le filtrage éditorial et la navigation.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCategoryAction} className="space-y-4">
              <AdminField label="Nom">
                <Input name="name" required />
              </AdminField>
              <AdminField label="Slug">
                <Input name="slug" placeholder="reglementation-financiere" />
              </AdminField>
              <AdminField label="Description">
                <Input name="description" />
              </AdminField>
              <AdminField label="Ordre de tri">
                <Input name="sortOrder" type="number" min="0" defaultValue="0" />
              </AdminField>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" name="isActive" defaultChecked className="h-4 w-4 rounded border-slate-300" />
                <span>Catégorie active</span>
              </label>
              <Button type="submit">Créer la catégorie</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>Slug : {category.slug}</CardDescription>
                  </div>
                  <AdminStatusBadge status={category.isActive ? 'published' : 'archived'} label={category.isActive ? 'Actif' : 'Inactif'} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={updateCategoryAction} className="space-y-4">
                  <input type="hidden" name="id" value={category.id} />

                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Nom">
                      <Input name="name" defaultValue={category.name} required />
                    </AdminField>
                    <AdminField label="Slug">
                      <Input name="slug" defaultValue={category.slug} />
                    </AdminField>
                  </div>

                  <AdminField label="Description">
                    <Input name="description" defaultValue={category.description || ''} />
                  </AdminField>

                  <div className="grid gap-4 md:grid-cols-2">
                  <AdminField label="Ordre de tri">
                      <Input name="sortOrder" type="number" min="0" defaultValue={category.sortOrder || 0} />
                    </AdminField>
                    <label className="mt-8 flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" name="isActive" defaultChecked={category.isActive} className="h-4 w-4 rounded border-slate-300" />
                      <span>Catégorie active</span>
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button type="submit">Enregistrer les modifications</Button>
                  </div>
                </form>

                <form action={deleteCategoryAction}>
                  <input type="hidden" name="id" value={category.id} />
                  <Button type="submit" variant="outline">
                    Supprimer
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
          {!categories.length ? <p className="text-sm text-slate-500">Aucune catégorie configurée pour le moment.</p> : null}
        </div>
      </div>
    </div>
  );
}

export default CategoriesAdminPage;