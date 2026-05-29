import Link from "next/link";
import clsx from "clsx";

interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  size?: "default" | "large";
}

export function Header({
  title,
  description,
  actions,
  breadcrumb,
  size = "default",
}: HeaderProps) {
  return (
    <header className="mb-8 page-enter">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-supira-muted">
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-supira-border-strong">/</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-supira-accent transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-supira-subtle">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 pt-10 lg:pt-0">
          <h1
            className={clsx(
              "font-bold tracking-tight text-supira-primary text-balance",
              size === "large" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
            )}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-supira-muted">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  );
}
