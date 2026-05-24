import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-200 gap-1.5",
  {
    variants: {
      variant: {
        default: "border-primary/40 bg-primary/20 text-primary",
        secondary: "border-border bg-secondary-bg/50 text-muted-foreground",
        success:
          "border-success/40 bg-success/15 text-success",
        warning:
          "border-warning/40 bg-warning/15 text-warning",
        error: "border-error/40 bg-error/15 text-error",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
