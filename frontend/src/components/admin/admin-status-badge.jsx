import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles = {
  published: 'border border-brand-red/15 bg-brand-red/10 text-brand-red-dark',
  draft: 'border border-brand-gray-modern/25 bg-brand-gray-modern/15 text-brand-gray-dark',
  archived: 'border border-brand-gray-modern/25 bg-brand-gray-modern/15 text-brand-black',
  open: 'border border-brand-red/15 bg-brand-red/10 text-brand-red-dark',
  closed: 'border border-brand-gray-modern/25 bg-brand-gray-modern/15 text-brand-gray-dark',
  completed: 'border border-brand-gray-modern/25 bg-brand-gray-modern/15 text-brand-black',
  cancelled: 'border border-brand-red-light/30 bg-brand-red-light/20 text-brand-red-dark',
  pending: 'border border-brand-gray-modern/25 bg-brand-gray-modern/15 text-brand-gray-dark',
  confirmed: 'border border-brand-red/15 bg-brand-red/10 text-brand-red-dark',
  new: 'border border-brand-red-light/30 bg-brand-red-light/20 text-brand-red-dark',
  read: 'border border-brand-gray-modern/25 bg-brand-gray-modern/15 text-brand-black',
  replied: 'border border-brand-red/15 bg-brand-red/10 text-brand-red-dark',
};

const statusLabels = {
  published: 'Publié',
  draft: 'Brouillon',
  archived: 'Archivé',
  open: 'Ouvert',
  closed: 'Fermé',
  completed: 'Terminé',
  cancelled: 'Annulé',
  pending: 'En attente',
  confirmed: 'Confirmé',
  new: 'Nouveau',
  read: 'Lu',
  replied: 'Répondu',
  active: 'Actif',
  inactive: 'Inactif',
};

function AdminStatusBadge({ status, label }) {
  return (
    <Badge className={cn('capitalize', statusStyles[status] || 'border border-brand-gray-modern/25 bg-brand-gray-modern/15 text-brand-black')}>
      {label || statusLabels[status] || String(status || 'inconnu').replace(/_/g, ' ')}
    </Badge>
  );
}

export { AdminStatusBadge };