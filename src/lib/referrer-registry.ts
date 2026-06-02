import type { Member } from "./types";

export interface ReferrerSummaryLite {
  referrerName: string;
  total: number;
  students: number;
  obOg: number;
  priorityA: number;
  recruitingCandidates: number;
  incomplete: number;
}

export type ReferrerTier = "representative" | "lodge_owner" | "other";

export const REPRESENTATIVE = "川西知行";

/** ロッジオーナー（管理者）— 表示順 */
export const LODGE_OWNERS = [
  "三分一翔太",
  "中山諒大",
  "佐藤広輝",
  "稲野克樹",
  "大屋李空",
  "今中太基",
  "金森晴",
  "岩井迪堅介",
  "島田航太",
  "後藤亮治",
  "福与啓太",
  "中澤涼太",
  "伊東遼太",
  "廣田航輝",
  "Sakata Yuki",
  "横山達郎",
  "中村太亮",
  "三原ゆうじ",
  "村田一成",
  "森健太郎",
  "押川隼也",
  "浮田真吾",
  "清水聡真",
  "正角一乗",
  "久野拓希",
] as const;

const LODGE_OWNER_SET = new Set<string>(LODGE_OWNERS);

/** 略称・旧表記 → 正規フルネーム */
export const REFERRER_ALIASES: Record<string, string> = {
  // ロッジオーナー表記ゆれ
  岩井迫堅介: "岩井迪堅介",
  岩井迫: "岩井迪堅介",
  岩井優賢: "岩井優賢",
  伊東: "伊東遼太",
  横山: "横山達郎",
  坂田: "Sakata Yuki",
  髙田: "高田睦貴",
  // 名簿略称 → メンバー氏名（確定）
  上田: "上田大志",
  江田: "江田孝弘",
  中間: "中間祐光",
  稲野: "稲野克樹",
  島田: "島田航太",
  今中: "今中太基",
  尾崎: "尾崎雄太",
  柴山: "柴山諒音",
  土肥: "土肥優扶馬",
  大江: "大江祥太",
  内藤: "内藤史弥",
  前田: "前田奨",
  井上: "井上健生",
  井野: "井野翼",
  伊井: "伊井柊磨",
  八松: "八松史晃",
  冨岡: "冨岡凌平",
  山口: "山口綾華",
  "山本隼": "山本隼暉",
  山本隼暉: "山本隼暉",
  岡本: "岡本武",
  岩井: "岩井迪堅介",
  岩﨑: "岩井迪堅介",
  川畑: "川畑永喬",
  川野: "川野裕司",
  松崎: "松崎覚詩",
  松永: "松永大輝",
  板金: "板金篤志",
  林: "林崇平",
  浦壁: "浦壁",
  浦田: "浦田",
  渡辺: "渡辺陸",
  田中: "田中慶応",
  福場: "福場拓人",
  稲葉: "稲葉皐",
  竹重: "竹重俊佑",
  米田: "米田敬史",
  紀本: "紀本悟志",
  長谷: "長谷川峻生",
  長谷川: "長谷川峻生",
  高島: "高島渓太",
  齋藤: "齋藤佳吾",
  三室: "三室佳弘",
  中島: "中島康介",
  武田: "武田そよか",
  勝海: "勝海",
  五坪: "五坪",
  岡島: "岡島",
  岡田: "岡田",
  永井: "永井",
  西本: "西本",
  西條: "西條",
  青山: "青山",
  白石: "白石",
};

/**
 * その他紹介者（正規名）→ 担当ロッジオーナー
 * 名簿・既存データからの割当（未登録の略称は正規化後にここへ追記）
 */
export const OTHER_REFERRER_PARENT: Record<string, string> = {
  三室佳弘: "久野拓希",
  上田大志: "押川隼也",
  中島康介: "村田一成",
  中間祐光: "今中太基",
  五坪: "三分一翔太",
  井上健生: "森健太郎",
  井野翼: "中山諒大",
  伊井柊磨: "伊東遼太",
  八松史晃: "正角一乗",
  内藤史弥: "浮田真吾",
  冨岡凌平: "清水聡真",
  前田奨: "中村太亮",
  勝海: "中山諒大",
  土肥優扶馬: "佐藤広輝",
  大江祥太: "廣田航輝",
  尾崎雄太: "島田航太",
  山口綾華: "金森晴",
  山本隼暉: "後藤亮治",
  岡島: "三分一翔太",
  岡本武: "三原ゆうじ",
  岡田: "三分一翔太",
  岩井優賢: "岩井迪堅介",
  川畑永喬: "大屋李空",
  川野裕司: "福与啓太",
  松崎覚詩: "中澤涼太",
  松永大輝: "村田一成",
  板金篤志: "正角一乗",
  林崇平: "森健太郎",
  柴山諒音: "伊東遼太",
  永井: "久野拓希",
  江田孝弘: "稲野克樹",
  浦壁: "押川隼也",
  浦田: "中村太亮",
  渡辺陸: "佐藤広輝",
  田中慶応: "金森晴",
  白石: "三原ゆうじ",
  福場拓人: "福与啓太",
  稲葉皐: "稲野克樹",
  竹重俊佑: "清水聡真",
  米田敬史: "大屋李空",
  紀本悟志: "浮田真吾",
  西本: "中澤涼太",
  西條: "後藤亮治",
  長谷川峻生: "久野拓希",
  青山: "金森晴",
  高島渓太: "押川隼也",
  高田睦貴: "押川隼也",
  齋藤佳吾: "森健太郎",
  武田そよか: "中山諒大",
};

