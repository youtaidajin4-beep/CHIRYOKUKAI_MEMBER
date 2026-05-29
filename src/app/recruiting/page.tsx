"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Briefcase, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { Card } from "@/components/ui/Card";
import { useMembers } from "@/context/MemberContext";
import { isRecruitingCandidate, truncateMemo } from "@/lib/member-utils";
import { EmptyState } from "@/components/ui/EmptyState";

export default function RecruitingPage() {
  const { members } = useMembers();

  const candidates = useMemo(
    () =>
      members
        .filter(isRecruitingCandidate)
        .sort((a, b) => {
          if (a.priority === "A" && b.priority !== "A") return -1;
          if (b.priority === "A" && a.priority !== "A") return 1;
          return (a.nextActionDate || "9999").localeCompare(b.nextActionDate || "9999");
        }),
    [members]
  );

  const priorityA = candidates.filter((m) => m.priority === "A").length;

  return (
    <Layout>
      <Header
        title="求人開拓候補"
        description="紹介者確認 → 本人連絡 → 求人相談 → 開拓依頼の流れで、つながりの強い方から進めましょう。"
        breadcrumb={[
          { label: "ダッシュボード", href: "/" },
          { label: "求人開拓候補" },
        ]}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card padding="md" className="border-teal-100 bg-gradient-to-br from-teal-50/50 to-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">候補総数</p>
          <p className="mt-1 text-3xl font-bold text-supira-primary tabular-nums">{candidates.length}</p>
        </Card>
        <Card padding="md">
          <p className="text-xs font-semibold uppercase tracking-wider text-supira-muted">Aランク</p>
          <p className="mt-1 text-3xl font-bold text-amber-800 tabular-nums">{priorityA}</p>
        </Card>
        <Card padding="md">
          <p className="text-xs font-semibold uppercase tracking-wider text-supira-muted">相談中・依頼済</p>
          <p className="mt-1 text-3xl font-bold text-violet-700 tabular-nums">
            {candidates.filter((m) => ["相談中", "求人開拓依頼済み"].includes(m.recruitingStatus)).length}
          </p>
        </Card>
      </div>

      {candidates.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="候補がいません"
          description="優先度や求人開拓ステータスを設定すると、ここに表示されます。"
        />
      ) : (
        <div className="space-y-3">
          {candidates.map((m) => (
            <Link
              key={m.id}
              href={`/members/${m.id}`}
              className="group flex flex-col gap-4 rounded-2xl border border-supira-border/80 bg-white p-5 shadow-card transition hover:shadow-card-hover hover:border-teal-200/50 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <MemberAvatar name={m.name} type={m.type} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-supira-primary group-hover:text-supira-accent">
                      {m.name}
                    </p>
                    <PriorityBadge priority={m.priority} />
                    <TypeBadge type={m.type} />
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {[m.company, m.position].filter(Boolean).join(" · ") || "所属未登録"}
                  </p>
                  <p className="mt-1 text-xs text-supira-muted">
                    {[m.industry, m.area, m.referrerName && `紹介: ${m.referrerName}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
                <StatusBadge label={m.recruitingStatus} />
                {m.nextActionDate && (
                  <span className="text-xs font-medium text-supira-muted">
                    次回 {new Date(m.nextActionDate).toLocaleDateString("ja-JP")}
                  </span>
                )}
                {m.memo && (
                  <p className="max-w-xs text-xs text-supira-subtle line-clamp-1 hidden lg:block">
                    {truncateMemo(m.memo, 50)}
                  </p>
                )}
                <ChevronRight className="h-5 w-5 text-supira-subtle opacity-0 group-hover:opacity-100 transition" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
