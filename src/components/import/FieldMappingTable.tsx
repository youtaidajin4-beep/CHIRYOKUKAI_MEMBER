"use client";

import { MEMBER_FIELD_LABELS, type MemberFieldKey } from "@/lib/types";

const MAPPABLE_FIELDS: (MemberFieldKey | "")[] = [
  "",
  "name",
  "kana",
  "type",
  "school",
  "faculty",
  "graduationYear",
  "company",
  "department",
  "position",
  "industry",
  "area",
  "email",
  "phone",
  "facebookUrl",
  "referrerName",
  "referrerRelation",
  "memo",
];

interface FieldMappingTableProps {
  headers: string[];
  mapping: Record<number, MemberFieldKey | "">;
  onMappingChange: (colIndex: number, field: MemberFieldKey | "") => void;
}

export function FieldMappingTable({
  headers,
  mapping,
  onMappingChange,
}: FieldMappingTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-supira-border">
      <table className="min-w-full text-sm">
        <thead className="bg-supira-surface">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-supira-muted">
              CSVの列名
            </th>
            <th className="px-4 py-3 text-left font-medium text-supira-muted">
              取り込み先
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-supira-border">
          {headers.map((header, i) => (
            <tr key={i}>
              <td className="px-4 py-3 font-medium text-slate-700">
                {header || `列 ${i + 1}`}
              </td>
              <td className="px-4 py-3">
                <select
                  value={mapping[i] || ""}
                  onChange={(e) =>
                    onMappingChange(i, e.target.value as MemberFieldKey | "")
                  }
                  className="w-full max-w-xs rounded-lg border border-supira-border px-3 py-2 text-sm"
                >
                  <option value="">— 取り込まない —</option>
                  {MAPPABLE_FIELDS.filter(Boolean).map((f) => (
                    <option key={f} value={f}>
                      {MEMBER_FIELD_LABELS[f as MemberFieldKey]}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
