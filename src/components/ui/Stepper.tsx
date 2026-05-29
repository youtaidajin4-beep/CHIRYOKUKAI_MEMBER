import clsx from "clsx";
import { Check } from "lucide-react";

interface Step {
  key: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentKey: string;
}

export function Stepper({ steps, currentKey }: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentKey);

  return (
    <nav aria-label="進捗" className="mb-10">
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {steps.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li
              key={step.key}
              className={clsx(
                "flex flex-1 items-center gap-3",
                i < steps.length - 1 && "sm:pr-2"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={clsx(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    done && "bg-supira-accent text-white",
                    active && "bg-supira-primary text-white ring-4 ring-teal-100",
                    !done && !active && "bg-supira-surface text-supira-subtle border border-supira-border"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={clsx(
                    "text-sm font-medium truncate",
                    active ? "text-supira-primary" : done ? "text-supira-muted" : "text-supira-subtle"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={clsx(
                    "hidden sm:block h-0.5 flex-1 mx-2 rounded-full",
                    done ? "bg-supira-accent" : "bg-supira-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