export interface ReferrerNode {
  canonicalName: string;
  tier: ReferrerTier;
  parentName?: string;
}

export interface OtherReferrerBranch {
  canonicalName: string;
  parentLodgeOwner: string | null;
  unassigned: boolean;
  directMembers: Member[];
  summary: ReferrerSummaryLite | null;
}

export interface LodgeOwnerBranch {
  canonicalName: string;
  affiliatedMembers: Member[];
  directMembers: Member[];
  otherReferrers: OtherReferrerBranch[];
  summary: ReferrerSummaryLite | null;
  affiliatedCount: number;
  directReferralCount: number;
  totalReferralCount: number;
  otherReferrerCount: number;
}

export interface ReferrerForest {
  representative: {
    name: string;
    lodgeOwners: LodgeOwnerBranch[];
    unassignedOthers: OtherReferrerBranch[];
    totalReferredMembers: number;
    totalAffiliatedMembers: number;
    noLodgeCount: number;
  };
}

const CANONICAL_POOL: string[] = [REPRESENTATIVE, ...LODGE_OWNERS];

function uniquePrefixMatch(raw: string, pool: string[]): string | null {
  const matches = pool.filter((n) => n === raw || n.startsWith(raw) || raw.startsWith(n));
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    const exact = matches.find((n) => n === raw);
    if (exact) return exact;
    const prefix = matches.find((n) => n.startsWith(raw));
    if (prefix) return prefix;
  }
  return null;
}

/** 紹介者名を正規フルネームに統一 */
export function normalizeReferrerName(
  raw: string,
  allMemberNames: string[] = []
): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";

  if (REFERRER_ALIASES[trimmed]) return REFERRER_ALIASES[trimmed];
  if (trimmed === REPRESENTATIVE) return REPRESENTATIVE;
  if (LODGE_OWNER_SET.has(trimmed)) return trimmed;

  const pool = [...new Set([...CANONICAL_POOL, ...allMemberNames])];
  const fromPool = uniquePrefixMatch(trimmed, pool);
  if (fromPool) return fromPool;

  const memberMatch = uniquePrefixMatch(trimmed, allMemberNames);
  if (memberMatch) return memberMatch;

  return trimmed;
}

export function getReferrerTier(canonicalName: string): ReferrerTier {
  if (!canonicalName) return "other";
  if (canonicalName === REPRESENTATIVE) return "representative";
  if (LODGE_OWNER_SET.has(canonicalName)) return "lodge_owner";
  return "other";
}

export function getReferrerParent(canonicalName: string): string | undefined {
  const tier = getReferrerTier(canonicalName);
  if (tier === "representative") return undefined;
  if (tier === "lodge_owner") return REPRESENTATIVE;
  return OTHER_REFERRER_PARENT[canonicalName];
}

export function isKnownReferrer(canonicalName: string): boolean {
  if (!canonicalName) return false;
  const tier = getReferrerTier(canonicalName);
  if (tier !== "other") return true;
  return canonicalName in OTHER_REFERRER_PARENT;
}

/** 所属ロッジ名を LODGE_OWNERS のフルネームに正規化 */
export function normalizeLodgeOwnerName(raw: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  if (LODGE_OWNER_SET.has(trimmed)) return trimmed;
  const alias = REFERRER_ALIASES[trimmed];
  if (alias && LODGE_OWNER_SET.has(alias)) return alias;
  const fromLo = uniquePrefixMatch(trimmed, [...LODGE_OWNERS]);
  if (fromLo) return fromLo;
  return trimmed;
}

/** 初回マイグレーション用：紹介者から所属ロッジを推測（手直し前提） */
export function suggestLodgeOwnerName(
  member: Pick<Member, "referrerName">
): string {
  const ref = (member.referrerName || "").trim();
  if (!ref) return "";
  const tier = getReferrerTier(ref);
  if (tier === "lodge_owner") return ref;
  if (tier === "other") {
    const parent = OTHER_REFERRER_PARENT[ref];
    if (parent && LODGE_OWNER_SET.has(parent)) return parent;
  }
  return "";
}

export function getReferrerSelectOptions(): {
  representative: string;
  lodgeOwners: readonly string[];
  others: string[];
} {
  const others = Object.keys(OTHER_REFERRER_PARENT).sort((a, b) =>
    a.localeCompare(b, "ja")
  );
  return {
    representative: REPRESENTATIVE,
    lodgeOwners: LODGE_OWNERS,
    others,
  };
}

