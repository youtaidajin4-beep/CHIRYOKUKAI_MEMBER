"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { AlertTriangle, Crown } from "lucide-react";
import { MemberTable } from "@/components/members/MemberTable";
import { Card } from "@/components/ui/Card";
import { SearchInput } from "@/components/ui/SearchInput";
import { buildReferrerSummaries } from "@/lib/member-utils";
import {
  REPRESENTATIVE,
  buildReferrerForest,
  type LodgeOwnerBranch,
  type OtherReferrerBranch,
} from "@/lib/referrer-registry";
import type { Member } from "@/lib/types";
import { ReferrerNodeCard } from "./ReferrerNodeCard";
import { ReferrerTierBadge } from "./ReferrerTierBadge";

interface ReferrerHierarchyViewProps {
  members: Member[];
  selectedReferrer: string;
  onSelectReferrer: (name: string) => void;
}

export function ReferrerHierarchyView({
  members,
  selectedReferrer,
  onSelectReferrer,
}: ReferrerHierarchyViewProps) {
  const [search, setSearch] = useState("");
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [expandedLo, setExpandedLo] = useState<Set<string>>(new Set());
  const [expandedOther, setExpandedOther] = useState<Set<string>>(new Set());

  const summaries = useMemo(() => buildReferrerSummaries(members), [members]);
  const forest = useMemo(
    () => buildReferrerForest(members, summaries),
    [members, summaries]
  );

  const filteredLodgeOwners = useMemo(() => {
    const q = search.trim().toLowerCase();
    return forest.representative.lodgeOwners.filter((lo) => {
      if (unassignedOnly) return false;
      if (!q) return true;
      if (lo.canonicalName.toLowerCase().includes(q)) return true;
      return lo.otherReferrers.some((o) =>
        o.canonicalName.toLowerCase().includes(q)
      );
    });
  }, [forest, search, unassignedOnly]);

  const filteredUnassigned = useMemo(() => {
    const q = search.trim().toLowerCase();
    return forest.representative.unassignedOthers.filter((o) => {
      if (!unassignedOnly && !q) return true;
      if (unassignedOnly) return true;
      return o.canonicalName.toLowerCase().includes(q);
    });
  }, [forest, search, unassignedOnly]);

  const selectedMembers = useMemo(() => {
    if (!selectedReferrer) return [];
    return members.filter((m) => m.referrerName === selectedReferrer);
  }, [members, selectedReferrer]);

  const toggleLo = (name: string) => {
    setExpandedLo((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleOther = (name: string) => {
    setExpandedOther((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const loCount = forest.representative.lodgeOwners.length;
  const totalMembers = forest.representative.totalReferredMembers;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="ロッジオーナー・傘下紹介者を検索…"
          className="max-w-md"
        />
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-supira-muted">
          <input
            type="checkbox"
            checked={unassignedOnly}
            onChange={(e) => setUnassignedOnly(e.target.checked)}
            className="rounded border-supira-border text-supira-accent focus:ring-supira-accent"
          />
          担当LO未割当のみ
        </label>
      </div>

      {/* 代表 */}
      <section className="relative">
        <div className="absolute left-8 top-full hidden h-6 w-0.5 bg-gradient-to-b from-amber-300/80 to-teal-300/60 md:block" />
        <Card
          padding="lg"
          className="overflow-hidden border-amber-200/60 bg-gradient-to-br from-supira-warm via-white to-teal-50/30"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                <Crown className="h-7 w-7" />
              </div>
              <div>
                <ReferrerTierBadge tier="representative" />
                <h2 className="mt-2 text-2xl font-bold text-supira-primary">
                  {REPRESENTATIVE}
                </h2>
                <p className="mt-1 text-sm text-supira-muted">
                  ロッジオーナー {loCount} 名 · 紹介メンバー総数 {totalMembers} 名
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onSelectReferrer(
                  selectedReferrer === REPRESENTATIVE ? "" : REPRESENTATIVE
                )
              }
              className={clsx(
                "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                selectedReferrer === REPRESENTATIVE
                  ? "bg-supira-accent text-white"
                  : "bg-white text-supira-primary ring-1 ring-supira-border hover:ring-teal-200"
              )}
            >
              ネットワーク概要
            </button>
          </div>
        </Card>
      </section>

      {/* ロッジオーナー */}
      <section>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-supira-muted">
          <span className="h-px flex-1 bg-supira-border" />
          ロッジオーナー（管理者）
          <span className="h-px flex-1 bg-supira-border" />
        </h3>

        <div className="space-y-4 pl-0 md:pl-6 md:border-l-2 md:border-teal-200/50">
          {filteredLodgeOwners.map((lo) => (
            <LodgeOwnerSection
              key={lo.canonicalName}
              branch={lo}
              expanded={expandedLo.has(lo.canonicalName)}
              onToggle={() => toggleLo(lo.canonicalName)}
              selectedReferrer={selectedReferrer}
              onSelectReferrer={onSelectReferrer}
              expandedOthers={expandedOther}
              onToggleOther={toggleOther}
              search={search}
            />
          ))}
        </div>
      </section>

      {/* 未割当 */}
      {filteredUnassigned.length > 0 && (
        <section>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            担当ロッジオーナー未割当
          </h3>
          <div className="space-y-3 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4">
            <p className="text-xs text-amber-900/80">
              referrer-registry.ts の OTHER_REFERRER_PARENT に追記してください。
            </p>
            {filteredUnassigned.map((o) => (
              <OtherReferrerBlock
                key={o.canonicalName}
                branch={o}
                expanded={expandedOther.has(o.canonicalName)}
                onToggle={() => toggleOther(o.canonicalName)}
                selectedReferrer={selectedReferrer}
                onSelectReferrer={onSelectReferrer}
              />
            ))}
          </div>
        </section>
      )}

      {/* 選択中の紹介メンバー */}
      {selectedReferrer && selectedReferrer !== REPRESENTATIVE && (
        <Card padding="md" className="page-enter">
          <h2 className="mb-1 text-lg font-bold text-supira-primary">
            {selectedReferrer} さんの紹介メンバー
          </h2>
          <p className="mb-6 text-sm text-supira-muted">
            {selectedMembers.length} 名
          </p>
          {selectedMembers.length > 0 ? (
            <MemberTable members={selectedMembers} compact />
          ) : (
            <p className="py-8 text-center text-sm text-supira-muted italic">
              この紹介者に紐づくメンバーはまだ登録されていません
            </p>
          )}
        </Card>
      )}

      {selectedReferrer === REPRESENTATIVE && (
        <Card padding="md" className="page-enter">
          <h2 className="mb-4 text-lg font-bold text-supira-primary">
            ネットワーク全体
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatPill label="ロッジオーナー" value={loCount} />
            <StatPill label="紹介メンバー総数" value={totalMembers} />
            <StatPill
              label="その他紹介者"
              value={summaries.filter((s) => s.tier === "other").length}
            />
          </div>
        </Card>
      )}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-supira-surface px-4 py-3 text-center">
      <p className="text-2xl font-bold tabular-nums text-supira-accent">{value}</p>
      <p className="text-xs text-supira-muted">{label}</p>
    </div>
  );
}

function LodgeOwnerSection({
  branch,
  expanded,
  onToggle,
  selectedReferrer,
  onSelectReferrer,
  expandedOthers,
  onToggleOther,
  search,
}: {
  branch: LodgeOwnerBranch;
  expanded: boolean;
  onToggle: () => void;
  selectedReferrer: string;
  onSelectReferrer: (name: string) => void;
  expandedOthers: Set<string>;
  onToggleOther: (name: string) => void;
  search: string;
}) {
  const q = search.trim().toLowerCase();
  const others = branch.otherReferrers.filter(
    (o) => !q || o.canonicalName.toLowerCase().includes(q)
  );

  return (
    <div className="relative pl-4 md:pl-6">
      <div className="absolute -left-px top-6 hidden h-0.5 w-4 bg-teal-200/70 md:block" />
      <ReferrerNodeCard
        name={branch.canonicalName}
        tier="lodge_owner"
        directCount={branch.directMembers.length}
        totalCount={branch.totalMembers}
        otherReferrerCount={branch.otherReferrerCount}
        subtitle="ロッジオーナー"
        expanded={expanded}
        selected={selectedReferrer === branch.canonicalName}
        onToggle={onToggle}
        onSelect={() =>
          onSelectReferrer(
            selectedReferrer === branch.canonicalName ? "" : branch.canonicalName
          )
        }
      />

      {expanded && (
        <div className="mt-3 space-y-3 border-l-2 border-dashed border-supira-border/80 pl-4 ml-2">
          {branch.directMembers.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold text-supira-muted">
                直接紹介メンバー（{branch.directMembers.length}）
              </p>
              <MemberTable members={branch.directMembers} compact />
            </div>
          )}

          {others.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold text-supira-muted">
                傘下のその他紹介者
              </p>
              <div className="space-y-2">
                {others.map((o) => (
                  <OtherReferrerBlock
                    key={o.canonicalName}
                    branch={o}
                    expanded={expandedOthers.has(o.canonicalName)}
                    onToggle={() => onToggleOther(o.canonicalName)}
                    selectedReferrer={selectedReferrer}
                    onSelectReferrer={onSelectReferrer}
                    nested
                  />
                ))}
              </div>
            </div>
          )}

          {branch.directMembers.length === 0 && others.length === 0 && (
            <p className="py-4 text-center text-xs text-supira-muted italic">
              傘下の紹介はまだありません
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function OtherReferrerBlock({
  branch,
  expanded,
  onToggle,
  selectedReferrer,
  onSelectReferrer,
  nested,
}: {
  branch: OtherReferrerBranch;
  expanded: boolean;
  onToggle: () => void;
  selectedReferrer: string;
  onSelectReferrer: (name: string) => void;
  nested?: boolean;
}) {
  return (
    <div className={nested ? "" : ""}>
      <ReferrerNodeCard
        name={branch.canonicalName}
        tier="other"
        directCount={branch.directMembers.length}
        subtitle={
          branch.unassigned
            ? "担当LO未割当"
            : branch.parentLodgeOwner
              ? `担当: ${branch.parentLodgeOwner}`
              : undefined
        }
        expanded={expanded}
        selected={selectedReferrer === branch.canonicalName}
        onToggle={onToggle}
        onSelect={() =>
          onSelectReferrer(
            selectedReferrer === branch.canonicalName ? "" : branch.canonicalName
          )
        }
        compact
      />
      {expanded && branch.directMembers.length > 0 && (
        <div className="mt-2 ml-6">
          <MemberTable members={branch.directMembers} compact />
        </div>
      )}
    </div>
  );
}
