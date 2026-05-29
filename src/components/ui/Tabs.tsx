"use client";

import clsx from "clsx";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div
      className={clsx(
        "flex gap-1 overflow-x-auto rounded-2xl border border-supira-border/80 bg-supira-surface/60 p-1.5",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            "tab-pill shrink-0 whitespace-nowrap",
            active === tab.id ? "tab-pill-active" : "tab-pill-inactive"
          )}
        >
          {tab.label}
          {tab.count !== undefined && tab.count > 0 && (
            <span
              className={clsx(
                "ml-1.5 inline-flex min-w-[1.25rem] justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                active === tab.id ? "bg-white/20" : "bg-slate-200/80 text-slate-600"
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
