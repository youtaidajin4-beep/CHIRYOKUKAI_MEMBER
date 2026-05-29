import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Tone = "info" | "warning" | "success" | "neutral";

const tones: Record<Tone, { box: string; icon: string }> = {
  info: {
    box: "border-teal-100 bg-gradient-to-r from-teal-50/80 to-white",
    icon: "text-teal-600",
  },
  warning: {
    box: "border-amber-200 bg-gradient-to-r from-amber-50/90 to-white",
    icon: "text-amber-600",
  },
  success: {
    box: "border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-white",
    icon: "text-emerald-600",
  },
  neutral: {
    box: "border-supira-border bg-white",
    icon: "text-supira-muted",
  },
};

interface AlertBannerProps {
  title: string;
  description?: string;
  tone?: Tone;
  icon?: LucideIcon;
  href?: string;
  linkLabel?: string;
  value?: number;
}

export function AlertBanner({
  title,
  description,
  tone = "info",
  icon: Icon,
  href,
  linkLabel = "確認する",
  value,
}: AlertBannerProps) {
  const content = (
    <div
      className={clsx(
        "flex items-start gap-4 rounded-2xl border p-4 sm:p-5 transition-shadow",
        tones[tone].box,
        href && "hover:shadow-card-hover cursor-pointer group"
      )}
    >
      {Icon && (
        <div
          className={clsx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm",
            tones[tone].icon
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-supira-primary">{title}</p>
          {value !== undefined && value > 0 && (
            <span className="rounded-full bg-supira-primary px-2 py-0.5 text-xs font-bold text-white">
              {value}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm text-supira-muted leading-relaxed">{description}</p>
        )}
      </div>
      {href && (
        <ChevronRight className="h-5 w-5 shrink-0 text-supira-subtle transition-transform group-hover:translate-x-0.5" />
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
