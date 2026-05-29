interface MemberDetailCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function MemberDetailCard({
  title,
  children,
  className = "",
  icon,
}: MemberDetailCardProps) {
  return (
    <section
      className={`card-elevated p-5 sm:p-6 ${className}`}
    >
      <div className="mb-4 flex items-center gap-2 border-b border-supira-border/60 pb-3">
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
            {icon}
          </div>
        )}
        <h2 className="text-sm font-semibold text-supira-primary">{title}</h2>
      </div>
      <dl>{children}</dl>
    </section>
  );
}

export function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="grid grid-cols-1 gap-1 py-3 border-b border-supira-border/40 last:border-0 sm:grid-cols-[minmax(7rem,30%)_1fr] sm:gap-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-supira-subtle sm:pt-0.5">
        {label}
      </dt>
      <dd className="text-sm text-slate-800 leading-relaxed">{value}</dd>
    </div>
  );
}
