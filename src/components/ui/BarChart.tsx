interface BarChartItem {
  label: string;
  value: number;
}

interface BarChartProps {
  items: BarChartItem[];
  maxItems?: number;
  color?: string;
}

export function BarChart({
  items,
  maxItems = 8,
  color = "bg-supira-accent",
}: BarChartProps) {
  const sorted = [...items].sort((a, b) => b.value - a.value).slice(0, maxItems);
  const max = Math.max(...sorted.map((i) => i.value), 1);

  if (sorted.length === 0) {
    return <p className="py-6 text-center text-sm text-supira-muted">データがありません</p>;
  }

  return (
    <ul className="space-y-3">
      {sorted.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="truncate text-slate-700 pr-2">{item.label}</span>
            <span className="shrink-0 font-semibold tabular-nums text-supira-primary">
              {item.value}
              <span className="ml-0.5 text-xs font-normal text-supira-muted">名</span>
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-supira-surface">
            <div
              className={`h-full rounded-full ${color} transition-all duration-500`}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
