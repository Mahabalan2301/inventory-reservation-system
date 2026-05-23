"use client";

import { Warehouse } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStockLevel } from "@/services/api";
import type { WarehouseStock as WarehouseStockType } from "@/types";
import { cn } from "@/lib/utils";

type WarehouseStockProps = {
  stock: WarehouseStockType;
};

const levelStyles = {
  available: "bg-success",
  low: "bg-warning",
  out: "bg-error",
} as const;

export function WarehouseStock({ stock }: WarehouseStockProps) {
  const level = getStockLevel(stock.availableStock, stock.totalStock);
  const fill =
    stock.totalStock > 0
      ? Math.round((stock.availableStock / stock.totalStock) * 100)
      : 0;

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4 transition-colors hover:bg-muted/60">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Warehouse className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">{stock.warehouseName}</p>
            <p className="text-xs text-muted-foreground">{stock.location}</p>
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
        >
          {level === "available"
            ? "In stock"
            : level === "low"
              ? "Low stock"
              : "Out of stock"}
        </Badge>
      </div>

      <div className="mb-3 h-2 overflow-hidden rounded-full bg-border">
        <div
          className={cn("h-full rounded-full transition-all", levelStyles[level])}
          style={{ width: `${fill}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <Badge variant="success">Available: {stock.availableStock}</Badge>
        <Badge variant="warning">Reserved: {stock.reservedStock}</Badge>
        <Badge variant="secondary">Total: {stock.totalStock}</Badge>
      </div>
    </div>
  );
}
