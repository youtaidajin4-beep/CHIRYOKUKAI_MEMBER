"use client";

import { useMemo, useState } from "react";
import { Plus, FileUp, LayoutGrid, List } from "lucide-react";
import clsx from "clsx";
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { MemberTable } from "@/components/members/MemberTable";
import { MemberCardGrid } from "@/components/members/MemberCardGrid";
import {
  FilterBar,
  defaultFilters,
  type MemberFilters,
} from "@/components/members/FilterBar";
import { ButtonLink } from "@/components/ui/Button";
import { useMembers } from "@/context/MemberContext";
import { filterMembers } from "@/lib/member-utils";

type ViewMode = "cards" | "table";

export default function MembersPage() {
  const { members } = useMembers();
  const [filters, setFilters] = useState<MemberFilters>(defaultFilters);
  const [view, setView] = useState<ViewMode>("cards");

  const filtered = useMemo(
    () => filterMembers(members, filters),
    [members, filters]
  );

  return (
    <Layout>
      <Header
        title="メンバー一覧"
        description="カード表示で一人ひとりの情報を把握し、テーブル表示で一覧比較もできます。クリックで詳細の全項目を確認できます。"
        breadcrumb={[
          { label: "ダッシュボード", href: "/" },
          { label: "メンバー一覧" },
        ]}
        actions={
          <>
            <ButtonLink href="/import" variant="secondary" icon={FileUp}>
              CSV取り込み
            </ButtonLink>
            <ButtonLink href="/members/new" variant="primary" icon={Plus}>
              新規追加
            </ButtonLink>
          </>
        }
      />

      <FilterBar
        filters={filters}
        onChange={setFilters}
        members={members}
        resultCount={filtered.length}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-supira-muted">
          <span className="font-bold tabular-nums text-supira-accent text-lg">
            {filtered.length}
          </span>
          <span className="text-supira-subtle"> / {members.length}</span> 件を表示
        </p>
        <div className="flex rounded-xl border border-supira-border/80 bg-white p-1 shadow-sm">
          <ViewToggle
            active={view === "cards"}
            onClick={() => setView("cards")}
            icon={LayoutGrid}
            label="カード"
          />
          <ViewToggle
            active={view === "table"}
            onClick={() => setView("table")}
            icon={List}
            label="テーブル"
          />
        </div>
      </div>

      {view === "cards" ? (
        <MemberCardGrid members={filtered} />
      ) : (
        <MemberTable members={filtered} />
      )}
    </Layout>
  );
}

function ViewToggle({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition focus-ring",
        active
          ? "bg-supira-primary text-white shadow-sm"
          : "text-slate-600 hover:bg-supira-surface"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
