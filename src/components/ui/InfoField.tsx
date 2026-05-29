import clsx from "clsx";
import { Minus } from "lucide-react";

interface InfoFieldProps {
  label: string;
  value?: React.ReactNode;
  hint?: string;
  highlight?: boolean;
  className?: string;
}

export function InfoField({
  label,
  value,
  hint,
  highlight = false,
  className,
}: InfoFieldProps) {
  const isEmpty =
    value === undefined ||
    value === null ||
    value === "" ||
    (typeof value === "string" && !value.trim());

  return (
    <div
      className={clsx(
        "group rounded-xl border border-transparent px-3 py-3 transition hover:border-supira-border/60 hover:bg-supira-surface/50",
        highlight && !isEmpty && "border-teal-100/80 bg-teal-50/30",
        className
      )}
    >
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-supira-subtle">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm leading-relaxed text-slate-800">
        {isEmpty ? (
          <span className="info-value-empty">
            <Minus className="h-3 w-3 shrink-0" />
            未入力
          </span>
        ) : (
          value
        )}
      </dd>
      {hint && <p className="mt-1 text-[11px] text-supira-muted">{hint}</p>}
    </div>
  );
}

export function InfoGrid({ children }: { children: React.ReactNode }) {
  return (
    <dl className="grid gap-1 sm:grid-cols-2">{children}</dl>
  );
}
