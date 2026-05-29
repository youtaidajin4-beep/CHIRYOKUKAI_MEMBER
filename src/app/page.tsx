"use client";

import Link from "next/link";
import {
  Users,
  GraduationCap,
  AlertCircle,
  Star,
  Briefcase,
  Phone,
  Calendar,
  FileUp,
  Network,
  ArrowRight,
  UserX,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { BarChart } from "@/components/ui/BarChart";
import { ButtonLink } from "@/components/ui/Button";
import { useMembers } from "@/context/MemberContext";
import { getDashboardStats } from "@/lib/member-utils";

export default function DashboardPage() {
  const { members } = useMembers();
  const stats = getDashboardStats(members);

  const actionItems = [
    stats.incomplete > 0 && {
      title: "情報不足のメンバーがいます",
      description: "区分・紹介者・連絡先など、あとから補完が必要です。",
      href: "/incomplete",
      value: stats.incomplete,
      icon: AlertCircle,
      tone: "warning" as const,
    },
    stats.noReferrer > 0 && {
      title: "紹介者が未登録のメンバー",
      description: "紹介制のネットワークを正しく把握するため、登録をお願いします。",
      href: "/members",
      value: stats.noReferrer,
      icon: UserX,
      tone: "warning" as const,
    },
    stats.needsReferralConfirm > 0 && {
      title: "紹介者確認が必要",
      description: "連絡前に、紹介者への確認を進めましょう。",
      href: "/tasks",
      value: stats.needsReferralConfirm,
      icon: Phone,
      tone: "info" as const,
    },
    stats.upcomingActions > 0 && {
      title: "次回アクションが近い",
      description: "7日以内に予定されているフォローがあります。",
      href: "/tasks",
      value: stats.upcomingActions,
      icon: Calendar,
      tone: "info" as const,
    },
  ].filter(Boolean);

  return (
    <Layout>
      {/* Hero */}
      <section className="page-enter mb-10 overflow-hidden rounded-3xl gradient-hero p-6 sm:p-8 lg:p-10 text-white shadow-card">
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200/90">
            Supira 知力会ネットワーク管理
          </p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl text-balance leading-tight">
            紹介ネットワークを活かした
            <br className="hidden sm:block" />
            求人開拓・人脈管理
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-teal-100/90">
            名簿 {stats.total.toLocaleString()} 名をベースに、紹介者ごとのつながりと求人開拓候補を一元管理します。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/import" variant="accent" icon={FileUp} className="!bg-white !text-supira-primary hover:!bg-teal-50">
              名簿CSVを取り込む
            </ButtonLink>
            <ButtonLink
              href="/recruiting"
              variant="secondary"
              className="!border-white/20 !bg-white/10 !text-white hover:!bg-white/20"
            >
              求人開拓候補を見る
            </ButtonLink>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 right-1/4 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl" />
      </section>

      {/* Action alerts */}
      {actionItems.length > 0 && (
        <section className="mb-10 space-y-3">
          {actionItems.map((item) =>
            item ? (
              <AlertBanner
                key={item.title}
                title={item.title}
                description={item.description}
                href={item.href}
                value={item.value}
                icon={item.icon}
                tone={item.tone}
              />
            ) : null
          )}
        </section>
      )}

      {/* Key metrics */}
      <section className="mb-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-supira-subtle">
          メンバー概要
        </h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard label="総メンバー" value={stats.total} icon={Users} accent />
          <StatCard label="学生" value={stats.students} icon={GraduationCap} />
          <StatCard label="OB / OG" value={stats.obOg} />
          <StatCard label="社会人" value={stats.working} />
          <StatCard label="企業関係者" value={stats.corporate} />
          <StatCard label="区分不明" value={stats.unknownType} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2 mb-10">
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-supira-subtle">
            紹介・求人の状況
          </h2>
          <div className="grid gap-4 grid-cols-2">
            <StatCard label="Aランク" value={stats.priorityA} icon={Star} highlight />
            <StatCard label="求人開拓候補" value={stats.recruitingCandidates} icon={Briefcase} accent />
            <StatCard label="情報不足" value={stats.incomplete} icon={AlertCircle} highlight={stats.incomplete > 0} />
            <StatCard label="紹介者未登録" value={stats.noReferrer} highlight={stats.noReferrer > 0} />
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-supira-subtle">
            今週のアクション
          </h2>
          <div className="grid gap-4 grid-cols-2">
            <StatCard label="紹介者確認が必要" value={stats.needsReferralConfirm} />
            <StatCard label="本人へ連絡予定" value={stats.contactPlanned} icon={Phone} />
            <StatCard label="アクション近い（7日）" value={stats.upcomingActions} icon={Calendar} />
            <StatCard label="最近のCSV取込" value={stats.recentlyImported} icon={FileUp} sub="30日以内" />
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-10">
        <Card hover>
          <CardHeader title="業種別分布" />
          <BarChart
            items={Object.entries(stats.byIndustry).map(([label, value]) => ({
              label,
              value,
            }))}
            color="bg-supira-accent"
          />
        </Card>
        <Card hover>
          <CardHeader title="地域別分布" />
          <BarChart
            items={Object.entries(stats.byArea).map(([label, value]) => ({
              label,
              value,
            }))}
            color="bg-supira-primary-light"
          />
        </Card>
      </div>

      <Card className="mb-10">
        <CardHeader
          title="紹介者別人数ランキング"
          description="紹介ネットワークのハブとなる方を把握できます"
          action={
            <Link
              href="/referrers"
              className="inline-flex items-center gap-1 text-sm font-medium text-supira-accent hover:underline"
            >
              ネットワークを見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="overflow-x-auto -mx-2">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-supira-border text-xs uppercase tracking-wider text-supira-muted">
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">紹介者</th>
                <th className="px-4 py-3 text-right font-semibold">紹介人数</th>
                <th className="px-4 py-3 text-right font-semibold hidden sm:table-cell">A</th>
                <th className="px-4 py-3 text-right font-semibold hidden md:table-cell">求人候補</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-supira-border/60">
              {stats.referrerRanking.map((r, i) => (
                <tr key={r.referrerName} className="table-row-interactive">
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                        i < 3 ? "bg-amber-100 text-amber-800" : "bg-supira-surface text-supira-muted"
                      }`}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/referrers?referrer=${encodeURIComponent(r.referrerName)}`}
                      className="inline-flex items-center gap-2 font-semibold text-supira-primary hover:text-supira-accent"
                    >
                      <Network className="h-4 w-4 text-supira-subtle" />
                      {r.referrerName}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-lg font-bold tabular-nums text-supira-primary">
                      {r.total}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right hidden sm:table-cell tabular-nums">
                    {r.priorityA}
                  </td>
                  <td className="px-4 py-3.5 text-right hidden md:table-cell tabular-nums text-teal-700 font-medium">
                    {r.recruitingCandidates}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
}
