import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card padding="lg" className="text-center">
      {Icon && (
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-supira-surface">
          <Icon className="h-8 w-8 text-supira-subtle" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-supira-primary">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm text-supira-muted leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-8 flex justify-center">{action}</div>}
    </Card>
  );
}
