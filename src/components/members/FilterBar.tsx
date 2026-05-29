"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import clsx from "clsx";
import { SearchInput } from "@/components/ui/SearchInput";
import { Card } from "@/components/ui/Card";
import type { Member } from "@/lib/types";
import { useState } from "react";

export interface MemberFilters {
  searchName: string;
  searchCompany: string;
  searchSchool: string;
  searchReferrer: string;
  type: string;
  area: string;
  industry: string;
  priority: string;
  contactStatus: string;
  recruitingStatus: string;
  incompleteOnly: boolean;
  noReferrerOnly: boolean;
  duplicateOnly: boolean;
}

export const defaultFilters: MemberFilters = {
  searchName: "",
  searchCompany: "",
  searchSchool: "",
  searchReferrer: "",
  type: "all",
  area: "all",
  industry: "all",
  priority: "all",
  contactStatus: "all",
  recruitingStatus: "all",
  incompleteOnly: false,
  noReferrerOnly: false,
  duplicateOnly: false,
};

interface FilterBarProps {
  filters: MemberFilters;
  onChange: (filters: MemberFilters) => void;
  members: Member[];
  resultCount?: number;
}

function uniqueValues(members: Member[], key: keyof Member): string[] {
  const set = new Set<string>();
  members.forEach((m) => {
    const v = String(m[key] || "").trim();
    if (v && v !== "不明" && v !== "未設定") set.add(v);
  });
  return [...set].sort();
}

function countActiveFilters(f: MemberFilters): number {
  let n = 0;
  if (f.searchName || f.searchCompany || f.searchSchool || f.searchReferrer) n++;
  if (f.type !== "all") n++;
  if (f.area !== "all") n++;
  if (f.industry !== "all") n++;
  if (f.priority !== "all") n++;
  if (f.contactStatus !== "all") n++;
  if (f.recruitingStatus !== "all") n++;
  if (f.incompleteOnly) n++;
  if (f.noReferrerOnly) n++;
  if (f.duplicateOnly) n++;
  return n;
}

export function FilterBar({ filters, onChange, members, resultCount }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = countActiveFilters(filters);
  const areas = uniqueValues(members, "area");
  const industries = uniqueValues(members, "industry");

  const set = (patch: Partial<MemberFilters>) =>
    onChange({ ...filters, ...patch });

  const clearAll = () => onChange(defaultFilters);

  return (
    <Card padding="md" className="mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
            <Search className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-supira-primary">検索・フィルター</p>
            {resultCount !== undefined && (
              <p className="text-xs text-supira-muted">
                <span className="font-semibold tabular-nums text-supira-accent">{resultCount}</span> 件表示
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-supira-muted hover:bg-supira-surface hover:text-red-600 transition"
            >
              <X className="h-3.5 w-3.5" />
              クリア（{activeCount}）
            </button>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className={clsx(
              "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition focus-ring",
              expanded
                ? "border-supira-accent/30 bg-teal-50 text-teal-800"
                : "border-supira-border bg-white text-slate-600 hover:bg-supira-surface"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            詳細フィルター
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SearchInput
          placeholder="氏名・ふりがな"
          value={filters.searchName}
          onChange={(v) => set({ searchName: v })}
        />
        <SearchInput
          placeholder="会社名"
          value={filters.searchCompany}
          onChange={(v) => set({ searchCompany: v })}
        />
        <SearchInput
          placeholder="学校名"
          value={filters.searchSchool}
          onChange={(v) => set({ searchSchool: v })}
        />
        <SearchInput
          placeholder="紹介者名"
          value={filters.searchReferrer}
          onChange={(v) => set({ searchReferrer: v })}
        />
      </div>

      <div
        className={clsx(
          "grid transition-all duration-300 ease-out",
          expanded ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-supira-border/80 pt-4 space-y-4">
            <div className="flex flex-wrap gap-3">
              <SelectFilter label="区分" value={filters.type} onChange={(v) => set({ type: v })} options={["all", "学生", "OB", "OG", "社会人", "企業関係者", "不明"]} />
              <SelectFilter label="地域" value={filters.area} onChange={(v) => set({ area: v })} options={["all", ...areas]} />
              <SelectFilter label="業種" value={filters.industry} onChange={(v) => set({ industry: v })} options={["all", ...industries]} />
              <SelectFilter label="優先度" value={filters.priority} onChange={(v) => set({ priority: v })} options={["all", "A", "B", "C", "未設定"]} />
              <SelectFilter label="連絡" value={filters.contactStatus} onChange={(v) => set({ contactStatus: v })} options={["all", "未確認", "紹介者に確認予定", "紹介者確認済み", "本人へ連絡予定", "本人へ連絡済み", "返信あり", "対応終了"]} />
              <SelectFilter label="求人開拓" value={filters.recruitingStatus} onChange={(v) => set({ recruitingStatus: v })} options={["all", "未着手", "相談予定", "相談中", "求人開拓依頼済み", "紹介可能", "難しい", "対象外"]} />
            </div>
            <div className="flex flex-wrap gap-2">
              <ToggleChip label="情報不足のみ" active={filters.incompleteOnly} onClick={() => set({ incompleteOnly: !filters.incompleteOnly })} />
              <ToggleChip label="紹介者未登録" active={filters.noReferrerOnly} onClick={() => set({ noReferrerOnly: !filters.noReferrerOnly })} />
              <ToggleChip label="重複候補" active={filters.duplicateOnly} onClick={() => set({ duplicateOnly: !filters.duplicateOnly })} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function SelectFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-col gap-1 min-w-[130px]">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-supira-subtle">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-supira-border bg-white px-3 py-2 text-sm shadow-sm focus:border-supira-accent/50 focus:shadow-glow focus:outline-none">
        {options.map((o) => (
          <option key={o} value={o}>{o === "all" ? "すべて" : o}</option>
        ))}
      </select>
    </div>
  );
}

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-full px-3.5 py-1.5 text-xs font-medium transition focus-ring",
        active ? "bg-supira-primary text-white shadow-sm" : "bg-supira-surface text-slate-600 hover:bg-slate-200/60"
      )}
    >
      {label}
    </button>
  );
}
