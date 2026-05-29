"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { MemberForm } from "@/components/members/MemberForm";
import { useMembers } from "@/context/MemberContext";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export default function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { members, getMemberById, updateMember } = useMembers();
  const member = getMemberById(id);

  if (!member) {
    return (
      <Layout>
        <EmptyState
          title="メンバーが見つかりません"
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
      <Header
        title="メンバー編集"
        description={`${member.name} さんの情報を更新します`}
        breadcrumb={[
          { label: "メンバー一覧", href: "/members" },
          { label: member.name, href: `/members/${id}` },
          { label: "編集" },
        ]}
      />
      <div className="max-w-6xl">
        <MemberForm
          initial={member}
          members={members.filter((m) => m.id !== id)}
          onSubmit={(data) => {
            updateMember(id, data);
            router.push(`/members/${id}`);
          }}
          onCancel={() => router.push(`/members/${id}`)}
          submitLabel="変更を保存"
        />
      </div>
    </Layout>
  );
}
