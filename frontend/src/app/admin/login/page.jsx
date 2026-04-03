import { redirect } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from '@/app/admin/actions';
import { BrandLogo } from '@/components/brand-logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdminField } from '@/components/admin/admin-field';
import { ADMIN_ROLES, getAdminSession } from '@/lib/admin-auth';

export const metadata = {
  title: 'Connexion administrateur',
};

async function AdminLoginPage({ searchParams }) {
  const session = await getAdminSession();
  if (session && ADMIN_ROLES.includes(session.user.role)) {
    redirect('/admin');
  }

  const params = (await searchParams) || {};
  const nextPath = typeof params.next === 'string' && params.next.startsWith('/admin') ? params.next : '/admin';
  const error = typeof params.error === 'string' ? params.error : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(196,22,28,0.18),transparent_30%),#f3f4f6] px-4 py-10">
      <Card className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white shadow-corporate">
        <CardHeader>
          <div className="flex justify-center">
            <BrandLogo variant="red" alt="AMENA CONSULTING" imageClassName="h-14 max-w-[220px]" />
          </div>
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">Administration</p>
            <CardTitle className="text-brand-black">Connexion administrateur</CardTitle>
            <CardDescription className="text-brand-gray-dark">Utilisez vos identifiants internes pour accéder au tableau de bord AMENA CONSULTING.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-5">
            <input type="hidden" name="next" value={nextPath} />

            <AdminField label="Adresse e-mail">
              <Input className="h-12" name="email" type="email" placeholder="admin@amena-consulting.com" required />
            </AdminField>

            <AdminField label="Mot de passe">
              <Input className="h-12" name="password" type="password" placeholder="••••••••" required minLength={6} />
            </AdminField>

            {error ? <p className="rounded-xl border border-brand-red-light/30 bg-brand-red-light/20 px-4 py-3 text-sm text-brand-red-dark">{error}</p> : null}

            <Button type="submit" className="w-full bg-brand-red text-white hover:bg-brand-red-dark">
              Se connecter
            </Button>

            <Link href="/" className="block text-center text-sm text-brand-gray-dark transition-colors hover:text-brand-red-dark">
              Retour au site
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminLoginPage;