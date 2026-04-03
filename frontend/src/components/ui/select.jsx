import { cn } from '@/lib/utils';

function Select({ className, ...props }) {
  return (
    <select
      className={cn(
        'flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      {...props}
    />
  );
}

export { Select };