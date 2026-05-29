"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  ChevronRight,
  Phone,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { TypeBadge } from "@/components/ui/TypeBadge";
import type { ActionMember, StaleContactMember } from "@/lib/dashboard-utils";
import clsx from "clsx";

interface TodayFocusPanelProps {
  actionsToday: ActionMember[];
  actionsOverdue: ActionMember[];
  staleContacts: StaleContactMember[];
}

export function TodayFocusPanel({
  actionsToday,
  actionsOverdue,
  staleContacts,
}: TodayFocusPanelProps) {
  const hasContent =
    actionsToday.length > 0 ||
    actionsOverdue.length > 0 ||
    staleContacts.length > 0;

  return (
    <Card padding="md" className="h-full">
      <CardHeader
        title="今日のフォーカス"
        description="本日のフォロー・期限超過・要連絡メンバー"
      />

      {!hasContent ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-8 text-center">
          <p className="text-sm font-medium text-emerald-800">
            本日の緊急対応はありません
          </p>
          <p className="mt-1 text-xs text-emerald-700/80">
            次回アクション日を設定すると、ここに表示されます
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {actionsOverdue.length > 0 && (
            <FocusGroup
              title="期限超過"
              icon={AlertTriangle}
              tone="danger"
              count={actionsOverdue.length}
            >
              {actionsOverdue.slice(0, 5).map((item) => (
                <ActionRow key={item.member.id} item={item} badge={`${Math.abs(item.daysUntil)}日前`} />
              ))}
              {actionsOverdue.length > 5 && (
                <MoreLink href="/members" count={actionsOverdue.length - 5} />
              )}
            </FocusGroup>
          )}

          {actionsToday.length > 0 && (
            <FocusGroup
              title="本日フォロー予定"
              icon={CalendarClock}
              tone="info"
              count={actionsToday.length}
            >
              {actionsToday.map((item) => (
                <ActionRow key={item.member.id} item={item} badge="今日" />
              ))}
            </FocusGroup>
          )}

          {staleContacts.length > 0 && (
            <FocusGroup
              title="要連絡（長期未接触）"
              icon={Phone}
              tone="warn"
              count={staleContacts.length}
            >
              {staleContacts.slice(0, 4).map(({ member, reason }) => (
                <Link
                  key={member.id}
                  href={`/members/${member.id}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-amber-50/60 -mx-2"
                >
                  <MemberAvatar name={member.name} type={member.type} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-supira-primary truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-amber-700">{reason}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-supira-subtle shrink-0" />
                </Link>
              ))}
            </FocusGroup>
          )}
        </div>
      )}
    </Card>
  );
}

function FocusGroup({
  title,
  icon: Icon,
  tone,
  count,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "danger" | "info" | "warn";
  count: number;
  children: React.ReactNode;
}) {
  const styles = {
    danger: "text-red-700 bg-red-50",
    info: "text-sky-700 bg-sky-50",
    warn: "text-amber-700 bg-amber-50",
  };

  return (
    <div>
      <div className={clsx("inline-flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs font-semibold mb-2", styles[tone])}>
        <Icon className="h-3.5 w-3.5" />
        {title}
        <span className="tabular-nums">({count})</span>
      </div>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function ActionRow({
  item,
  badge,
}: {
  item: ActionMember;
  badge: string;
}) {
  const { member } = item;
  return (
    <li>
      <Link
        href={`/members/${member.id}`}
        className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-supira-surface -mx-2 group"
      >
        <MemberAvatar name={member.name} type={member.type} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-supira-primary group-hover:text-supira-accent truncate">
            {member.name}
          </p>
          <p className="text-xs text-supira-muted truncate">
            {member.company || member.school || "—"}
            {member.referrerName && ` · 紹介: ${member.referrerName}`}
          </p>
        </div>
        <TypeBadge type={member.type} />
        <span className="shrink-0 rounded-md bg-supira-surface px-2 py-0.5 text-[10px] font-bold text-supira-muted">
          {badge}
        </span>
        <ChevronRight className="h-4 w-4 text-supira-subtle opacity-0 group-hover:opacity-100 shrink-0" />
      </Link>
    </li>
  );
}

function MoreLink({ href, count }: { href: string; count: number }) {
  return (
    <Link href={href} className="block text-xs font-medium text-supira-accent hover:underline pl-2 pt-1">
      他 {count} 件を見る
    </Link>
  );
}

export function TasksSummaryCard({
  dueToday,
  overdue,
  active,
  urgent,
}: {
  dueToday: number;
  overdue: number;
  active: number;
  urgent: { id: string; title: string; memberName: string; dueDate: string; status: string }[];
}) {
  return (
    <Card padding="md" className="h-full">
      <CardHeader
        title="タスク状況"
        description="紹介者確認・連絡などのToDo"
        action={
          <Link href="/tasks" className="text-sm font-medium text-supira-accent hover:underline">
            すべて
          </Link>
        }
      />
      <div className="grid grid-cols-3 gap-3 mb-4">
        <MiniStat label="未完了" value={active} />
        <MiniStat label="本日期限" value={dueToday} highlight={dueToday > 0} />
        <MiniStat label="期限超過" value={overdue} danger={overdue > 0} />
      </div>
      {urgent.length === 0 ? (
        <p className="text-xs text-supira-muted text-center py-4">緊急タスクはありません</p>
      ) : (
        <ul className="space-y-2">
          {urgent.map((t) => (
            <li key={t.id}>
              <Link
                href="/tasks"
                className="block rounded-xl border border-supira-border/60 bg-supira-surface/50 px-3 py-2.5 hover:border-teal-200 transition"
              >
                <p className="text-sm font-medium text-supira-primary line-clamp-1">{t.title}</p>
                <p className="text-xs text-supira-muted mt-0.5">
                  {t.memberName} · {t.dueDate ? new Date(t.dueDate).toLocaleDateString("ja-JP") : "期限なし"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function MiniStat({
  label,
  value,
  highlight,
  danger,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-xl px-3 py-2.5 text-center",
        danger && value > 0
          ? "bg-red-50 border border-red-100"
          : highlight && value > 0
            ? "bg-sky-50 border border-sky-100"
            : "bg-supira-surface"
      )}
    >
      <p className="text-xl font-bold tabular-nums text-supira-primary">{value}</p>
      <p className="text-[10px] font-medium text-supira-muted mt-0.5">{label}</p>
    </div>
  );
}
