"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Network } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { ReferrerSummaryCard } from "@/components/referrers/ReferrerSummaryCard";
import { MemberTable } from "@/components/members/MemberTable";
import { Card } from "@/components/ui/Card";
import { useMembers } from "@/context/MemberContext";
import { buildReferrerSummaries } from "@/lib/member-utils";
import { EmptyState } from "@/components/ui/EmptyState";

function ReferrersContent() {
  const { members } = useMembers();
  const searchParams = useSearchParams();
  const initialReferrer = searchParams.get("referrer") || "";
  const [selectedReferrer, setSelectedReferrer] = useState(initialReferrer);

  const summaries = useMemo(() => buildReferrerSummaries(members), [members]);
  const referredMembers = useMemo(() => {
    if (!selectedReferrer) return [];
    return members.filter((m) => m.referrerName === selectedReferrer);
  }, [members, selectedReferrer]);

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaries.map((s) => (
          <ReferrerSummaryCard
            key={s.referrerName}
            summary={s}
            selected={selectedReferrer === s.referrerName}
            onClick={() =>
              setSelectedReferrer(
                selectedReferrer === s.referrerName ? "" : s.referrerName
              )
            }
          />
        ))}
      </div>

      {summaries.length === 0 && (
        <EmptyState
          icon={Network}
          title="紹介ネットワークがありません"
          description="メンバーに紹介者を登録すると、ここに表示されます。"
        />
      )}

      {selectedReferrer && (
        <Card padding="md" className="page-enter">
          <h2 className="mb-1 text-lg font-bold text-supira-primary">
            {selectedReferrer} さんの紹介メンバー
          </h2>
          <p className="mb-6 text-sm text-supira-muted">
            {referredMembers.length} 名 · referrerId で親子関係を保持（将来ネットワーク図に拡張可能）
          </p>
          <MemberTable members={referredMembers} compact />
        </Card>
      )}
    </>
  );
}

export default function ReferrersPage() {
  return (
    <Layout>
      <Header
        title="紹介者別ネットワーク"
        description="紹介者ごとの人脈の広がりを把握し、求人開拓や学生紹介の起点を見つけます。"
        breadcrumb={[
          { label: "ダッシュボード", href: "/" },
          { label: "紹介者ネットワーク" },
        ]}
      />
      <Suspense fallback={<p className="text-sm text-supira-muted">読み込み中…</p>}>
        <ReferrersContent />
      </Suspense>
    </Layout>
  );
}
