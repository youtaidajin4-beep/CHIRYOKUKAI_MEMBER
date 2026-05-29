"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import type { Member } from "@/lib/types";
import type {
  MemberType,
  MemberStatus,
  ReferrerRelation,
  ReferralConfirmed,
  ContactPermission,
  Priority,
  Potential,
  ContactStatus,
  RecruitingStatus,
} from "@/lib/types";
import { MEMBER_SECTIONS, sectionCompleteness } from "@/lib/member-sections";
import { calculateDataCompleteness } from "@/lib/member-utils";

interface MemberFormProps {
  initial?: Partial<Member>;
  members: Member[];
  onSubmit: (data: Partial<Member>) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const TYPES: MemberType[] = ["学生", "OB", "OG", "社会人", "企業関係者", "不明"];
const STATUSES: MemberStatus[] = ["在学中", "卒業済み", "社会人", "退会", "不明"];
const RELATIONS: ReferrerRelation[] = [
  "先輩", "後輩", "友人", "先生", "家族", "企業関係者", "知人", "その他", "不明",
];
const CONFIRMED: ReferralConfirmed[] = [
  "未確認", "確認予定", "確認済み", "確認不要", "確認不可",
];
const PERMISSIONS: ContactPermission[] = [
  "未確認", "連絡可", "紹介者確認後に連絡可", "連絡不可",
];
const PRIORITIES: Priority[] = ["A", "B", "C", "未設定"];
const POTENTIALS: Potential[] = ["高い", "普通", "低い", "不明"];
const CONTACT_STATUSES: ContactStatus[] = [
  "未確認", "紹介者に確認予定", "紹介者確認済み", "本人へ連絡予定",
  "本人へ連絡済み", "返信あり", "対応終了",
];
const RECRUITING: RecruitingStatus[] = [
  "未着手", "相談予定", "相談中", "求人開拓依頼済み", "紹介可能", "難しい", "対象外",
];

const FORM_SECTIONS = [
  { id: "basic", title: "基本情報", hint: "氏名と区分は必須です" },
  { id: "school", title: "学校・卒業", hint: "学生・OB/OGの学歴" },
  { id: "work", title: "所属企業", hint: "社会人・OB向け" },
  { id: "contact", title: "連絡先", hint: "いずれか1つ以上あると便利" },
  { id: "referral", title: "紹介者", hint: "紹介制の核心 — できるだけ登録" },
  { id: "activity", title: "求人・活動", hint: "フォロー管理" },
  { id: "other", title: "メモ", hint: "自由記述" },
];

export function MemberForm({
  initial = {},
  members,
  onSubmit,
  onCancel,
  submitLabel = "保存する",
}: MemberFormProps) {
  const [activeSection, setActiveSection] = useState("basic");
  const referrers = members.filter((m) => m.name).map((m) => ({ id: m.id, name: m.name }));

  const draftForProgress = useMemo(
    () => ({ ...initial, name: initial.name || "" }) as Member,
    [initial]
  );

  const overallCompleteness = calculateDataCompleteness(draftForProgress);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (key: string) => (fd.get(key) as string) || "";
    const referrerName = get("referrerName");
    const ref = members.find((m) => m.name === referrerName);

    onSubmit({
      name: get("name"),
      kana: get("kana"),
      type: get("type") as MemberType,
      status: get("status") as MemberStatus,
      school: get("school"),
      faculty: get("faculty"),
      graduationYear: get("graduationYear"),
      company: get("company"),
      department: get("department"),
      position: get("position"),
      industry: get("industry"),
      area: get("area"),
      email: get("email"),
      phone: get("phone"),
      facebookUrl: get("facebookUrl"),
      referrerName,
      referrerId: ref?.id || "",
      referrerRelation: get("referrerRelation") as ReferrerRelation,
      referralRoute: get("referralRoute"),
      referralConfirmed: get("referralConfirmed") as ReferralConfirmed,
      contactPermission: get("contactPermission") as ContactPermission,
      priority: get("priority") as Priority,
      recruitingPotential: get("recruitingPotential") as Potential,
      studentSupportPotential: get("studentSupportPotential") as Potential,
      contactStatus: get("contactStatus") as ContactStatus,
      recruitingStatus: get("recruitingStatus") as RecruitingStatus,
      lastContactDate: get("lastContactDate"),
      nextActionDate: get("nextActionDate"),
      memo: get("memo"),
      tags: get("tags")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      importSource: initial.importSource || "手入力",
    });
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(`form-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <form onSubmit={handleSubmit} className="page-enter">
      {/* Top progress bar */}
      <div className="card-elevated mb-8 p-5 sm:p-6 sticky top-0 z-20 bg-white/95 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-supira-subtle">
              入力の進捗
            </p>
            <p className="mt-1 text-sm text-supira-muted">
              セクションごとに入力。保存後もいつでも編集できます。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ProgressRing value={overallCompleteness} size={52} />
            <div className="text-sm">
              <span className="font-bold text-supira-primary tabular-nums">
                {overallCompleteness}%
              </span>
              <span className="text-supira-muted"> 充足</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
        {/* Section nav */}
        <nav className="hidden lg:block">
          <div className="sticky top-28 space-y-1 rounded-2xl border border-supira-border/80 bg-white p-3 shadow-card">
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-supira-subtle">
              セクション
            </p>
            {FORM_SECTIONS.map((s) => {
              const sec = MEMBER_SECTIONS.find((x) => x.id === s.id);
              const stats = sec
                ? sectionCompleteness(draftForProgress, sec)
                : { percent: 0 };
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className={clsx(
                    "w-full rounded-xl px-3 py-2.5 text-left text-sm transition focus-ring",
                    activeSection === s.id
                      ? "bg-supira-primary text-white"
                      : "text-slate-600 hover:bg-supira-surface"
                  )}
                >
                  <span className="font-medium">{s.title}</span>
                  <span
                    className={clsx(
                      "mt-0.5 block text-[10px]",
                      activeSection === s.id ? "text-teal-100/80" : "text-supira-subtle"
                    )}
                  >
                    {stats.percent}% 入力済
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="space-y-8 min-w-0">
          <FormSection id="basic" title="基本情報" hint="氏名と区分は必須です">
            <Field label="氏名" name="name" defaultValue={initial.name} required />
            <Field label="ふりがな" name="kana" defaultValue={initial.kana} />
            <SelectField label="区分" name="type" options={TYPES} defaultValue={initial.type || "不明"} required />
            <SelectField label="在籍・関係" name="status" options={STATUSES} defaultValue={initial.status || "不明"} />
            <Field label="地域" name="area" defaultValue={initial.area} placeholder="例: 東京都" />
            <Field label="業種" name="industry" defaultValue={initial.industry} placeholder="例: IT・通信" />
          </FormSection>

          <FormSection id="school" title="学校・卒業" hint="学生・OB/OGの学歴">
            <Field label="学校名" name="school" defaultValue={initial.school} />
            <Field label="学部・学科" name="faculty" defaultValue={initial.faculty} />
            <Field label="卒業年" name="graduationYear" defaultValue={initial.graduationYear} placeholder="例: 2024" />
          </FormSection>

          <FormSection id="work" title="所属企業" hint="勤務先がある場合">
            <Field label="所属企業" name="company" defaultValue={initial.company} />
            <Field label="部署" name="department" defaultValue={initial.department} />
            <Field label="役職" name="position" defaultValue={initial.position} />
          </FormSection>

          <FormSection id="contact" title="連絡先" hint="メール・電話・Facebookのいずれか">
            <Field label="メール" name="email" type="email" defaultValue={initial.email} />
            <Field label="電話" name="phone" type="tel" defaultValue={initial.phone} />
            <Field label="Facebook URL" name="facebookUrl" type="url" defaultValue={initial.facebookUrl} className="sm:col-span-2" />
          </FormSection>

          <FormSection id="referral" title="紹介者" hint="紹介制ネットワークの要 — 強く推奨">
            <div className="sm:col-span-2">
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                紹介者
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                  推奨
                </span>
              </label>
              <input
                name="referrerName"
                list="referrer-list"
                defaultValue={initial.referrerName}
                className="input-field"
                placeholder="紹介者名を入力（候補から選択可）"
              />
              <datalist id="referrer-list">
                {referrers.map((r) => (
                  <option key={r.id} value={r.name} />
                ))}
              </datalist>
            </div>
            <SelectField label="紹介者との関係" name="referrerRelation" options={RELATIONS} defaultValue={initial.referrerRelation || "不明"} />
            <Field label="紹介ルート" name="referralRoute" defaultValue={initial.referralRoute} placeholder="例: 知力会イベント経由" className="sm:col-span-2" />
            <SelectField label="紹介者確認" name="referralConfirmed" options={CONFIRMED} defaultValue={initial.referralConfirmed || "未確認"} />
            <SelectField label="連絡可否" name="contactPermission" options={PERMISSIONS} defaultValue={initial.contactPermission || "未確認"} />
          </FormSection>

          <FormSection id="activity" title="求人開拓・活動" hint="フォローと優先度">
            <SelectField label="優先度" name="priority" options={PRIORITIES} defaultValue={initial.priority || "未設定"} />
            <SelectField label="求人開拓可能性" name="recruitingPotential" options={POTENTIALS} defaultValue={initial.recruitingPotential || "不明"} />
            <SelectField label="学生支援可能性" name="studentSupportPotential" options={POTENTIALS} defaultValue={initial.studentSupportPotential || "不明"} />
            <SelectField label="連絡ステータス" name="contactStatus" options={CONTACT_STATUSES} defaultValue={initial.contactStatus || "未確認"} />
            <SelectField label="求人開拓ステータス" name="recruitingStatus" options={RECRUITING} defaultValue={initial.recruitingStatus || "未着手"} />
            <Field label="最終連絡日" name="lastContactDate" type="date" defaultValue={initial.lastContactDate} />
            <Field label="次回アクション日" name="nextActionDate" type="date" defaultValue={initial.nextActionDate} />
          </FormSection>

          <FormSection id="other" title="メモ・タグ">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">メモ</label>
              <textarea
                name="memo"
                rows={5}
                defaultValue={initial.memo}
                className="input-field resize-y min-h-[120px]"
                placeholder="面談メモ、紹介の経緯、注意点など"
              />
            </div>
            <Field label="タグ（カンマ区切り）" name="tags" defaultValue={initial.tags?.join(", ")} placeholder="例: 求人候補, 東京" className="sm:col-span-2" />
          </FormSection>

          <div className="flex flex-wrap gap-3 border-t border-supira-border/80 pt-8 sticky bottom-0 bg-[var(--supira-canvas)]/90 backdrop-blur-sm py-4 -mx-1 px-1">
            <Button type="submit" variant="primary" size="lg">
              {submitLabel}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={onCancel}>
              キャンセル
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function FormSection({
  id,
  title,
  hint,
  children,
}: {
  id: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={`form-${id}`}
      className="section-anchor card-elevated p-5 sm:p-6 scroll-mt-28"
    >
      <div className="mb-5 border-b border-supira-border/60 pb-4">
        <h3 className="flex items-center gap-2 text-base font-semibold text-supira-primary">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-xs font-bold text-teal-700">
            {FORM_SECTIONS.findIndex((s) => s.id === id) + 1}
          </span>
          {title}
        </h3>
        {hint && <p className="mt-1.5 text-xs text-supira-muted pl-9">{hint}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
      </label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
      </label>
      <select name={name} defaultValue={defaultValue} required={required} className="input-field">
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
