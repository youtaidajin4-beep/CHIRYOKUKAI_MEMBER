import type { Member, MemberType } from "./types";
import {
  getReferrerParent,
  getReferrerTier,
  normalizeLodgeOwnerName,
  normalizeReferrerName,
  type ReferrerTier,
} from "./referrer-registry";

const WEIGHTS: { key: keyof Member; weight: number }[] = [
  { key: "name", weight: 10 },
  { key: "type", weight: 8 },
  { key: "referrerName", weight: 10 },
  { key: "lodgeOwnerName", weight: 8 },
  { key: "email", weight: 6 },
  { key: "phone", weight: 6 },
  { key: "facebookUrl", weight: 4 },
  { key: "company", weight: 8 },
  { key: "school", weight: 6 },
  { key: "industry", weight: 5 },
  { key: "area", weight: 5 },
  { key: "priority", weight: 5 },
  { key: "recruitingPotential", weight: 5 },
];

function isFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  const s = String(value).trim();
  if (!s) return false;
  if (s === "不明" || s === "未設定") return false;
  return true;
}

export function calculateDataCompleteness(member: Partial<Member>): number {
  let score = 0;
  let max = 0;
  for (const { key, weight } of WEIGHTS) {
    max += weight;
    if (isFilled(member[key])) score += weight;
  }
  return max > 0 ? Math.round((score / max) * 100) : 0;
}

export function isIncompleteMember(m: Member): boolean {
  if (m.type === "不明") return true;
  if (!m.referrerName?.trim()) return true;
  if (!m.lodgeOwnerName?.trim()) return true;
  if (!m.company?.trim() && (m.type === "OB" || m.type === "OG" || m.type === "社会人" || m.type === "企業関係者"))
    return true;
  if (!m.school?.trim() && m.type === "学生") return true;
  if (!m.email?.trim() && !m.phone?.trim() && !m.facebookUrl?.trim()) return true;
  if (m.recruitingPotential === "不明") return true;
  if (m.priority === "未設定") return true;
  return false;
}

export function hasNoReferrer(m: Member): boolean {
  return !m.referrerName?.trim() && !m.referrerId?.trim();
}

export function hasNoLodge(m: Member): boolean {
  return !m.lodgeOwnerName?.trim() && !m.lodgeOwnerId?.trim();
}

export function isRecruitingCandidate(m: Member): boolean {
  const eligibleType = ["OB", "OG", "社会人", "企業関係者"].includes(m.type);
  const hasCompany = !!m.company?.trim();
  const highPriority = m.priority === "A";
  const highPotential = m.recruitingPotential === "高い";
  const confirmed = m.referralConfirmed === "確認済み";
  const contactPlanned = m.contactStatus === "本人へ連絡予定";
  const inProgress = ["相談中", "求人開拓依頼済み", "相談予定"].includes(m.recruitingStatus);

  return (
    eligibleType ||
    hasCompany ||
    highPriority ||
    highPotential ||
    confirmed ||
    contactPlanned ||
    inProgress
  );
}

