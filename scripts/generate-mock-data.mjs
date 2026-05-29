import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STUDENT_FILES = ["students.tsv", "students-batch2.tsv"];

function normalizeName(name) {
  return (name || "").replace(/[\s　]+/g, "").trim();
}

function readStudentTsv(filename) {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) return [];

  const tsv = fs.readFileSync(filePath, "utf-8");
  const lines = tsv.split(/\r?\n/).filter((l) => l.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split("\t").map((c) => c.trim());
    if (!cols[0]) continue;

    const name = cols[0].replace(/[\s　]+/g, "");
    let school = cols[1] || "";
    let area = "";
    let gradYear = "";

    if (cols.length >= 4 && /^(関西|関東|九州|名古屋)/.test(cols[2])) {
      area = cols[2];
      gradYear = cols[3] || "";
    } else if (cols.length >= 3) {
      if (/^(関西|関東|九州|名古屋)/.test(cols[2])) {
        area = cols[2];
        gradYear = cols[3] || "";
      } else {
        gradYear = cols[2];
        area = inferAreaFromSchool(school);
      }
    }

    rows.push({
      name,
      school,
      area: mapArea(area) || inferAreaFromSchool(school),
      gradYear,
      source: filename,
    });
  }
  return rows;
}

function inferAreaFromSchool(school) {
  const s = school || "";
  if (/熊本|九州|福岡|佐賀|長崎|大分|宮崎|鹿児島/.test(s)) return "九州";
  if (/名古屋|愛知/.test(s)) return "名古屋";
  if (
    /東京|早稲田|明治|慶應|筑波|上智|法政|中央|一橋|学芸|都立|理科|青山|横浜/.test(s)
  )
    return "関東";
  if (
    /大阪|京都|神戸|同志社|関西|立命館|兵庫|滋賀|公立/.test(s)
  )
    return "関西";
  return "";
}

function mapArea(region) {
  const r = (region || "").trim();
  if (r === "名古屋") return "名古屋";
  if (r === "関西" || r === "関東" || r === "九州") return r;
  return r;
}

function mergeStudentRow(a, b) {
  const score = (r) =>
    (r.school ? 1 : 0) + (r.area ? 1 : 0) + (r.gradYear ? 1 : 0);
  const base = score(a) >= score(b) ? { ...a } : { ...b };
  const other = base === a ? b : a;
  return {
    name: base.name,
    school: base.school || other.school,
    area: base.area || other.area,
    gradYear: base.gradYear || other.gradYear,
    source: [base.source, other.source].filter(Boolean).join("+"),
  };
}

/** 学生名簿内の重複を統合（正規化氏名で1人に） */
function dedupeStudentRows(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = normalizeName(row.name);
    if (!key) continue;
    if (map.has(key)) {
      map.set(key, mergeStudentRow(map.get(key), row));
    } else {
      map.set(key, row);
    }
  }
  return [...map.values()];
}

function readRosterTsv() {
  const tsv = fs.readFileSync(path.join(__dirname, "roster.tsv"), "utf-8");
  const lines = tsv.split(/\r?\n/).filter((l) => l.trim());
  const header = lines[0].split("\t");
  return lines.slice(1).map((line) => {
    const cols = line.split("\t");
    const row = {};
    header.forEach((h, i) => {
      row[h.trim()] = (cols[i] || "").trim();
    });
    return row;
  });
}

function parseDate(raw) {
  const s = (raw || "").trim();
  if (!s) return "";
  const m = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (m) {
    return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  }
  return "";
}

function assignAlumniType(name) {
  const ogPatterns =
    /(子|美|愛|花|菜|実|香|恵|絵|奈|莉|萌|結|咲|華|里|佳|帆|乃|音|桜|伽|枝|姫|幸|寿|和|代|冬|芽|蓮|依|温|暖|葵|実|紗|夢|輝|萌)$/;
  const ogNames =
    /(結衣|望愛|七海|そよか|友規|早桜|穂乃花|みく菜|百合子|美穂|花栄|明香里|夏実|琴萌|蒼依|悠冬|芽衣|さくら|茉夢|有紗|茅乃|奈勢|美玖|知奈実)$/;
  if (ogNames.test(name) || ogPatterns.test(name)) return "OG";
  return "OB";
}

function normalizeReferrer(ref) {
  return (ref || "").trim();
}

function resolveReferrerId(referrerShort, nameToId, allNames) {
  if (!referrerShort) return "";
  if (nameToId[referrerShort]) return nameToId[referrerShort];
  const matches = allNames.filter(
    (n) => n.startsWith(referrerShort) || n.includes(referrerShort)
  );
  if (matches.length === 1) return nameToId[matches[0]];
  if (matches.length > 1) {
    const exact = matches.find((n) => n.slice(0, referrerShort.length) === referrerShort);
    if (exact) return nameToId[exact];
    return nameToId[matches[0]] || "";
  }
  return "";
}

