function AdminField({ label, description, children, className = '' }) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm font-medium text-brand-gray-dark">{label}</span>
      {children}
      {description ? <span className="text-xs text-brand-gray-modern">{description}</span> : null}
    </label>
  );
}

export { AdminField };