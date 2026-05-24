import { PackageOpen } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-secondary-bg/20 px-6 py-20 text-center backdrop-filter backdrop-blur-sm">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
        <PackageOpen className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-3 max-w-md text-base text-secondary-text leading-relaxed">{description}</p>
    </div>
  );
}
