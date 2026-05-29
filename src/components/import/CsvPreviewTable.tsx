interface CsvPreviewTableProps {
  headers: string[];
  rows: string[][];
  maxRows?: number;
}

export function CsvPreviewTable({
  headers,
  rows,
  maxRows = 5,
}: CsvPreviewTableProps) {
  const preview = rows.slice(0, maxRows);

  return (
    <div className="overflow-hidden rounded-xl border border-supira-border/80">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-supira-border bg-supira-surface/90">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-supira-muted"
                >
                  {h || `列${i + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-supira-border/60 bg-white">
            {preview.map((row, ri) => (
              <tr key={ri} className="hover:bg-teal-50/30">
                {headers.map((_, ci) => (
                  <td key={ci} className="whitespace-nowrap px-4 py-2.5 text-slate-600">
                    {row[ci] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > maxRows && (
        <p className="border-t border-supira-border/60 bg-supira-surface/50 px-4 py-2.5 text-xs text-supira-muted">
          他 {rows.length - maxRows} 件…
        </p>
      )}
    </div>
  );
}
