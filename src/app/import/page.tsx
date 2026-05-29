"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, ArrowRight, Shield } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { CsvImportBox } from "@/components/import/CsvImportBox";
import { CsvPreviewTable } from "@/components/import/CsvPreviewTable";
import { FieldMappingTable } from "@/components/import/FieldMappingTable";
import { Stepper } from "@/components/ui/Stepper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/Button";
import { RECOMMENDED_CSV_COLUMNS } from "@/lib/types";
import type { MemberFieldKey } from "@/lib/types";
import {
  parseCsvFile,
  guessMapping,
  analyzeImport,
  rowToMember,
  normalizeType,
} from "@/lib/csv-import";
import { useMembers } from "@/context/MemberContext";
import type { Member } from "@/lib/types";

type Step = "upload" | "preview" | "mapping" | "confirm" | "done";

const STEPS = [
  { key: "upload", label: "ファイル選択" },
  { key: "preview", label: "プレビュー" },
  { key: "mapping", label: "マッピング" },
  { key: "confirm", label: "確認" },
  { key: "done", label: "完了" },
];

export default function ImportPage() {
  const router = useRouter();
  const { members, importMembers } = useMembers();
  const [step, setStep] = useState<Step>("upload");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<number, MemberFieldKey | "">>({});
  const [importedCount, setImportedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const preview = analyzeImport(
    rows,
    mapping,
    new Set(members.map((m) => m.email.toLowerCase()).filter(Boolean)),
    new Set(members.map((m) => m.name.trim()).filter(Boolean))
  );

  const handleFile = async (file: File) => {
    setError(null);
    try {
      const parsed = await parseCsvFile(file);
      setHeaders(parsed.headers);
      setRows(parsed.rows);
      setMapping(guessMapping(parsed.headers));
      setStep("preview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "読み込みに失敗しました");
    }
  };

  const handleImport = () => {
    const newMembers: Partial<Member>[] = rows.map((row) => {
      const rec = rowToMember(row, mapping);
      return {
        name: rec.name || "",
        kana: rec.kana || "",
        type: normalizeType(rec.type || ""),
        school: rec.school || "",
        faculty: rec.faculty || "",
        graduationYear: rec.graduationYear || "",
        company: rec.company || "",
        department: rec.department || "",
        position: rec.position || "",
        industry: rec.industry || "",
        area: rec.area || "",
        email: rec.email || "",
        phone: rec.phone || "",
        facebookUrl: rec.facebookUrl || "",
        referrerName: rec.referrerName || "",
        referrerRelation: (rec.referrerRelation as Member["referrerRelation"]) || "不明",
        memo: rec.memo || "",
        importSource: "知力会名簿CSV",
        referralConfirmed: "未確認",
        contactStatus: "未確認",
        recruitingStatus: "未着手",
        priority: "未設定",
        recruitingPotential: "不明",
        studentSupportPotential: "不明",
      };
    });
    setImportedCount(importMembers(newMembers));
    setStep("done");
  };

  return (
    <Layout>
      <Header
        title="知力会名簿CSVの取り込み"
        description="知力会側で管理しているスプレッドシートをCSV形式で取り込み、メンバー情報を整理できます。"
        breadcrumb={[
          { label: "ダッシュボード", href: "/" },
          { label: "CSV取り込み" },
        ]}
      />

      <Stepper steps={STEPS} currentKey={step} />

      <Card padding="md" className="mb-8 border-teal-100/80 bg-gradient-to-r from-teal-50/40 to-white">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
            <Shield className="h-5 w-5" />
          </div>
          <div className="text-sm text-slate-700 leading-relaxed">
            <p className="font-semibold text-supira-primary">個人情報・利用目的について</p>
            <p className="mt-1 text-supira-muted">
              取り込む情報は、利用目的が確認できている名簿データを前提としています。連絡前には必要に応じて紹介者確認を行ってください。
            </p>
          </div>
        </div>
      </Card>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {step === "upload" && (
        <div className="space-y-8 page-enter">
          <CsvImportBox onFileSelect={handleFile} />
          <section>
            <h2 className="mb-3 text-sm font-semibold text-supira-primary">推奨CSV項目</h2>
            <div className="flex flex-wrap gap-2">
              {RECOMMENDED_CSV_COLUMNS.map((col) => (
                <span
                  key={col}
                  className="rounded-lg border border-supira-border/80 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
                >
                  {col}
                </span>
              ))}
            </div>
          </section>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-6 page-enter">
          <Card padding="md">
            <h2 className="mb-4 text-sm font-semibold text-supira-primary">プレビュー</h2>
            <CsvPreviewTable headers={headers} rows={rows} />
            <p className="mt-3 text-sm text-supira-muted">
              全 <span className="font-bold text-supira-accent">{rows.length}</span> 件
            </p>
          </Card>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" icon={ArrowRight} iconPosition="right" onClick={() => setStep("mapping")}>
              項目マッピングへ
            </Button>
            <Button variant="secondary" onClick={() => setStep("upload")}>
              ファイルを選び直す
            </Button>
          </div>
        </div>
      )}

      {step === "mapping" && (
        <div className="space-y-6 page-enter">
          <Card padding="md">
            <FieldMappingTable
              headers={headers}
              mapping={mapping}
              onMappingChange={(col, field) =>
                setMapping((prev) => ({ ...prev, [col]: field }))
              }
            />
          </Card>
          <Button variant="primary" icon={ArrowRight} iconPosition="right" onClick={() => setStep("confirm")}>
            取り込み内容を確認
          </Button>
        </div>
      )}

      {step === "confirm" && (
        <div className="space-y-6 page-enter">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ConfirmStat label="取り込み件数" value={preview.total} />
            <ConfirmStat label="氏名なし" value={preview.missingName} warn={preview.missingName > 0} />
            <ConfirmStat label="紹介者なし" value={preview.missingReferrer} warn={preview.missingReferrer > 0} />
            <ConfirmStat label="連絡先なし" value={preview.missingContact} warn={preview.missingContact > 0} />
          </div>

          {preview.possibleDuplicates > 0 && (
            <div className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
              <p className="text-sm text-amber-900">
                重複候補が {preview.possibleDuplicates} 件あります。取り込み後に重複チェックをご確認ください。
              </p>
            </div>
          )}

          <Card padding="md">
            <CsvPreviewTable headers={headers} rows={rows} maxRows={3} />
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button variant="accent" onClick={handleImport}>
              インポートを実行（{preview.total}件）
            </Button>
            <Button variant="secondary" onClick={() => setStep("mapping")}>
              マッピングに戻る
            </Button>
          </div>
        </div>
      )}

      {step === "done" && (
        <Card padding="lg" className="text-center page-enter">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-supira-primary">取り込みが完了しました</h2>
          <p className="mt-2 text-supira-muted">
            {importedCount} 件のメンバー情報を整理しました
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="primary" onClick={() => router.push("/members")}>
              メンバー一覧
            </Button>
            <ButtonLink href="/incomplete" variant="secondary">
              情報不足を確認
            </ButtonLink>
            <ButtonLink href="/duplicates" variant="secondary">
              重複チェック
            </ButtonLink>
          </div>
        </Card>
      )}
    </Layout>
  );
}

function ConfirmStat({
  label,
  value,
  warn,
}: {
  label: string;
  value: number;
  warn?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-card ${
        warn ? "border-amber-200 bg-amber-50/50" : "border-supira-border/80 bg-white"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-supira-muted">{label}</p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${warn ? "text-amber-800" : "text-supira-primary"}`}>
        {value}
      </p>
    </div>
  );
}