export function buildReferrerForest(
  members: Member[],
  summaries: ReferrerSummaryLite[]
): ReferrerForest {
  const summaryByName = new Map(summaries.map((s) => [s.referrerName, s]));

  const membersByReferrer = new Map<string, Member[]>();
  for (const m of members) {
    if (!m.referrerName?.trim()) continue;
    const key = m.referrerName;
    if (!membersByReferrer.has(key)) membersByReferrer.set(key, []);
    membersByReferrer.get(key)!.push(m);
  }

  const otherReferrerNames = new Set<string>();
  for (const name of membersByReferrer.keys()) {
    if (getReferrerTier(name) === "other") otherReferrerNames.add(name);
  }
  for (const name of Object.keys(OTHER_REFERRER_PARENT)) {
    if (summaryByName.has(name) || membersByReferrer.has(name)) {
      otherReferrerNames.add(name);
    }
  }

  const unassignedOthers: OtherReferrerBranch[] = [];
  const othersByLodgeOwner = new Map<string, OtherReferrerBranch[]>();

  for (const name of otherReferrerNames) {
    const parent = OTHER_REFERRER_PARENT[name];
    const branch: OtherReferrerBranch = {
      canonicalName: name,
      parentLodgeOwner: parent || null,
      unassigned: !parent,
      directMembers: membersByReferrer.get(name) || [],
      summary: summaryByName.get(name) || null,
    };
    if (!parent) {
      unassignedOthers.push(branch);
      continue;
    }
    if (!othersByLodgeOwner.has(parent)) othersByLodgeOwner.set(parent, []);
    othersByLodgeOwner.get(parent)!.push(branch);
  }

  const membersByLodge = new Map<string, Member[]>();
  let noLodgeCount = 0;
  for (const m of members) {
    const lodge = (m.lodgeOwnerName || "").trim();
    if (!lodge) {
      noLodgeCount++;
      continue;
    }
    if (!membersByLodge.has(lodge)) membersByLodge.set(lodge, []);
    membersByLodge.get(lodge)!.push(m);
  }

  const lodgeOwners: LodgeOwnerBranch[] = LODGE_OWNERS.map((loName) => {
    const affiliatedMembers = membersByLodge.get(loName) || [];
    const directMembers = membersByReferrer.get(loName) || [];
    const otherReferrers = (othersByLodgeOwner.get(loName) || []).sort((a, b) =>
      a.canonicalName.localeCompare(b.canonicalName, "ja")
    );
    const indirectReferralCount = otherReferrers.reduce(
      (sum, o) => sum + o.directMembers.length,
      0
    );
    return {
      canonicalName: loName,
      affiliatedMembers,
      directMembers,
      otherReferrers,
      summary: summaryByName.get(loName) || null,
      affiliatedCount: affiliatedMembers.length,
      directReferralCount: directMembers.length,
      totalReferralCount: directMembers.length + indirectReferralCount,
      otherReferrerCount: otherReferrers.length,
    };
  });

  let totalReferredMembers = 0;
  for (const [, list] of membersByReferrer) {
    totalReferredMembers += list.length;
  }

  let totalAffiliatedMembers = 0;
  for (const [, list] of membersByLodge) {
    totalAffiliatedMembers += list.length;
  }

  return {
    representative: {
      name: REPRESENTATIVE,
      lodgeOwners,
      unassignedOthers: unassignedOthers.sort((a, b) =>
        a.canonicalName.localeCompare(b.canonicalName, "ja")
      ),
      totalReferredMembers,
      totalAffiliatedMembers,
      noLodgeCount,
    },
  };
}

export function migrateMemberReferrerNames(members: Member[]): Member[] {
  const allNames = members.map((m) => m.name);
  return members.map((m) => {
    if (!m.referrerName?.trim()) return m;
    const normalized = normalizeReferrerName(m.referrerName, allNames);
    if (normalized === m.referrerName) return m;
    const ref = members.find((x) => x.name === normalized);
    return {
      ...m,
      referrerName: normalized,
      referrerId: ref?.id || m.referrerId,
    };
  });
}

function resolveLodgeOwnerId(
  lodgeOwnerName: string,
  members: Member[]
): string {
  if (!lodgeOwnerName) return "";
  const lo = members.find((m) => m.name === lodgeOwnerName);
  return lo?.id || "";
}

export function migrateMemberLodgeNames(members: Member[]): Member[] {
  return members.map((m) => {
    let lodgeOwnerName = (m.lodgeOwnerName || "").trim();
    if (lodgeOwnerName) {
      lodgeOwnerName = normalizeLodgeOwnerName(lodgeOwnerName);
    } else {
      lodgeOwnerName = suggestLodgeOwnerName(m);
    }
    const lodgeOwnerId = lodgeOwnerName
      ? resolveLodgeOwnerId(lodgeOwnerName, members) || m.lodgeOwnerId || ""
      : "";
    if (
      lodgeOwnerName === (m.lodgeOwnerName || "") &&
      lodgeOwnerId === (m.lodgeOwnerId || "")
    ) {
      return m;
    }
    return { ...m, lodgeOwnerName, lodgeOwnerId };
  });
}

/** v8: 紹介者正規化 + 所属ロッジ推測 */
export function migrateMembersForV8(members: Member[]): Member[] {
  return migrateMemberLodgeNames(migrateMemberReferrerNames(members));
}
