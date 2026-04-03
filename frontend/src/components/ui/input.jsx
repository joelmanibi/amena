import { cn } from '@/lib/utils';

function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'input-corporate flex h-11 w-full px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2',
        className
      )}
      {...props}
    />
  );
}

export { Input };
