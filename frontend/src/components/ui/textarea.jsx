import { cn } from '@/lib/utils';

function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'input-corporate min-h-[140px] w-full px-3 py-2 text-sm shadow-sm outline-none transition focus-visible:ring-2',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
