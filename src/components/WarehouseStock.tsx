"use client";

import { Warehouse } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStockLevel } from "@/services/api";
import type { WarehouseStock as WarehouseStockType } from "@/types";
import { cn } from "@/lib/utils";

type WarehouseStockProps = {
  stock: WarehouseStockType;
  compact?: boolean;
};

const levelStyles = {
  available: "bg-success",
  low: "bg-warning",
  out: "bg-muted-foreground/40",
} as const;

export function WarehouseStock({ stock, compact }: WarehouseStockProps) {
  const level = getStockLevel(stock.availableStock, stock.totalStock);
  const fill =
    stock.totalStock > 0
      ? Math.round((stock.availableStock / stock.totalStock) * 100)
      : 0;

  return (
    <div className={cn(!compact && "rounded-md border border-border bg-secondary-bg/30 p-3 md:p-4")}>
      <div
        className={cn(
          "flex items-start justify-between gap-2",
          compact ? "mb-2" : "mb-3 md:mb-4",
        )}
      >
        <div className="flex flex-1 items-center gap-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-secondary-bg text-muted-foreground">
            <Warehouse className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {stock.warehouseName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {stock.location}
            </p>
          </div>
        </div>
        <Badge
          variant={
            level === "available"
              ? "success"
              : level === "low"
                ? "warning"
                : "error"
          }
          className="flex-shrink-0 text-xs"
        >
          {level === "available"
            ? "In stock"
            : level === "low"
              ? "Low"
              : "Out"}
        </Badge>
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-full bg-border",
          compact ? "mb-2 h-1.5" : "mb-3 h-2",
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            levelStyles[level],
          )}
          style={{ width: `${fill}%` }}
        />
      </div>

      {!compact && (
        <div className="flex flex-wrap gap-1.5 text-xs">
          <Badge variant="secondary" className="text-xs">
            Available: {stock.availableStock.toLocaleString()}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Reserved: {stock.reservedStock.toLocaleString()}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Total: {stock.totalStock.toLocaleString()}
          </Badge>
        </div>
      )}
    </div>
  );
}
