import type { Member } from "./types";
import {
  getDashboardStats,
  hasNoReferrer,
  isIncompleteMember,
  isRecruitingCandidate,
} from "./member-utils";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

export function getGreeting(hour: number): string {
  if (hour < 11) return "おはようございます";
  if (hour < 17) return "こんにちは";
  return "こんばんは";
}

export function formatJapaneseDate(date: Date): {
  full: string;
  weekday: string;
  year: number;
  month: number;
  day: number;
} {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];
  return {
    full: `${y}年${m}月${d}日（${weekday}）`,
    weekday,
    year: y,
    month: m,
    day: d,
  };
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function parseActionDate(str: string): Date | null {
  if (!str?.trim()) return null;
  const d = new Date(str);
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysBetween(a: Date, b: Date): number {
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export interface ActionMember {
  member: Member;
  actionDate: Date;
  daysUntil: number;
  isOverdue: boolean;
  isToday: boolean;
}

export function getActionMembers(members: Member[], now = new Date()): ActionMember[] {
  const today = startOfDay(now);
  const items: ActionMember[] = [];

  for (const member of members) {
    const actionDate = parseActionDate(member.nextActionDate);
    if (!actionDate) continue;
    const actionDay = startOfDay(actionDate);
    const daysUntil = daysBetween(today, actionDay);
    items.push({
      member,
      actionDate: actionDay,
      daysUntil,
      isOverdue: daysUntil < 0,
      isToday: daysUntil === 0,
    });
  }

  return items.sort((a, b) => a.actionDate.getTime() - b.actionDate.getTime());
}

export interface StaleContactMember {
  member: Member;
  daysSinceContact: number;
  reason: string;
}

export function getStaleContacts(
  members: Member[],
  thresholdDays = 90,
  now = new Date()
): StaleContactMember[] {
  const result: StaleContactMember[] = [];
  const today = startOfDay(now);

  for (const member of members) {
    if (member.contactStatus === "対応終了") continue;

    const last = parseActionDate(member.lastContactDate);
    if (last) {
      const days = daysBetween(last, today);
      if (days >= thresholdDays) {
        result.push({
          member,
          daysSinceContact: days,
          reason: `最終連絡から${days}日`,
        });
      }
    } else if (member.nextActionDate) {
      // has planned action but never logged last contact — skip if active plan
      continue;
    } else if (
      isRecruitingCandidate(member) ||
      member.priority === "A" ||
      member.priority === "B"
    ) {
      result.push({
        member,
        daysSinceContact: thresholdDays,
        reason: "優先メンバー・連絡記録なし",
      });
    }
  }

  return result.sort((a, b) => b.daysSinceContact - a.daysSinceContact).slice(0, 10);
}

export interface WeeklyDayBucket {
  date: Date;
  label: string;
  isToday: boolean;
  members: ActionMember[];
}

export function getWeeklySchedule(
  actionMembers: ActionMember[],
  now = new Date()
): WeeklyDayBucket[] {
  const today = startOfDay(now);
  const buckets: WeeklyDayBucket[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const { full } = formatJapaneseDate(date);
    const shortLabel = i === 0 ? "今日" : full.replace(/^\d+年/, "").split("（")[0] + `（${WEEKDAYS[date.getDay()]}）`;

    buckets.push({
      date,
      label: i === 0 ? "今日" : i === 1 ? "明日" : shortLabel,
      isToday: i === 0,
      members: actionMembers.filter((a) => daysBetween(today, a.actionDate) === i),
    });
  }

  return buckets;
}

export interface ExtendedDashboard {
  base: ReturnType<typeof getDashboardStats>;
  avgCompleteness: number;
  actionsToday: ActionMember[];
  actionsOverdue: ActionMember[];
  actionsThisWeek: ActionMember[];
  weeklySchedule: WeeklyDayBucket[];
  staleContacts: StaleContactMember[];
  healthScore: number;
}

export function getExtendedDashboard(
  members: Member[],
  now = new Date()
): ExtendedDashboard {
  const base = getDashboardStats(members);
  const actionMembers = getActionMembers(members, now);
  const actionsToday = actionMembers.filter((a) => a.isToday);
  const actionsOverdue = actionMembers.filter((a) => a.isOverdue);
  const actionsThisWeek = actionMembers.filter(
    (a) => a.daysUntil >= 0 && a.daysUntil <= 7
  );

  const avgCompleteness =
    members.length > 0
      ? Math.round(
          members.reduce((s, m) => s + m.dataCompleteness, 0) / members.length
        )
      : 0;

  const issues =
    base.incomplete + base.noReferrer + actionsOverdue.length;

  const maxIssues = Math.max(members.length * 0.3, 10);
  const healthScore = Math.max(
    0,
    Math.min(100, Math.round(100 - (issues / maxIssues) * 100))
  );

  return {
    base,
    avgCompleteness,
    actionsToday,
    actionsOverdue,
    actionsThisWeek,
    weeklySchedule: getWeeklySchedule(actionMembers, now),
    staleContacts: getStaleContacts(members, 90, now),
    healthScore,
  };
}

export function getPrioritySummary(members: Member[]) {
  return {
    needsAttention:
      members.filter(
        (m) =>
          isIncompleteMember(m) ||
          hasNoReferrer(m) ||
          m.referralConfirmed === "未確認"
      ).length,
    hotLeads: members.filter(
      (m) => m.priority === "A" && isRecruitingCandidate(m)
    ).length,
  };
}
