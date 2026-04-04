'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Newspaper, Tags, GraduationCap, CalendarDays, ClipboardList, Mail, LogOut, Users2 } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/app/admin/actions';
import { cn } from '@/lib/utils';

const items = [
  { href: '/admin', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { href: '/admin/articles', label: 'Articles', icon: Newspaper },
  { href: '/admin/categories', label: 'Catégories', icon: Tags },
  { href: '/admin/trainings', label: 'Formations', icon: GraduationCap },
  { href: '/admin/team', label: 'Équipe', icon: Users2 },
  { href: '/admin/sessions', label: 'Sessions', icon: CalendarDays },
  { href: '/admin/registrations', label: 'Inscriptions', icon: ClipboardList },
  { href: '/admin/contact-messages', label: 'Messages de contact', icon: Mail },
];

const roleLabels = {
  SUPER_ADMIN: 'Super administrateur',
  ADMIN: 'Administrateur',
  EDITOR: 'Éditeur',
};

function AdminSidebar({ session }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }

    return pathname?.startsWith(href);
  };

  return (
    <aside className="flex h-full flex-col border-r border-white/10 bg-[#66666B] text-white lg:sticky lg:top-0 lg:h-screen">
      <div className="border-b border-white/10 px-6 py-6">
        <div>
          <BrandLogo variant="light" alt="Amena Admin" imageClassName="h-10 max-w-[180px]" />
          <p className="mt-3 text-xs text-brand-gray-modern">Espace de gestion sécurisé</p>
        </div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/75">
          <p className="font-medium text-white">{session.user.email}</p>
          <p className="mt-1 text-brand-gray-modern">Rôle : {roleLabels[session.user.role] || session.user.role}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-brand-red text-white shadow-corporate'
                  : 'text-white/75 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <form action={logoutAction}>
          <Button type="submit" variant="secondary" className="w-full justify-center gap-2 border border-white/10 bg-white/5 text-white hover:bg-brand-red hover:text-white">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </form>
      </div>
    </aside>
  );
}

export { AdminSidebar };