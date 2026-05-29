import Link from "next/link";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-supira-primary text-white shadow-sm hover:bg-supira-navy active:scale-[0.98]",
  secondary:
    "bg-white text-supira-primary border border-supira-border-strong shadow-sm hover:bg-supira-surface hover:border-slate-300",
  ghost:
    "text-supira-muted hover:bg-white/80 hover:text-supira-primary",
  accent:
    "bg-supira-accent text-white shadow-sm hover:bg-teal-800 active:scale-[0.98]",
  danger:
    "bg-red-50 text-red-700 border border-red-100 hover:bg-red-100",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-sm gap-2",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-ring disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className="h-4 w-4 shrink-0" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="h-4 w-4 shrink-0" />}
    </button>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon: Icon,
  children,
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-ring",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {children}
    </Link>
  );
}
