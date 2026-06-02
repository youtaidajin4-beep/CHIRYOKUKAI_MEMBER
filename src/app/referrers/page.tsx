"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Network } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { ReferrerHierarchyView } from "@/components/referrers/ReferrerHierarchyView";
import { useMembers } from "@/context/MemberContext";
import { buildReferrerSummaries } from "@/lib/member-utils";
import { EmptyState } from "@/components/ui/EmptyState";

function ReferrersContent() {
  const { members } = useMembers();
  const searchParams = useSearchParams();
  const initialReferrer = searchParams.get("referrer") || "";
  const [selectedReferrer, setSelectedReferrer] = useState(initialReferrer);

  const summaries = useMemo(() => buildReferrerSummaries(members), [members]);
  const hasNetwork = summaries.length > 0;

  return (
    <>
      {hasNetwork ? (
        <ReferrerHierarchyView
          members={members}
          selectedReferrer={selectedReferrer}
          onSelectReferrer={setSelectedReferrer}
        />
      ) : (
        <EmptyState
          icon={Network}
          title="紹介ネットワークがありません"
          description="メンバーに紹介者を登録すると、ここに表示されます。"
        />
      )}
    </>
  );
}

export default function ReferrersPage() {
  return (
    <Layout>
      <Header
        title="紹介者ネットワーク"
        description="代表・ロッジオーナー・傘下の紹介者の3階層で、紹介のつながりを把握できます。"
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
