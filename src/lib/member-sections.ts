import type { Member } from "./types";
import { MEMBER_FIELD_LABELS, type MemberFieldKey } from "./types";

export interface MemberSection {
  id: string;
  title: string;
  description: string;
  fields: MemberFieldKey[];
}

export const MEMBER_SECTIONS: MemberSection[] = [
  {
    id: "basic",
    title: "基本情報",
    description: "氏名・区分・在籍状況・地域",
    fields: ["name", "kana", "type", "status", "area"],
  },
  {
    id: "school",
    title: "学校・卒業",
    description: "学生・OB/OGの学歴",
    fields: ["school", "faculty", "graduationYear"],
  },
  {
    id: "work",
    title: "所属・キャリア",
    description: "勤務先・部署・役職",
    fields: ["company", "department", "position", "industry"],
  },
  {
    id: "contact",
    title: "連絡先",
    description: "メール・電話・SNS",
    fields: ["email", "phone", "facebookUrl"],
  },
  {
    id: "referral",
    title: "紹介者・紹介経路",
    description: "紹介制ネットワークの核",
    fields: [
      "referrerName",
      "referrerRelation",
      "referralRoute",
      "referralConfirmed",
      "contactPermission",
    ],
  },
  {
    id: "activity",
    title: "連絡・求人開拓",
    description: "フォロー状況と優先度",
    fields: [
      "priority",
      "recruitingPotential",
      "studentSupportPotential",
      "contactStatus",
      "recruitingStatus",
      "lastContactDate",
      "nextActionDate",
    ],
  },
  {
    id: "other",
    title: "メモ・管理情報",
    description: "自由記述と取り込み元",
    fields: ["memo", "importSource"],
  },
];

export function isFieldFilled(member: Member, key: MemberFieldKey): boolean {
  const v = member[key];
  if (v === null || v === undefined) return false;
  const s = String(v).trim();
  if (!s) return false;
  if (s === "不明" || s === "未設定") return false;
  return true;
}

export function sectionCompleteness(
  member: Member,
  section: MemberSection
): { filled: number; total: number; percent: number } {
  const relevant = section.fields.filter((f) => f !== "name");
  const total = relevant.length;
  const filled = relevant.filter((f) => isFieldFilled(member, f)).length;
  return {
    filled,
    total,
    percent: total > 0 ? Math.round((filled / total) * 100) : 100,
  };
}

export function getFieldLabel(key: MemberFieldKey): string {
  return MEMBER_FIELD_LABELS[key];
}

export function formatFieldValue(
  member: Member,
  key: MemberFieldKey
): string | null {
  const v = member[key];
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s || null;
}
