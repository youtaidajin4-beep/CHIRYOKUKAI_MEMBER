"use client";

import clsx from "clsx";
import { Network, Users } from "lucide-react";
import type { ReferrerSummary } from "@/lib/member-utils";

interface ReferrerSummaryCardProps {
  summary: ReferrerSummary;
  selected?: boolean;
  onClick?: () => void;
}

export function ReferrerSummaryCard({
  summary,
  selected,
  onClick,
}: ReferrerSummaryCardProps) {
  return (
    <article
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={clsx(
        "rounded-2xl border p-5 transition-all duration-200",
        onClick && "cursor-pointer",
        selected
          ? "border-supira-accent/50 bg-gradient-to-br from-teal-50 to-white shadow-glow ring-1 ring-teal-200/60"
          : "border-supira-border/80 bg-white shadow-card hover:shadow-card-hover hover:border-teal-200/50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={clsx(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              selected ? "bg-supira-accent text-white" : "bg-supira-surface text-supira-muted"
            )}
          >
            <Network className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-bold text-supira-primary">{summary.referrerName}</h3>
            <p className="text-xs text-supira-muted">紹介ネットワーク</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold tabular-nums text-supira-accent">{summary.total}</p>
          <p className="text-[10px] font-medium uppercase text-supira-subtle">名</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <MiniStat label="学生" value={summary.students} />
        <MiniStat label="OB/OG" value={summary.obOg} />
        <MiniStat label="社会人" value={summary.working} />
        <MiniStat label="企業" value={summary.corporate} />
        <MiniStat label="Aランク" value={summary.priorityA} highlight />
        <MiniStat label="求人候補" value={summary.recruitingCandidates} accent />
      </div>

      {summary.incomplete > 0 && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-700">
          <Users className="h-3.5 w-3.5" />
          情報不足 {summary.incomplete} 名
        </p>
      )}

      <p className="mt-3 text-[10px] text-supira-subtle">
        更新 {new Date(summary.lastUpdated).toLocaleDateString("ja-JP")}
      </p>
    </article>
  );
}

function MiniStat({
  label,
  value,
  highlight,
  accent,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg bg-supira-surface/80 px-2 py-1.5 text-center">
      <p className="text-[10px] text-supira-subtle">{label}</p>
      <p
        className={clsx(
          "text-sm font-bold tabular-nums",
          highlight && value > 0 && "text-amber-700",
          accent && value > 0 && "text-teal-700",
          !highlight && !accent && "text-slate-700"
        )}
      >
        {value}
      </p>
    </div>
  );
}
