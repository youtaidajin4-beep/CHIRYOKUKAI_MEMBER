"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  FileUp,
  Plus,
  Users,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import {
  formatJapaneseDate,
  formatTime,
  getGreeting,
  type ExtendedDashboard,
} from "@/lib/dashboard-utils";

interface DashboardHeroProps {
  data: ExtendedDashboard;
  userName?: string;
}

export function DashboardHero({ data, userName }: DashboardHeroProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { full, weekday } = formatJapaneseDate(now);
  const time = formatTime(now);
  const greeting = getGreeting(now.getHours());
  const { base, actionsToday, actionsOverdue, taskInsights, healthScore, avgCompleteness } =
    data;

  const urgentTotal = actionsOverdue.length + taskInsights.overdue;

  return (
    <section className="page-enter mb-8 overflow-hidden rounded-3xl gradient-hero shadow-card">
      <div className="relative px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,0.15),transparent_50%)]" />
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
          {/* Left: greeting & context */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-teal-200/90">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <Calendar className="h-3.5 w-3.5" />
                {full}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                知力会ネットワーク管理
              </span>
            </div>

            <h1 className="mt-4 text-xl font-bold text-white sm:text-2xl">
              {greeting}
              {userName ? `、${userName}さん` : ""}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-teal-100/90 sm:text-base">
              登録 <strong className="text-white">{base.total.toLocaleString()}</strong> 名の名簿を管理しています。
              {urgentTotal > 0 ? (
                <>
                  {" "}
                  <span className="text-amber-200">
                    期限超過・要対応が {urgentTotal} 件あります。
                  </span>
                </>
              ) : (
                <> 本日のフォロー予定は {actionsToday.length} 件です。</>
              )}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <ButtonLink
                href="/members/new"
                variant="accent"
                icon={Plus}
                className="!bg-white !text-supira-primary hover:!bg-teal-50"
              >
                メンバー追加
              </ButtonLink>
              <ButtonLink
                href="/import"
                variant="secondary"
                icon={FileUp}
                className="!border-white/25 !bg-white/10 !text-white hover:!bg-white/20"
              >
                CSV取り込み
              </ButtonLink>
              <ButtonLink
                href="/recruiting"
                variant="secondary"
                className="!border-white/25 !bg-white/10 !text-white hover:!bg-white/20"
              >
                求人候補
              </ButtonLink>
            </div>
          </div>

          {/* Right: live clock */}
          <div className="flex flex-col items-center lg:items-end">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-5 text-center backdrop-blur-md min-w-[200px]">
              <div className="flex items-center justify-center gap-1.5 text-teal-200/80 text-xs font-medium uppercase tracking-wider">
                <Clock className="h-3.5 w-3.5" />
                現在時刻
              </div>
              <p
                className="mt-2 font-mono text-4xl font-bold tabular-nums tracking-tight text-white sm:text-5xl"
                suppressHydrationWarning
              >
                {time}
              </p>
              <p className="mt-2 text-sm font-medium text-teal-100/90">
                {weekday}曜日
              </p>
            </div>
          </div>
        </div>

        {/* Status chips */}
        <div className="relative mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HeroStatChip
            icon={Users}
            label="名簿充足率"
            value={`${avgCompleteness}%`}
            sub={`${base.total}名登録`}
            tone="neutral"
          />
          <HeroStatChip
            icon={Calendar}
            label="本日のフォロー"
            value={String(actionsToday.length)}
            sub="件"
            tone={actionsToday.length > 0 ? "info" : "neutral"}
          />
          <HeroStatChip
            icon={AlertTriangle}
            label="期限超過"
            value={String(actionsOverdue.length + taskInsights.overdue)}
            sub="アクション・タスク"
            tone={urgentTotal > 0 ? "warn" : "ok"}
          />
          <HeroStatChip
            icon={CheckCircle2}
            label="名簿ヘルス"
            value={`${healthScore}`}
            sub="/ 100点"
            tone={healthScore >= 70 ? "ok" : healthScore >= 40 ? "warn" : "danger"}
          />
        </div>
      </div>
    </section>
  );
}

function HeroStatChip({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  tone: "neutral" | "info" | "warn" | "ok" | "danger";
}) {
  const tones = {
    neutral: "bg-white/10 border-white/10",
    info: "bg-sky-500/20 border-sky-300/30",
    warn: "bg-amber-500/20 border-amber-300/30",
    ok: "bg-emerald-500/20 border-emerald-300/30",
    danger: "bg-red-500/20 border-red-300/30",
  };

  return (
    <div
      className={`rounded-xl border px-4 py-3 backdrop-blur-sm ${tones[tone]}`}
    >
      <div className="flex items-center gap-2 text-teal-100/80">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-bold tabular-nums text-white">{value}</span>
        {sub && <span className="text-xs text-teal-100/70">{sub}</span>}
      </p>
    </div>
  );
}

export function DashboardQuickLinks() {
  const links = [
    { href: "/members", label: "メンバー一覧", desc: "カード・検索" },
    { href: "/incomplete", label: "情報不足", desc: "補完が必要" },
    { href: "/tasks", label: "タスク", desc: "ToDo管理" },
    { href: "/referrers", label: "紹介ネットワーク", desc: "紹介者ハブ" },
  ];

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="group rounded-xl border border-supira-border/80 bg-white px-4 py-3 shadow-card transition hover:border-teal-200 hover:shadow-card-hover"
        >
          <p className="text-sm font-semibold text-supira-primary group-hover:text-supira-accent">
            {l.label}
          </p>
          <p className="text-xs text-supira-muted mt-0.5">{l.desc}</p>
        </Link>
      ))}
    </div>
  );
}
