"use client";

import { Upload, FileSpreadsheet } from "lucide-react";
import { useRef, useState } from "react";
import clsx from "clsx";

interface CsvImportBoxProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function CsvImportBox({ onFileSelect, disabled }: CsvImportBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-200",
        dragOver
          ? "border-supira-accent bg-teal-50/50 scale-[1.01] shadow-glow"
          : "border-supira-border-strong bg-gradient-to-b from-white to-supira-surface/50 hover:border-teal-300 hover:bg-teal-50/20",
        disabled && "opacity-50 pointer-events-none"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file?.name.endsWith(".csv")) onFileSelect(file);
      }}
    >
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
        {dragOver ? (
          <Upload className="h-8 w-8 animate-bounce" />
        ) : (
          <FileSpreadsheet className="h-8 w-8" />
        )}
      </div>
      <p className="text-base font-semibold text-supira-primary">
        知力会名簿CSVをここにドロップ
      </p>
      <p className="mt-2 text-sm text-supira-muted">
        スプレッドシートからエクスポートした .csv ファイル（UTF-8推奨）
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="mt-6 rounded-xl bg-supira-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-supira-navy active:scale-[0.98] focus-ring"
      >
        ファイルを選択
      </button>
    </div>
  );
}
