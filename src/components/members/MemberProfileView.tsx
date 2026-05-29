"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  UserCheck,
  Phone,
  Briefcase,
  ExternalLink,
  Building2,
  GraduationCap,
  Users,
  MapPin,
  Mail,
  Calendar,
  Network,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { MemberAvatar } from "@/components/ui/MemberAvatar";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { InfoField, InfoGrid } from "@/components/ui/InfoField";
import { MemberDetailCard } from "@/components/members/MemberDetailCard";
import {
  MEMBER_SECTIONS,
  sectionCompleteness,
  getFieldLabel,
  formatFieldValue,
  isFieldFilled,
} from "@/lib/member-sections";
import type { Member } from "@/lib/types";
import type { MemberFieldKey } from "@/lib/types";
import clsx from "clsx";

const CONTACT_FLOW = [
  "未確認",
  "紹介者に確認予定",
  "紹介者確認済み",
  "本人へ連絡予定",
  "本人へ連絡済み",
  "返信あり",
  "対応終了",
] as const;

interface MemberProfileViewProps {
  member: Member;
  relatedByReferrer: Member[];
  onUpdate: (patch: Partial<Member>) => void;
}

export function MemberProfileView({
  member,
  relatedByReferrer,
  onUpdate,
}: MemberProfileViewProps) {
  const [tab, setTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  const contactStep = CONTACT_FLOW.indexOf(
    member.contactStatus as (typeof CONTACT_FLOW)[number]
  );

  const sectionStats = useMemo(
    () =>
      MEMBER_SECTIONS.map((s) => ({
        ...s,
        stats: sectionCompleteness(member, s),
      })),
    [member]
  );

  const missingCount = sectionStats.reduce(
    (n, s) => n + (s.stats.total - s.stats.filled),
    0
  );

  const copyContact = async () => {
    const lines = [
      member.name,
      member.company || member.school,
      member.phone,
      member.email,
    ].filter(Boolean);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderValue = (key: MemberFieldKey) => {
    const raw = formatFieldValue(member, key);
    if (!raw) return undefined;

    if (key === "email") {
      return (
        <a href={`mailto:${raw}`} className="font-medium text-supira-accent hover:underline">
          {raw}
        </a>
      );
    }
    if (key === "phone") {
      return (
        <a href={`tel:${raw}`} className="font-medium text-supira-accent hover:underline">
          {raw}
        </a>
      );
    }
    if (key === "facebookUrl") {
      return (
        <a
          href={raw}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-supira-accent hover:underline"
        >
          プロフィールを開く
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      );
    }
    if (key === "referrerName") {
      return (
        <Link
          href={`/referrers?referrer=${encodeURIComponent(raw)}`}
          className="font-semibold text-supira-accent hover:underline"
        >
          {raw}
        </Link>
      );
    }
    if (key === "priority") return <PriorityBadge priority={member.priority} />;
    if (key === "referralConfirmed" || key === "contactStatus" || key === "recruitingStatus") {
      return <StatusBadge label={raw} />;
    }
    if (key === "lastContactDate" || key === "nextActionDate") {
      try {
        return new Date(raw).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return raw;
      }
    }
    if (key === "memo") {
      return (
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{raw}</p>
      );
    }
    return raw;
  };

  return (
    <div className="space-y-8 page-enter">
      <Link
        href="/members"
        className="inline-flex items-center gap-2 text-sm font-medium text-supira-muted transition hover:text-supira-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        メンバー一覧
      </Link>

      {/* Hero */}
      <div className="card-elevated overflow-hidden">
        <div className="gradient-hero px-6 py-8 sm:px-8 sm:py-10 text-white relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW9kZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA2KSIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-5">
              <MemberAvatar name={member.name} type={member.type} size="xl" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold sm:text-3xl">{member.name}</h1>
                  {member.priority === "A" && <PriorityBadge priority="A" />}
                  {member.duplicateWarning && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-400/20 px-2 py-1 text-xs font-semibold text-amber-100">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      重複候補
                    </span>
                  )}
                </div>
                {member.kana && (
                  <p className="mt-1 text-teal-100/90">{member.kana}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <TypeBadge type={member.type} />
                  <span className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                    {member.status}
                  </span>
                  {member.area && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1 text-xs backdrop-blur-sm">
                      <MapPin className="h-3 w-3" />
                      {member.area}
                    </span>
                  )}
                </div>
                {member.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {member.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <ProgressRing value={member.dataCompleteness} light />
              <p className="text-xs text-teal-100/90">情報充足率</p>
              {missingCount > 0 && (
                <p className="text-[11px] text-amber-200">未入力 {missingCount} 項目</p>
              )}
            </div>
          </div>

          {/* Quick facts */}
          <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickFact
              icon={Building2}
              label="所属"
              value={member.company || member.school || "未入力"}
            />
            <QuickFact
              icon={GraduationCap}
              label="卒業"
              value={member.graduationYear || "—"}
            />
            <QuickFact
              icon={Network}
              label="紹介者"
              value={member.referrerName || "未登録"}
              warn={!member.referrerName}
            />
            <QuickFact
              icon={Calendar}
              label="次回アクション"
              value={
                member.nextActionDate
                  ? new Date(member.nextActionDate).toLocaleDateString("ja-JP")
                  : "未設定"
              }
            />
          </div>
        </div>

        <div className="border-t border-supira-border/80 bg-white px-4 py-4 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={UserCheck}
              onClick={() =>
                onUpdate({
                  referralConfirmed: "確認予定",
                  contactStatus: "紹介者に確認予定",
                })
              }
            >
              紹介者を確認
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Phone}
              onClick={() => onUpdate({ contactStatus: "本人へ連絡予定" })}
            >
              連絡予定に
            </Button>
            <Button
              variant="accent"
              size="sm"
              icon={Briefcase}
              onClick={() =>
                onUpdate({
                  priority: "A",
                  recruitingPotential: "高い",
                  recruitingStatus: "相談予定",
                })
              }
            >
              求人候補に
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={copied ? Check : Copy}
              onClick={copyContact}
            >
              {copied ? "コピー済" : "連絡先コピー"}
            </Button>
            <ButtonLink
              href={`/members/${member.id}/edit`}
              variant="primary"
              size="sm"
              icon={Pencil}
            >
              編集
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-6">
          <Tabs
            tabs={[
              { id: "overview", label: "概要" },
              { id: "all", label: "全項目" },
              { id: "network", label: "紹介ネットワーク", count: relatedByReferrer.length },
            ]}
            active={tab}
            onChange={setTab}
          />

          {tab === "overview" && (
            <>
              <Card padding="md">
                <h2 className="mb-4 text-sm font-semibold text-supira-primary">
                  連絡の進捗
                </h2>
                <div className="flex gap-1 overflow-x-auto pb-1">
                  {CONTACT_FLOW.map((step, i) => {
                    const done = contactStep >= 0 && i <= contactStep;
                    const current = contactStep === i;
                    return (
                      <div
                        key={step}
                        className={clsx(
                          "flex-1 min-w-[4.5rem] rounded-xl px-2 py-2.5 text-center text-[10px] font-medium leading-tight transition",
                          current
                            ? "bg-supira-primary text-white shadow-md ring-2 ring-teal-400/30"
                            : done
                              ? "bg-teal-50 text-teal-800"
                              : "bg-supira-surface text-supira-subtle"
                        )}
                      >
                        {step}
                      </div>
                    );
                  })}
                </div>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                <MemberDetailCard title="連絡先" icon={<Mail className="h-4 w-4" />}>
                  <InfoGrid>
                    <InfoField label="メール" value={renderValue("email")} highlight />
                    <InfoField label="電話" value={renderValue("phone")} highlight />
                    <InfoField label="Facebook" value={renderValue("facebookUrl")} className="sm:col-span-2" />
                  </InfoGrid>
                </MemberDetailCard>

                <MemberDetailCard title="所属・学歴" icon={<Building2 className="h-4 w-4" />}>
                  <InfoGrid>
                    <InfoField label="企業" value={renderValue("company")} />
                    <InfoField label="部署" value={renderValue("department")} />
                    <InfoField label="役職" value={renderValue("position")} />
                    <InfoField label="業種" value={renderValue("industry")} />
                    <InfoField label="学校" value={renderValue("school")} />
                    <InfoField label="学部" value={renderValue("faculty")} />
                    <InfoField label="卒業年" value={renderValue("graduationYear")} />
                  </InfoGrid>
                </MemberDetailCard>

                <MemberDetailCard title="紹介者" icon={<UserCheck className="h-4 w-4" />} className="lg:col-span-2">
                  <InfoGrid>
                    <InfoField label="紹介者" value={renderValue("referrerName")} highlight />
                    <InfoField label="関係" value={renderValue("referrerRelation")} />
                    <InfoField label="紹介ルート" value={renderValue("referralRoute")} className="sm:col-span-2" />
                    <InfoField label="紹介者確認" value={renderValue("referralConfirmed")} />
                    <InfoField label="連絡可否" value={renderValue("contactPermission")} />
                  </InfoGrid>
                </MemberDetailCard>

                <MemberDetailCard title="求人・活動" icon={<Briefcase className="h-4 w-4" />} className="lg:col-span-2">
                  <InfoGrid>
                    <InfoField label="優先度" value={renderValue("priority")} />
                    <InfoField label="求人可能性" value={renderValue("recruitingPotential")} />
                    <InfoField label="学生支援可能性" value={renderValue("studentSupportPotential")} />
                    <InfoField label="連絡ステータス" value={renderValue("contactStatus")} />
                    <InfoField label="求人ステータス" value={renderValue("recruitingStatus")} />
                    <InfoField label="最終連絡日" value={renderValue("lastContactDate")} />
                    <InfoField label="次回アクション" value={renderValue("nextActionDate")} highlight />
                  </InfoGrid>
                </MemberDetailCard>
              </div>

              <MemberDetailCard title="メモ" icon={<Users className="h-4 w-4" />}>
                <div className="rounded-xl bg-supira-surface/80 p-4">
                  {member.memo ? (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                      {member.memo}
                    </p>
                  ) : (
                    <p className="text-sm text-supira-muted italic">メモはまだありません。編集画面から記録できます。</p>
                  )}
                </div>
              </MemberDetailCard>
            </>
          )}

          {tab === "all" && (
            <div className="space-y-6">
              {sectionStats.map((section) => (
                <section
                  key={section.id}
                  id={`section-${section.id}`}
                  className="section-anchor card-elevated p-5 sm:p-6"
                >
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-supira-border/60 pb-4">
                    <div>
                      <h2 className="text-base font-semibold text-supira-primary">
                        {section.title}
                      </h2>
                      <p className="mt-0.5 text-xs text-supira-muted">{section.description}</p>
                    </div>
                    <SectionProgress
                      filled={section.stats.filled}
                      total={section.stats.total}
                      percent={section.stats.percent}
                    />
                  </div>
                  <InfoGrid>
                    {section.fields.map((key) => (
                      <InfoField
                        key={key}
                        label={getFieldLabel(key)}
                        value={renderValue(key)}
                        highlight={!isFieldFilled(member, key) && key === "referrerName"}
                      />
                    ))}
                  </InfoGrid>
                </section>
              ))}
            </div>
          )}

          {tab === "network" && (
            <Card padding="md">
              {member.referrerName ? (
                <>
                  <p className="text-sm text-supira-muted mb-4">
                    <span className="font-semibold text-supira-primary">{member.referrerName}</span>
                    さんが紹介したメンバー（{relatedByReferrer.length}名）
                  </p>
                  {relatedByReferrer.length === 0 ? (
                    <p className="text-sm text-supira-muted italic py-6 text-center">
                      同じ紹介者の他メンバーはまだ登録されていません
                    </p>
                  ) : (
                    <ul className="divide-y divide-supira-border/60">
                      {relatedByReferrer.slice(0, 20).map((m) => (
                        <li key={m.id}>
                          <Link
                            href={`/members/${m.id}`}
                            className="flex items-center gap-3 py-3 transition hover:bg-teal-50/40 -mx-2 px-2 rounded-xl"
                          >
                            <MemberAvatar name={m.name} type={m.type} size="sm" />
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-supira-primary">{m.name}</p>
                              <p className="text-xs text-supira-muted truncate">
                                {m.company || m.school || "—"}
                              </p>
                            </div>
                            <TypeBadge type={m.type} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p className="text-center py-8 text-sm text-orange-700">
                  紹介者が未登録です。編集画面から紹介者を登録してください。
                </p>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 xl:sticky xl:top-8 xl:self-start">
          <Card padding="md" className="gradient-sidebar-accent">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-supira-subtle mb-4">
              セクション別の入力状況
            </h3>
            <ul className="space-y-3">
              {sectionStats.map((s) => (
                <li key={s.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{s.title}</span>
                    <span className="tabular-nums text-supira-muted">
                      {s.stats.filled}/{s.stats.total}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-supira-border/60">
                    <div
                      className={clsx(
                        "h-full rounded-full transition-all",
                        s.stats.percent === 100
                          ? "bg-teal-500"
                          : s.stats.percent >= 50
                            ? "bg-teal-400"
                            : "bg-amber-400"
                      )}
                      style={{ width: `${s.stats.percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="md">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-supira-subtle mb-3">
              管理情報
            </h3>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between gap-2">
                <dt className="text-supira-muted">ID</dt>
                <dd className="font-mono text-slate-600">{member.id}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-supira-muted">取り込み元</dt>
                <dd className="text-slate-700 text-right">{member.importSource || "—"}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-supira-muted">登録日</dt>
                <dd className="text-slate-700">
                  {member.createdAt
                    ? new Date(member.createdAt).toLocaleDateString("ja-JP")
                    : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-supira-muted">更新日</dt>
                <dd className="text-slate-700">
                  {member.updatedAt
                    ? new Date(member.updatedAt).toLocaleDateString("ja-JP")
                    : "—"}
                </dd>
              </div>
            </dl>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function QuickFact({
  icon: Icon,
  label,
  value,
  warn,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-teal-200/80">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p
        className={clsx(
          "mt-1 text-sm font-medium truncate",
          warn ? "text-amber-200" : "text-white"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function SectionProgress({
  filled,
  total,
  percent,
}: {
  filled: number;
  total: number;
  percent: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 overflow-hidden rounded-full bg-supira-border/60">
        <div
          className="h-full rounded-full bg-teal-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-supira-muted">
        {filled}/{total}
      </span>
    </div>
  );
}
