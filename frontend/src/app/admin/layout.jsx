import { AdminShell } from '@/components/admin/admin-shell';
import { getAdminSession } from '@/lib/admin-auth';

export const metadata = {
  title: 'Tableau de bord administrateur',
  description: 'Espace d’administration pour AMENA CONSULTING.',
};

async function AdminLayout({ children }) {
  const session = await getAdminSession();

  return <AdminShell session={session}>{children}</AdminShell>;
}

export default AdminLayout;