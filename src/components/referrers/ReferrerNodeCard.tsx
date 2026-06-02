"use client";

import clsx from "clsx";
import { ChevronDown, ChevronRight, Network, Users } from "lucide-react";
import { ReferrerTierBadge } from "./ReferrerTierBadge";
import type { ReferrerTier } from "@/lib/referrer-registry";

interface ReferrerNodeCardProps {
  name: string;
  tier: ReferrerTier;
  directCount: number;
  totalCount?: number;
  affiliatedCount?: number;
  otherReferrerCount?: number;
  countLabel?: string;
  subtitle?: string;
  expanded?: boolean;
  selected?: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
  compact?: boolean;
}

export function ReferrerNodeCard({
  name,
  tier,
  directCount,
  totalCount,
  affiliatedCount,
  otherReferrerCount = 0,
  countLabel = "名",
  subtitle,
  expanded,
  selected,
  onToggle,
  onSelect,
  compact,
}: ReferrerNodeCardProps) {
  const displayTotal =
    affiliatedCount != null ? affiliatedCount : totalCount ?? directCount;

  return (
    <article
      className={clsx(
        "rounded-2xl border transition-all duration-200",
        compact ? "p-3" : "p-4",
        selected
          ? "border-supira-accent/50 bg-gradient-to-br from-teal-50 to-white shadow-glow ring-1 ring-teal-200/60"
          : "border-supira-border/80 bg-white shadow-card hover:border-teal-200/50 hover:shadow-card-hover"
      )}
    >
      <div className="flex items-start gap-2">
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="mt-0.5 shrink-0 rounded-lg p-1 text-supira-muted hover:bg-supira-surface hover:text-supira-primary"
            aria-expanded={expanded}
            aria-label={expanded ? "折りたたむ" : "展開する"}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        <button
          type="button"
          onClick={onSelect}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex flex-wrap items-center gap-2">
            <ReferrerTierBadge tier={tier} />
            {otherReferrerCount > 0 && (
              <span className="text-[10px] font-medium text-supira-muted">
                傘下紹介者 {otherReferrerCount} 名
              </span>
            )}
          </div>
          <h3
            className={clsx(
              "mt-1 font-bold text-supira-primary",
              compact ? "text-sm" : "text-base"
            )}
          >
            {name}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-supira-muted">{subtitle}</p>
          )}
        </button>
        <div className="shrink-0 text-right">
          <p className="text-xl font-bold tabular-nums text-supira-accent">
            {displayTotal}
          </p>
          <p className="text-[10px] text-supira-subtle">
            {affiliatedCount != null
              ? "所属"
              : totalCount != null && totalCount !== directCount
                ? `紹介 ${directCount}`
                : countLabel}
          </p>
        </div>
      </div>

      {!compact && (affiliatedCount != null || directCount > 0 || otherReferrerCount > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-supira-muted">
          {affiliatedCount != null && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              所属 {affiliatedCount}
            </span>
          )}
          {affiliatedCount == null && (
            <>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                直接紹介 {directCount}
              </span>
              {otherReferrerCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Network className="h-3.5 w-3.5" />
                  経由含む {displayTotal}
                </span>
              )}
            </>
          )}
          {affiliatedCount != null && (directCount > 0 || otherReferrerCount > 0) && (
            <span className="inline-flex items-center gap-1">
              <Network className="h-3.5 w-3.5" />
              紹介経路 {directCount}
              {totalCount != null && totalCount > directCount ? ` / ${totalCount}` : ""}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
