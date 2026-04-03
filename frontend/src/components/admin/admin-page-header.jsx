function AdminPageHeader({ eyebrow = 'Administration', title, description }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">{eyebrow}</p>
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-black">{title}</h1>
        {description ? <p className="max-w-3xl text-sm text-brand-gray-dark">{description}</p> : null}
      </div>
    </div>
  );
}

export { AdminPageHeader };