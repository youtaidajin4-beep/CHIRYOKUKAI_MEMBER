"use client";

import { use, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { MemberProfileView } from "@/components/members/MemberProfileView";
import { useMembers } from "@/context/MemberContext";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { members, getMemberById, updateMember } = useMembers();
  const member = getMemberById(id);

  const relatedByReferrer = useMemo(() => {
    if (!member?.referrerName) return [];
    return members.filter(
      (m) =>
        m.id !== member.id &&
        m.referrerName === member.referrerName
    );
  }, [members, member]);

  if (!member) {
    return (
      <Layout>
        <EmptyState
          title="メンバーが見つかりません"
          description="一覧から再度お選びください。"
          action={
            <ButtonLink href="/members" variant="secondary">
              メンバー一覧へ
            </ButtonLink>
          }
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <MemberProfileView
        member={member}
        relatedByReferrer={relatedByReferrer}
        onUpdate={(patch) => updateMember(id, patch)}
      />
    </Layout>
  );
}
