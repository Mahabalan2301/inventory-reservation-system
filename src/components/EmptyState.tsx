import { PackageOpen } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary-bg px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <PackageOpen className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
