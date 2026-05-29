"use client";

import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { MemberForm } from "@/components/members/MemberForm";
import { useMembers } from "@/context/MemberContext";

export default function NewMemberPage() {
  const router = useRouter();
  const { members, addMember } = useMembers();

  return (
    <Layout>
      <Header
        title="メンバー新規追加"
        description="手入力で登録します。紹介制のため、紹介者がいる場合は必ず紐づけてください。"
        breadcrumb={[
          { label: "メンバー一覧", href: "/members" },
          { label: "新規追加" },
        ]}
      />
      <div className="max-w-6xl">
        <MemberForm
          members={members}
          onSubmit={(data) => {
            addMember(data);
            router.push("/members");
          }}
          onCancel={() => router.back()}
          submitLabel="登録する"
        />
      </div>
    </Layout>
  );
}
