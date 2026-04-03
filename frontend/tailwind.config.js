/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#C4161C',
        'brand-red-dark': '#8F0E12',
        'brand-red-light': '#F16A6F',
        'brand-black': '#000000',
        'brand-gray-dark': '#525255',
        'brand-gray-modern': '#9B9A9A',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        soft: '0 20px 50px -25px rgba(15, 23, 42, 0.25)',
        corporate: '0 18px 45px -28px rgba(0, 0, 0, 0.18)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top, rgba(196,22,28,.12), transparent 42%), linear-gradient(135deg, rgba(255,255,255,1), rgba(250,250,250,1))',
        'brand-gradient': 'linear-gradient(135deg, #C4161C 0%, #8F0E12 100%)',
      },
    },
  },
  plugins: [],
};
