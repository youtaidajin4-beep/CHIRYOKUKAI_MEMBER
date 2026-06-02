"use client";

import { useMemo } from "react";
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
  TrendingUp,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { BarChart } from "@/components/ui/BarChart";
import { ReferrerTierBadge } from "@/components/referrers/ReferrerTierBadge";
import {
  DashboardHero,
  DashboardQuickLinks,
} from "@/components/dashboard/DashboardHero";
import { TodayFocusPanel } from "@/components/dashboard/TodayFocusPanel";
import { WeeklySchedulePanel } from "@/components/dashboard/WeeklySchedulePanel";
import { useMembers } from "@/context/MemberContext";
import { getExtendedDashboard, getPrioritySummary } from "@/lib/dashboard-utils";

export default function DashboardPage() {
  const { members } = useMembers();

  const data = useMemo(() => getExtendedDashboard(members), [members]);
  const stats = data.base;
  const priority = useMemo(() => getPrioritySummary(members), [members]);

  const actionItems = [
    data.actionsOverdue.length > 0 && {
      title: "期限超過のフォローがあります",
      description: "次回アクション日を過ぎたメンバーがいます。優先的に対応してください。",
      href: "/members",
      value: data.actionsOverdue.length,
      icon: Calendar,
      tone: "warning" as const,
    },
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
    stats.noLodge > 0 && {
      title: "所属ロッジが未登録のメンバー",
      description: "全員がいずれかのロッジに所属している前提です。所属ロッジを登録してください。",
      href: "/members",
      value: stats.noLodge,
      icon: UserX,
      tone: "warning" as const,
    },
    stats.upcomingActions > 0 && {
      title: "7日以内のフォロー予定",
      description: "今週中にアクションが予定されているメンバーがいます。",
      href: "/members",
      value: stats.upcomingActions,
      icon: Calendar,
      tone: "info" as const,
    },
  ].filter(Boolean);

  return (
    <Layout>
      <DashboardHero data={data} />
      <DashboardQuickLinks />

      <section className="mb-8">
        <TodayFocusPanel
          actionsToday={data.actionsToday}
          actionsOverdue={data.actionsOverdue}
          staleContacts={data.staleContacts}
        />
      </section>

      <WeeklySchedulePanel schedule={data.weeklySchedule} />

      {actionItems.length > 0 && (
        <section className="mb-8 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-supira-subtle">
            要対応アラート
          </h2>
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

      {/* HR insights row */}
      <section className="mb-8">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-supira-subtle">
          人材管理サマリー
        </h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="名簿データ充足率"
            value={`${data.avgCompleteness}%`}
            icon={TrendingUp}
            accent
            sub="平均スコア"
          />
          <StatCard
            label="要フォロー候補"
            value={priority.needsAttention}
            icon={AlertCircle}
            highlight={priority.needsAttention > 0}
            sub="不足・未確認"
          />
          <StatCard
            label="注目リード"
            value={priority.hotLeads}
            icon={Star}
            highlight={priority.hotLeads > 0}
            sub="Aランク×求人候補"
          />
          <StatCard
            label="今週の予定"
            value={data.actionsThisWeek.length}
            icon={Calendar}
            sub="7日以内"
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-supira-subtle">
          メンバー構成
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

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-supira-subtle">
            紹介・求人の状況
          </h2>
          <div className="grid gap-4 grid-cols-2">
            <StatCard label="Aランク" value={stats.priorityA} icon={Star} highlight />
            <StatCard label="求人開拓候補" value={stats.recruitingCandidates} icon={Briefcase} accent />
            <StatCard label="情報不足" value={stats.incomplete} icon={AlertCircle} highlight={stats.incomplete > 0} />
            <StatCard label="紹介者未登録" value={stats.noReferrer} highlight={stats.noReferrer > 0} />
            <StatCard label="所属ロッジ未登録" value={stats.noLodge} highlight={stats.noLodge > 0} />
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-supira-subtle">
            連絡・アクション
          </h2>
          <div className="grid gap-4 grid-cols-2">
            <StatCard label="紹介者確認が必要" value={stats.needsReferralConfirm} />
            <StatCard label="本人へ連絡予定" value={stats.contactPlanned} icon={Phone} />
            <StatCard label="本日フォロー" value={data.actionsToday.length} icon={Calendar} accent />
            <StatCard label="最近のCSV取込" value={stats.recentlyImported} icon={FileUp} sub="30日以内" />
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
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
                <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">階層</th>
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
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <ReferrerTierBadge tier={r.tier} />
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