function resolveReferrerFullName(referrerShort, allNames) {
  if (!referrerShort) return "";
  const matches = allNames.filter(
    (n) => n.startsWith(referrerShort) || n === referrerShort
  );
  if (matches.length === 0) return referrerShort;
  if (matches.length === 1) return matches[0];
  const exact = matches.find((n) => n.startsWith(referrerShort));
  return exact || matches[0];
}

function enrichExisting(existing, row) {
  const gradYear = row.gradYear || "";
  const gradNum = gradYear.replace(/卒.*$/, "").replace(/or.*$/, "").trim();
  if (row.school && !existing.school) existing.school = row.school;
  if (row.area && !existing.area) existing.area = row.area;
  if (gradNum && !existing.graduationYear) existing.graduationYear = gradNum;
  const tag = gradYear || "";
  if (tag && !existing.tags.includes(tag)) existing.tags.push(tag);
}

// --- Roster → OB/OG ---
const rosterRows = readRosterTsv();
const rosterSeen = new Set();
const uniqueRoster = [];
for (const row of rosterRows) {
  const name = normalizeName(row["氏名"]);
  if (!name) continue;
  const key = `${name}|${row["勤務先"] || ""}`;
  if (rosterSeen.has(key) && row["勤務先"]) continue;
  if (rosterSeen.has(name) && !row["勤務先"]) continue;
  rosterSeen.add(key);
  rosterSeen.add(name);
  uniqueRoster.push({ ...row, 氏名: name });
}

const now = "2026-05-30T16:00:00.000Z";
let idCounter = 1;
const nextId = () => `m-${String(idCounter++).padStart(4, "0")}`;

const members = [];
const byNormName = new Map();

function registerMember(member) {
  members.push(member);
  byNormName.set(normalizeName(member.name), member);
}

for (const row of uniqueRoster) {
  const name = row["氏名"];
  const company = row["勤務先"] || "";
  const area = row["居住地"] === "？" ? "" : row["居住地"] || "";
  const referrerShort = normalizeReferrer(row["紹介者"]);
  const lastContact = parseDate(row["直近連絡日"]);
  const memo = row["備考"] || "";
  const gradYear = row["卒業年"] || "";
  const alumniType = assignAlumniType(name);

  registerMember({
    id: nextId(),
    name,
    kana: "",
    type: alumniType,
    status: "卒業済み",
    school: "",
    faculty: "",
    graduationYear: gradYear.replace(/卒/, "") || gradYear,
    company: /大学|大学院/.test(company) ? "" : company,
    department: "",
    position: "",
    industry: "",
    area,
    email: "",
    phone: "",
    facebookUrl: "",
    referrerName: referrerShort,
    referrerId: "",
    referrerRelation: referrerShort ? "知人" : "不明",
    referralRoute: "",
    referralConfirmed: referrerShort ? "未確認" : "未確認",
    contactPermission: "未確認",
    priority: "未設定",
    recruitingPotential: company ? "普通" : "不明",
    studentSupportPotential: "不明",
    contactStatus: lastContact ? "本人へ連絡済み" : "未確認",
    recruitingStatus: "未着手",
    lastContactDate: lastContact,
    nextActionDate: "",
    memo: [memo, gradYear].filter(Boolean).join(" / "),
    tags: [alumniType, gradYear].filter(Boolean),
    importSource: "知力会スプレッドシート",
    dataCompleteness: 0,
    duplicateWarning: false,
    createdAt: now,
    updatedAt: now,
    _referrerShort: referrerShort,
  });
}

// --- Students: 複数ファイル統合 → 名簿内重複排除 → システム内重複は追加しない ---
let allStudentRows = [];
for (const file of STUDENT_FILES) {
  allStudentRows.push(...readStudentTsv(file));
}

const rawStudentCount = allStudentRows.length;
const uniqueStudents = dedupeStudentRows(allStudentRows);
const intraDeduped = rawStudentCount - uniqueStudents.length;

let studentsAdded = 0;
let studentsSkippedSystem = 0;
let studentsMergedObOg = 0;

