import Papa from "papaparse";
import { CSV_COLUMN_ALIASES, type MemberFieldKey } from "./types";
import type { MemberType } from "./types";

export interface ParsedCsv {
  headers: string[];
  rows: string[][];
}

export function parseCsvFile(file: File): Promise<ParsedCsv> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      encoding: "UTF-8",
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data as string[][];
        if (!data.length) {
          reject(new Error("CSVが空です"));
          return;
        }
        const [headers, ...rows] = data;
        resolve({
          headers: headers.map((h) => String(h).trim()),
          rows: rows.map((r) => r.map((c) => String(c ?? "").trim())),
        });
      },
      error: (err) => reject(err),
    });
  });
}

export function guessMapping(headers: string[]): Record<number, MemberFieldKey | ""> {
  const mapping: Record<number, MemberFieldKey | ""> = {};
  headers.forEach((h, i) => {
    const key = CSV_COLUMN_ALIASES[h.trim()] || CSV_COLUMN_ALIASES[h.replace(/\s/g, "")];
    mapping[i] = key || "";
  });
  return mapping;
}

export function rowToMember(
  row: string[],
  mapping: Record<number, MemberFieldKey | "">
): Record<string, string> {
  const record: Record<string, string> = {};
  Object.entries(mapping).forEach(([colIndex, field]) => {
    if (!field) return;
    const val = row[Number(colIndex)]?.trim() || "";
    if (val) record[field] = val;
  });
  return record;
}

const VALID_TYPES: MemberType[] = [
  "学生",
  "OB",
  "OG",
  "社会人",
  "企業関係者",
  "不明",
];

export function normalizeType(raw: string): MemberType {
  const t = raw.trim();
  if (VALID_TYPES.includes(t as MemberType)) return t as MemberType;
  if (t.includes("学生")) return "学生";
  if (t === "OB" || t.includes("OB")) return "OB";
  if (t === "OG" || t.includes("OG")) return "OG";
  if (t.includes("企業")) return "企業関係者";
  if (t.includes("社会")) return "社会人";
  return "不明";
}

export interface ImportPreview {
  total: number;
  missingName: number;
  missingReferrer: number;
  missingLodge: number;
  missingContact: number;
  possibleDuplicates: number;
}

export function analyzeImport(
  rows: string[][],
  mapping: Record<number, MemberFieldKey | "">,
  existingEmails: Set<string>,
  existingNames: Set<string>
): ImportPreview {
  let missingName = 0;
  let missingReferrer = 0;
  let missingLodge = 0;
  let missingContact = 0;
  let possibleDuplicates = 0;

  const nameFieldIndex = Object.entries(mapping).find(([, f]) => f === "name")?.[0];

  rows.forEach((row) => {
    const rec = rowToMember(row, mapping);
    if (!rec.name?.trim()) missingName++;
    if (!rec.referrerName?.trim()) missingReferrer++;
    if (!rec.lodgeOwnerName?.trim()) missingLodge++;
    if (!rec.email?.trim() && !rec.phone?.trim() && !rec.facebookUrl?.trim())
      missingContact++;

    const email = rec.email?.toLowerCase();
    const name = rec.name?.trim();
    if ((email && existingEmails.has(email)) || (name && existingNames.has(name))) {
      possibleDuplicates++;
    }
  });

  if (!nameFieldIndex && rows.length > 0) {
    missingName = rows.length;
  }

  return {
    total: rows.length,
    missingName,
    missingReferrer,
    missingLodge,
    missingContact,
    possibleDuplicates,
  };
}
