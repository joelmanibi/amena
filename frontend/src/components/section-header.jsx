function SectionHeader({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow ? <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-brand-red">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-brand-black sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-brand-gray-dark sm:text-lg">{description}</p> : null}
    </div>
  );
}

export { SectionHeader };
