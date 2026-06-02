"use client";

import clsx from "clsx";
import type { ReferrerTier } from "@/lib/referrer-registry";

const TIER_LABELS: Record<ReferrerTier, string> = {
  representative: "代表",
  lodge_owner: "ロッジオーナー",
  other: "その他",
};

const TIER_STYLES: Record<ReferrerTier, string> = {
  representative: "bg-amber-100 text-amber-900 ring-amber-200/70",
  lodge_owner: "bg-teal-50 text-teal-800 ring-teal-200/60",
  other: "bg-slate-100 text-slate-700 ring-slate-200/60",
};

export function ReferrerTierBadge({
  tier,
  className,
}: {
  tier: ReferrerTier;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1",
        TIER_STYLES[tier],
        className
      )}
    >
      {TIER_LABELS[tier]}
    </span>
  );
}
