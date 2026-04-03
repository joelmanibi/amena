'use client';

import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/brand-logo';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

const roleLabels = {
  SUPER_ADMIN: 'Super administrateur',
  ADMIN: 'Administrateur',
  EDITOR: 'Éditeur',
};

function AdminShell({ children, session }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return children;
  }

  if (!session) {
    return children;
  }

  return (
    <div className="min-h-screen bg-[#f6f6f7]">
      <div className="grid min-h-screen lg:grid-cols-[300px_1fr]">
        <AdminSidebar session={session} />

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-brand-gray-modern/20 bg-white/90 backdrop-blur">
            <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div className="flex items-center gap-4">
                <BrandLogo variant="red" alt="AMENA CONSULTING" imageClassName="h-10 max-w-[180px]" />
                <div className="hidden h-10 w-px bg-brand-gray-modern/20 sm:block" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">Administration</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand-black">Tableau de bord AMENA CONSULTING</h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-brand-gray-modern/30 bg-white px-4 py-2 text-xs font-medium text-brand-gray-dark">
                  Espace d’administration sécurisé
                </div>
                <div className="rounded-full bg-[#66666B] px-4 py-2 text-xs font-medium text-white">
                  {roleLabels[session.user.role] || session.user.role}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export { AdminShell };