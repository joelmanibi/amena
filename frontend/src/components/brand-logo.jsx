import { cn } from '@/lib/utils';

const variants = {
  red: {
    src: '/branding/logo_rouge.png',
    imageClassName: '',
  },
  light: {
    src: '/branding/logo_noire.png',
    imageClassName: 'invert',
  },
  dark: {
    src: '/branding/logo_noire.png',
    imageClassName: '',
  },
};

function BrandLogo({ variant = 'red', alt = 'AMENA CONSULTING', className, imageClassName }) {
  const selectedVariant = variants[variant] || variants.red;

  return (
    <span className={cn('inline-flex items-center', className)}>
      <img
        src={selectedVariant.src}
        alt={alt}
        className={cn('h-10 w-auto object-contain', selectedVariant.imageClassName, imageClassName)}
      />
    </span>
  );
}

export { BrandLogo };