export function isUpcomingAction(m: Member, withinDays = 7): boolean {
  if (!m.nextActionDate) return false;
  const next = new Date(m.nextActionDate);
  const now = new Date();
  const diff = (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= withinDays;
}

export function countByType(members: Member[], type: MemberType): number {
  return members.filter((m) => m.type === type).length;
}

export function groupByIndustry(members: Member[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const m of members) {
    const key = m.industry?.trim() || "未設定";
    map[key] = (map[key] || 0) + 1;
  }
  return map;
}

export function groupByArea(members: Member[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const m of members) {
    const key = m.area?.trim() || "未設定";
    map[key] = (map[key] || 0) + 1;
  }
  return map;
}

export interface ReferrerSummary {
  referrerId: string;
  referrerName: string;
  tier: ReferrerTier;
  parentName?: string;
  total: number;
  students: number;
  obOg: number;
  working: number;
  corporate: number;
  priorityA: number;
  recruitingCandidates: number;
  incomplete: number;
  lastUpdated: string;
}

export function buildReferrerSummaries(members: Member[]): ReferrerSummary[] {
  const allNames = members.map((m) => m.name);
  const referrerNames = new Set<string>();
  members.forEach((m) => {
    if (m.referrerName) {
      referrerNames.add(normalizeReferrerName(m.referrerName, allNames));
    }
  });

  const summaries: ReferrerSummary[] = [];

  for (const name of referrerNames) {
    if (!name) continue;
    const referred = members.filter(
      (m) => normalizeReferrerName(m.referrerName, allNames) === name
    );
    const referrerMember = members.find((m) => m.name === name);
    const referrerId = referrerMember?.id || `ref-${name}`;
    const tier = getReferrerTier(name);
    const parentName = getReferrerParent(name);

    let lastUpdated = "";
    referred.forEach((m) => {
      if (!lastUpdated || m.updatedAt > lastUpdated) lastUpdated = m.updatedAt;
    });

    summaries.push({
      referrerId,
      referrerName: name,
      tier,
      parentName,
      total: referred.length,
      students: referred.filter((m) => m.type === "学生").length,
      obOg: referred.filter((m) => m.type === "OB" || m.type === "OG").length,
      working: referred.filter((m) => m.type === "社会人").length,
      corporate: referred.filter((m) => m.type === "企業関係者").length,
      priorityA: referred.filter((m) => m.priority === "A").length,
      recruitingCandidates: referred.filter(isRecruitingCandidate).length,
      incomplete: referred.filter(isIncompleteMember).length,
      lastUpdated: lastUpdated || new Date().toISOString(),
    });
  }

  return summaries.sort((a, b) => b.total - a.total);
}

export interface DuplicateGroup {
  id: string;
  reason: string;
  members: Member[];
  matchField: string;
}

export function findDuplicateGroups(members: Member[]): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];
  const seen = new Set<string>();

  const addGroup = (reason: string, matchField: string, ids: string[]) => {
    const uniqueIds = [...new Set(ids)];
    if (uniqueIds.length < 2) return;
    const key = uniqueIds.sort().join("|");
    if (seen.has(key)) return;
    seen.add(key);
    const matched = members.filter((m) => uniqueIds.includes(m.id));
    groups.push({
      id: `dup-${groups.length + 1}`,
      reason,
      matchField,
      members: matched,
    });
  };

  // Exact matches
  const byEmail = new Map<string, string[]>();
  const byPhone = new Map<string, string[]>();
  const byFb = new Map<string, string[]>();

  members.forEach((m) => {
    if (m.email?.trim()) {
      const e = m.email.trim().toLowerCase();
      if (!byEmail.has(e)) byEmail.set(e, []);
      byEmail.get(e)!.push(m.id);
    }
    if (m.phone?.trim()) {
      const p = m.phone.replace(/\D/g, "");
      if (!byPhone.has(p)) byPhone.set(p, []);
      byPhone.get(p)!.push(m.id);
    }
    if (m.facebookUrl?.trim()) {
      const f = m.facebookUrl.trim().toLowerCase();
      if (!byFb.has(f)) byFb.set(f, []);
      byFb.get(f)!.push(m.id);
    }
  });

  byEmail.forEach((ids, email) => addGroup(`同じメールアドレス: ${email}`, "メールアドレス", ids));
  byPhone.forEach((ids) => addGroup("同じ電話番号", "電話番号", ids));
  byFb.forEach((ids) => addGroup("同じFacebook URL", "Facebook URL", ids));

  // Same name
  const byName = new Map<string, string[]>();
  members.forEach((m) => {
    const n = m.name.trim();
    if (!n) return;
    if (!byName.has(n)) byName.set(n, []);
    byName.get(n)!.push(m.id);
  });
  byName.forEach((ids, name) => {
    if (ids.length >= 2) addGroup(`同姓同名の可能性: ${name}`, "氏名", ids);
  });

  // Same company
  const byCompany = new Map<string, Member[]>();
  members.forEach((m) => {
    if (!m.company?.trim()) return;
    const c = m.company.trim();
    if (!byCompany.has(c)) byCompany.set(c, []);
    byCompany.get(c)!.push(m);
  });
  byCompany.forEach((list, company) => {
    if (list.length >= 2) {
      addGroup(`同じ所属企業: ${company}`, "所属企業", list.map((m) => m.id));
    }
  });

  return groups;
}

export function getDashboardStats(members: Member[], recentlyImportedDays = 30) {
  const now = new Date();
  const recentCutoff = new Date(now);
  recentCutoff.setDate(recentCutoff.getDate() - recentlyImportedDays);

  return {
    total: members.length,
    students: countByType(members, "学生"),
    obOg: countByType(members, "OB") + countByType(members, "OG"),
    working: countByType(members, "社会人"),
    corporate: countByType(members, "企業関係者"),
    unknownType: countByType(members, "不明"),
    noReferrer: members.filter(hasNoReferrer).length,
    noLodge: members.filter(hasNoLodge).length,
    incomplete: members.filter(isIncompleteMember).length,
    priorityA: members.filter((m) => m.priority === "A").length,
    recruitingCandidates: members.filter(isRecruitingCandidate).length,
    needsReferralConfirm: members.filter(
      (m) => m.referralConfirmed === "未確認" || m.referralConfirmed === "確認予定"
    ).length,
    contactPlanned: members.filter((m) => m.contactStatus === "本人へ連絡予定").length,
    upcomingActions: members.filter((m) => isUpcomingAction(m)).length,
    recentlyImported: members.filter((m) => {
      const created = new Date(m.createdAt);
      return created >= recentCutoff && m.importSource.includes("CSV");
    }).length,
    byIndustry: groupByIndustry(members),
    byArea: groupByArea(members),
    referrerRanking: buildReferrerSummaries(members).slice(0, 10),
  };
}

export function truncateMemo(memo: string, max = 40): string {
  if (!memo) return "";
  if (memo.length <= max) return memo;
  return memo.slice(0, max) + "…";
}

