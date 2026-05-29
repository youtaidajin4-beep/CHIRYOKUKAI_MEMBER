"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AlertCircle, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { MemberTable } from "@/components/members/MemberTable";
import { Card } from "@/components/ui/Card";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useMembers } from "@/context/MemberContext";
import { isIncompleteMember, hasNoReferrer } from "@/lib/member-utils";
import type { Member } from "@/lib/types";

function getIncompleteReasons(m: Member): string[] {
  const reasons: string[] = [];
  if (m.type === "不明") reasons.push("区分不明");
  if (hasNoReferrer(m)) reasons.push("紹介者未登録");
  if (!m.company?.trim() && ["OB", "OG", "社会人", "企業関係者"].includes(m.type))
    reasons.push("所属企業なし");
  if (!m.school?.trim() && m.type === "学生") reasons.push("学校名なし");
  if (!m.email?.trim() && !m.phone?.trim() && !m.facebookUrl?.trim())
    reasons.push("連絡先なし");
  if (m.recruitingPotential === "不明") reasons.push("求人可能性未設定");
  if (m.priority === "未設定") reasons.push("優先度未設定");
  return reasons;
}

export default function IncompletePage() {
  const { members } = useMembers();
  const incomplete = useMemo(() => members.filter(isIncompleteMember), [members]);

  return (
    <Layout>
      <Header
        title="情報不足メンバー"
        description="あとから補完が必要な項目を一覧化しています。優先的に編集して、ネットワークと求人開拓の精度を高めましょう。"
        breadcrumb={[
          { label: "ダッシュボード", href: "/" },
          { label: "情報不足" },
        ]}
      />

      <Card padding="md" className="mb-8 border-amber-100 bg-gradient-to-r from-amber-50/60 to-white">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-900 tabular-nums">{incomplete.length}</p>
            <p className="text-sm text-amber-800/80">
              名が情報不足（全 {members.length} 名中）
            </p>
          </div>
        </div>
      </Card>

      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        {incomplete.slice(0, 6).map((m) => (
          <Link
            key={m.id}
            href={`/members/${m.id}/edit`}
            className="group flex items-center gap-4 rounded-2xl border border-supira-border/80 bg-white p-4 shadow-card transition hover:shadow-card-hover hover:border-teal-200/50"
          >
            <MemberAvatar name={m.name} type={m.type} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-supira-primary group-hover:text-supira-accent truncate">
                {m.name}
              </p>
              <p className="mt-1 text-xs text-orange-700">
                {getIncompleteReasons(m).join(" · ")}
              </p>
            </div>
            <ProgressRing value={m.dataCompleteness} size={44} strokeWidth={3} />
            <ChevronRight className="h-5 w-5 text-supira-subtle opacity-0 transition group-hover:opacity-100" />
          </Link>
        ))}
      </div>

      <h2 className="mb-4 text-sm font-semibold text-supira-primary">すべての情報不足メンバー</h2>
      <MemberTable members={incomplete} />
    </Layout>
  );
}
