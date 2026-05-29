import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  highlight?: boolean;
  accent?: boolean;
  icon?: LucideIcon;
  trend?: string;
}

export function StatCard({
  label,
  value,
  sub,
  highlight,
  accent,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:shadow-card-hover",
        highlight
          ? "border-amber-200/80 bg-gradient-to-br from-amber-50 to-white"
          : accent
            ? "border-teal-200/60 bg-gradient-to-br from-teal-50/50 to-white"
            : "border-supira-border/80 bg-white shadow-card"
      )}
    >
      {accent && (
        <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-teal-100/40 blur-2xl" />
      )}
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-supira-muted leading-snug">{label}</p>
        {Icon && (
          <div
            className={clsx(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
              highlight
                ? "bg-amber-100 text-amber-700"
                : accent
                  ? "bg-teal-100 text-teal-700"
                  : "bg-supira-surface text-supira-muted"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p
        className={clsx(
          "relative mt-3 text-3xl font-bold tracking-tight tabular-nums",
          highlight ? "text-amber-900" : "text-supira-primary"
        )}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {(sub || trend) && (
        <p className="relative mt-1.5 text-xs text-supira-muted">
          {trend && <span className="text-teal-600 font-medium">{trend} </span>}
          {sub}
        </p>
      )}
    </div>
  );
}
