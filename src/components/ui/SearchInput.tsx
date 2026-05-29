import { Search } from "lucide-react";
import clsx from "clsx";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder,
  value,
  onChange,
  className = "",
}: SearchInputProps) {
  return (
    <div className={clsx("relative", className)}>
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-supira-subtle pointer-events-none" />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-supira-border bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition placeholder:text-supira-subtle focus:border-supira-accent/50 focus:shadow-glow focus:outline-none"
      />
    </div>
  );
}
