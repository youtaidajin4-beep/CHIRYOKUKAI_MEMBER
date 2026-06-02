export type MemberType =
  | "学生"
  | "OB"
  | "OG"
  | "社会人"
  | "企業関係者"
  | "不明";

export type MemberStatus =
  | "在学中"
  | "卒業済み"
  | "社会人"
  | "退会"
  | "不明";

export type ReferrerRelation =
  | "先輩"
  | "後輩"
  | "友人"
  | "先生"
  | "家族"
  | "企業関係者"
  | "知人"
  | "その他"
  | "不明";

export type ReferralConfirmed =
  | "未確認"
  | "確認予定"
  | "確認済み"
  | "確認不要"
  | "確認不可";

export type ContactPermission =
  | "未確認"
  | "連絡可"
  | "紹介者確認後に連絡可"
  | "連絡不可";

export type Priority = "A" | "B" | "C" | "未設定";

export type Potential = "高い" | "普通" | "低い" | "不明";

export type ContactStatus =
  | "未確認"
  | "紹介者に確認予定"
  | "紹介者確認済み"
  | "本人へ連絡予定"
  | "本人へ連絡済み"
  | "返信あり"
  | "対応終了";

export type RecruitingStatus =
  | "未着手"
  | "相談予定"
  | "相談中"
  | "求人開拓依頼済み"
  | "紹介可能"
  | "難しい"
  | "対象外";

export interface Member {
  id: string;
  name: string;
  kana: string;
  type: MemberType;
  status: MemberStatus;
  school: string;
  faculty: string;
  graduationYear: string;
  company: string;
  department: string;
  position: string;
  industry: string;
  area: string;
  email: string;
  phone: string;
  facebookUrl: string;
  referrerName: string;
  referrerId: string;
  lodgeOwnerName: string;
  lodgeOwnerId: string;
  referrerRelation: ReferrerRelation;
  referralRoute: string;
  referralConfirmed: ReferralConfirmed;
  contactPermission: ContactPermission;
  priority: Priority;
  recruitingPotential: Potential;
  studentSupportPotential: Potential;
  contactStatus: ContactStatus;
  recruitingStatus: RecruitingStatus;
  lastContactDate: string;
  nextActionDate: string;
  memo: string;
  tags: string[];
  importSource: string;
  dataCompleteness: number;
  duplicateWarning: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MemberFieldKey = keyof Omit<
  Member,
  "id" | "tags" | "dataCompleteness" | "duplicateWarning" | "createdAt" | "updatedAt"
>;

export const MEMBER_FIELD_LABELS: Record<MemberFieldKey, string> = {
  name: "氏名",
  kana: "ふりがな",
  type: "区分",
  status: "在籍・関係ステータス",
  school: "学校名",
  faculty: "学部・学科",
  graduationYear: "卒業年",
  company: "所属企業",
  department: "部署",
  position: "役職",
  industry: "業種",
  area: "地域",
  email: "メールアドレス",
  phone: "電話番号",
  facebookUrl: "Facebook URL",
  referrerName: "紹介者名",
  referrerId: "紹介者ID",
  lodgeOwnerName: "所属ロッジ",
  lodgeOwnerId: "所属ロッジID",
  referrerRelation: "紹介者との関係",
  referralRoute: "紹介ルート",
  referralConfirmed: "紹介者確認",
  contactPermission: "連絡可否",
  priority: "優先度",
  recruitingPotential: "求人開拓可能性",
  studentSupportPotential: "学生紹介・OB訪問協力可能性",
  contactStatus: "連絡ステータス",
  recruitingStatus: "求人開拓ステータス",
  lastContactDate: "最終連絡日",
  nextActionDate: "次回アクション日",
  memo: "メモ",
  importSource: "取り込み元",
};

export const RECOMMENDED_CSV_COLUMNS = [
  "氏名",
  "ふりがな",
  "区分",
  "学校名",
  "学部・学科",
  "卒業年",
  "所属企業",
  "部署",
  "役職",
  "業種",
  "地域",
  "メールアドレス",
  "電話番号",
  "Facebook URL",
  "紹介者",
  "所属ロッジ",
  "紹介者との関係",
  "メモ",
];

export const CSV_COLUMN_ALIASES: Record<string, MemberFieldKey> = {
  氏名: "name",
  名前: "name",
  name: "name",
  ふりがな: "kana",
  フリガナ: "kana",
  区分: "type",
  学校名: "school",
  学校: "school",
  "学部・学科": "faculty",
  学部: "faculty",
  卒業年: "graduationYear",
  所属企業: "company",
  会社: "company",
  企業: "company",
  部署: "department",
  役職: "position",
  業種: "industry",
  地域: "area",
  メールアドレス: "email",
  メール: "email",
  email: "email",
  電話番号: "phone",
  電話: "phone",
  "Facebook URL": "facebookUrl",
  Facebook: "facebookUrl",
  紹介者: "referrerName",
  紹介者名: "referrerName",
  所属ロッジ: "lodgeOwnerName",
  ロッジ: "lodgeOwnerName",
  ロッジオーナー: "lodgeOwnerName",
  紹介者との関係: "referrerRelation",
  メモ: "memo",
};