for (const row of uniqueStudents) {
  const norm = normalizeName(row.name);
  const existing = byNormName.get(norm);

  if (existing) {
    enrichExisting(existing, row);
    if (existing.type === "学生") {
      studentsSkippedSystem++;
    } else {
      studentsMergedObOg++;
    }
    continue;
  }

  const gradYear = row.gradYear || "";
  const gradTag = gradYear || "在学中";
  const gradNum = gradYear.replace(/卒.*$/, "").replace(/or.*$/, "").trim();

  const student = {
    id: nextId(),
    name: row.name,
    kana: "",
    type: "学生",
    status: "在学中",
    school: row.school,
    faculty: "",
    graduationYear: gradNum,
    company: "",
    department: "",
    position: "",
    industry: "",
    area: row.area,
    email: "",
    phone: "",
    facebookUrl: "",
    referrerName: "",
    referrerId: "",
    referrerRelation: "不明",
    referralRoute: "",
    referralConfirmed: "未確認",
    contactPermission: "未確認",
    priority: "未設定",
    recruitingPotential: "不明",
    studentSupportPotential: "不明",
    contactStatus: "未確認",
    recruitingStatus: "対象外",
    lastContactDate: "",
    nextActionDate: "",
    memo: "",
    tags: ["学生", gradTag].filter(Boolean),
    importSource: "知力会スプレッドシート（学生名簿）",
    dataCompleteness: 0,
    duplicateWarning: false,
    createdAt: now,
    updatedAt: now,
  };

  registerMember(student);
  studentsAdded++;
}

// Referrer resolution
const allNames = members.map((m) => m.name);
const nameToId = Object.fromEntries(members.map((m) => [m.name, m.id]));

for (const m of members) {
  if (m._referrerShort) {
    const fullName = resolveReferrerFullName(m._referrerShort, allNames);
    m.referrerName = fullName;
    m.referrerId = resolveReferrerId(m._referrerShort, nameToId, allNames);
    if (fullName) m.referralRoute = `${fullName} → ${m.name}`;
  }
  delete m._referrerShort;
}

const WEIGHTS = [
  ["name", 10],
  ["type", 8],
  ["referrerName", 10],
  ["email", 6],
  ["phone", 6],
  ["facebookUrl", 4],
  ["company", 8],
  ["school", 6],
  ["industry", 5],
  ["area", 5],
  ["priority", 5],
  ["recruitingPotential", 5],
];

function isFilled(value) {
  if (value == null) return false;
  const s = String(value).trim();
  if (!s || s === "不明" || s === "未設定") return false;
  return true;
}

function calcCompleteness(m) {
  let score = 0;
  let max = 0;
  for (const [key, weight] of WEIGHTS) {
    max += weight;
    if (isFilled(m[key])) score += weight;
  }
  return max > 0 ? Math.round((score / max) * 100) : 0;
}

const displayNameCount = {};
for (const m of members) {
  displayNameCount[m.name] = (displayNameCount[m.name] || 0) + 1;
}
for (const m of members) {
  m.dataCompleteness = calcCompleteness(m);
  m.duplicateWarning = displayNameCount[m.name] > 1;
}

const obCount = members.filter((m) => m.type === "OB").length;
const ogCount = members.filter((m) => m.type === "OG").length;
const studentCount = members.filter((m) => m.type === "学生").length;

const tasks = members
  .filter((m) => m.lastContactDate && m.referrerName)
  .slice(0, 12)
  .map((m, i) => ({
    id: `t-${String(i + 1).padStart(3, "0")}`,
    memberId: m.id,
    memberName: m.name,
    taskType: m.memo.includes("転職") ? "求人開拓の相談をする" : "紹介者に確認する",
    title: `${m.name}さんのフォロー`,
    dueDate: "2026-06-15",
    status: i % 3 === 0 ? "進行中" : "未着手",
    memo: (m.memo || "").slice(0, 80),
  }));

const dataDir = path.join(__dirname, "../src/data");
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(
  path.join(dataDir, "initial-members.json"),
  JSON.stringify(members),
  "utf-8"
);
fs.writeFileSync(
  path.join(dataDir, "initial-tasks.json"),
  JSON.stringify(tasks),
  "utf-8"
);

const out = `/* AUTO-GENERATED — roster.tsv + students/*.tsv */
import type { Member, Task } from "./types";
import membersJson from "@/data/initial-members.json";
import tasksJson from "@/data/initial-tasks.json";

export const initialMembers = membersJson as Member[];
export const initialTasks = tasksJson as Task[];
`;

fs.writeFileSync(path.join(__dirname, "../src/lib/mock-data.ts"), out, "utf-8");

console.log(`Total: ${members.length} (OB: ${obCount}, OG: ${ogCount}, 学生: ${studentCount})`);
console.log(`Student rows raw: ${rawStudentCount} → unique in rosters: ${uniqueStudents.length} (merged ${intraDeduped} intra-list dupes)`);
console.log(`Students newly added: ${studentsAdded}`);
console.log(`Skipped (already 学生 in system): ${studentsSkippedSystem}`);
console.log(`Merged into existing OB/OG (no double count): ${studentsMergedObOg}`);
