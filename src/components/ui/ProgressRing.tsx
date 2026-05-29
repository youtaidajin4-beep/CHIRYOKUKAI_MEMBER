interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  light?: boolean;
}

export function ProgressRing({
  value,
  size = 56,
  strokeWidth = 4,
  light = false,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const color =
    value >= 70 ? "#0d9488" : value >= 40 ? "#d97706" : "#ea580c";

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={light ? "rgba(255,255,255,0.25)" : "#e2e8f0"}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${light ? "text-white" : "text-supira-primary"}`}
      >
        {value}%
      </span>
    </div>
  );
}
