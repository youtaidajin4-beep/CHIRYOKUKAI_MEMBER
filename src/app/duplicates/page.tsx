"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Copy, AlertTriangle, GitMerge } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { useMembers } from "@/context/MemberContext";
import { findDuplicateGroups } from "@/lib/member-utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function DuplicatesPage() {
  const { members } = useMembers();
  const groups = useMemo(() => findDuplicateGroups(members), [members]);

  return (
    <Layout>
      <Header
        title="重複候補チェック"
        description="同じ氏名・連絡先・所属などが重なるメンバーを確認し、名簿の整理に役立てます。"
        breadcrumb={[
          { label: "ダッシュボード", href: "/" },
          { label: "重複チェック" },
        ]}
      />

      {groups.length === 0 ? (
        <EmptyState
          icon={Copy}
          title="重複候補は見つかりませんでした"
          description="現時点では、完全一致または類似の組み合わせはありません。"
        />
      ) : (
        <div className="space-y-6 page-enter">
          <Card padding="md" className="border-amber-100 bg-amber-50/40">
            <p className="text-sm text-amber-900">
              <span className="font-bold">{groups.length}</span> グループの重複候補があります。
              統合が必要な場合は、詳細画面で情報を照合してください。
            </p>
          </Card>

          {groups.map((group) => (
            <article
              key={group.id}
              className="overflow-hidden rounded-2xl border border-amber-200/80 bg-white shadow-card"
            >
              <div className="flex items-start gap-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <GitMerge className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-amber-950">{group.reason}</h2>
                  <p className="mt-0.5 text-xs text-amber-800/70">
                    {group.matchField} · {group.members.length}名
                  </p>
                </div>
              </div>
              <ul className="divide-y divide-supira-border/60">
                {group.members.map((m) => (
                  <li
                    key={m.id}
                    className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 table-row-interactive"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <MemberAvatar name={m.name} type={m.type} />
                      <div>
                        <Link
                          href={`/members/${m.id}`}
                          className="font-semibold text-supira-primary hover:text-supira-accent"
                        >
                          {m.name}
                        </Link>
                        <p className="mt-1 text-xs text-supira-muted">
                          {[m.company, m.email, m.phone, m.area]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <PriorityBadge priority={m.priority} />
                      <ButtonLink href={`/members/${m.id}/edit`} variant="ghost" size="sm">
                        編集
                      </ButtonLink>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex items-start gap-2 border-t border-supira-border/60 bg-supira-surface/50 px-5 py-3">
                <AlertTriangle className="h-4 w-4 shrink-0 text-supira-subtle mt-0.5" />
                <p className="text-xs text-supira-muted leading-relaxed">
                  同姓同名・類似名は手動確認を推奨します
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </Layout>
  );
}