export function generateId(prefix = "m"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function enrichMember(partial: Partial<Member>, allMembers: Member[]): Member {
  const now = new Date().toISOString();
  const allNames = allMembers.map((m) => m.name);
  const referrerName = partial.referrerName
    ? normalizeReferrerName(partial.referrerName, allNames)
    : "";
  let referrerId = partial.referrerId || "";
  if (referrerName && !referrerId) {
    const ref = allMembers.find((m) => m.name === referrerName);
    if (ref) referrerId = ref.id;
  }

  const lodgeOwnerName = partial.lodgeOwnerName
    ? normalizeLodgeOwnerName(partial.lodgeOwnerName)
    : "";
  let lodgeOwnerId = partial.lodgeOwnerId || "";
  if (lodgeOwnerName && !lodgeOwnerId) {
    const lo = allMembers.find((m) => m.name === lodgeOwnerName);
    if (lo) lodgeOwnerId = lo.id;
  }

  const base: Member = {
    id: partial.id || generateId(),
    name: partial.name || "",
    kana: partial.kana || "",
    type: partial.type || "不明",
    status: partial.status || "不明",
    school: partial.school || "",
    faculty: partial.faculty || "",
    graduationYear: partial.graduationYear || "",
    company: partial.company || "",
    department: partial.department || "",
    position: partial.position || "",
    industry: partial.industry || "",
    area: partial.area || "",
    email: partial.email || "",
    phone: partial.phone || "",
    facebookUrl: partial.facebookUrl || "",
    referrerName,
    referrerId,
    lodgeOwnerName,
    lodgeOwnerId,
    referrerRelation: partial.referrerRelation || "不明",
    referralRoute: partial.referralRoute || "",
    referralConfirmed: partial.referralConfirmed || "未確認",
    contactPermission: partial.contactPermission || "未確認",
    priority: partial.priority || "未設定",
    recruitingPotential: partial.recruitingPotential || "不明",
    studentSupportPotential: partial.studentSupportPotential || "不明",
    contactStatus: partial.contactStatus || "未確認",
    recruitingStatus: partial.recruitingStatus || "未着手",
    lastContactDate: partial.lastContactDate || "",
    nextActionDate: partial.nextActionDate || "",
    memo: partial.memo || "",
    tags: partial.tags || [],
    importSource: partial.importSource || "手入力",
    dataCompleteness: 0,
    duplicateWarning: false,
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
  };

  base.dataCompleteness = calculateDataCompleteness(base);
  return base;
}

export function filterMembers(
  members: Member[],
  filters: {
    searchName?: string;
    searchCompany?: string;
    searchSchool?: string;
    searchReferrer?: string;
    searchLodge?: string;
    lodgeOwner?: string;
    type?: string;
    area?: string;
    industry?: string;
    priority?: string;
    contactStatus?: string;
    recruitingStatus?: string;
    incompleteOnly?: boolean;
    noReferrerOnly?: boolean;
    noLodgeOnly?: boolean;
    duplicateOnly?: boolean;
  }
): Member[] {
  return members.filter((m) => {
    if (filters.searchName && !m.name.includes(filters.searchName) && !m.kana.includes(filters.searchName))
      return false;
    if (filters.searchCompany && !m.company.includes(filters.searchCompany)) return false;
    if (filters.searchSchool && !m.school.includes(filters.searchSchool)) return false;
    if (filters.searchReferrer && !m.referrerName.includes(filters.searchReferrer)) return false;
    if (filters.searchLodge && !m.lodgeOwnerName.includes(filters.searchLodge)) return false;
    if (
      filters.lodgeOwner &&
      filters.lodgeOwner !== "all" &&
      m.lodgeOwnerName !== filters.lodgeOwner
    )
      return false;
    if (filters.type && filters.type !== "all" && m.type !== filters.type) return false;
    if (filters.area && filters.area !== "all" && m.area !== filters.area) return false;
    if (filters.industry && filters.industry !== "all" && m.industry !== filters.industry) return false;
    if (filters.priority && filters.priority !== "all" && m.priority !== filters.priority) return false;
    if (filters.contactStatus && filters.contactStatus !== "all" && m.contactStatus !== filters.contactStatus)
      return false;
    if (
      filters.recruitingStatus &&
      filters.recruitingStatus !== "all" &&
      m.recruitingStatus !== filters.recruitingStatus
    )
      return false;
    if (filters.incompleteOnly && !isIncompleteMember(m)) return false;
    if (filters.noReferrerOnly && !hasNoReferrer(m)) return false;
    if (filters.noLodgeOnly && !hasNoLodge(m)) return false;
    if (filters.duplicateOnly && !m.duplicateWarning) return false;
    return true;
  });
}

export function markDuplicateWarnings(members: Member[]): Member[] {
  const groups = findDuplicateGroups(members);
  const dupIds = new Set<string>();
  groups.forEach((g) => g.members.forEach((m) => dupIds.add(m.id)));
  return members.map((m) => ({
    ...m,
    duplicateWarning: dupIds.has(m.id),
  }));
}
