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
  available: "bg-gradient-to-r from-success to-accent",
  low: "bg-gradient-to-r from-warning to-primary",
  out: "bg-gradient-to-r from-error to-warning",
} as const;

export function WarehouseStock({ stock }: WarehouseStockProps) {
  const level = getStockLevel(stock.availableStock, stock.totalStock);
  const fill =
    stock.totalStock > 0
      ? Math.round((stock.availableStock / stock.totalStock) * 100)
      : 0;

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary-bg/40 to-transparent p-3 md:p-5 transition-all hover:bg-secondary-bg/60 hover:border-primary/30">
      <div className="mb-3 md:mb-4 flex items-start justify-between gap-2 md:gap-3 flex-col md:flex-row">
        <div className="flex items-center gap-2 md:gap-3 flex-1">
          <div className="flex h-8 md:h-10 w-8 md:w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary flex-shrink-0">
            <Warehouse className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs md:text-sm font-bold text-foreground">{stock.warehouseName}</p>
            <p className="text-xs text-secondary-text">{stock.location}</p>
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
          className="text-xs md:text-sm"
        >
          {level === "available"
            ? "In stock"
            : level === "low"
              ? "Low stock"
              : "Out of stock"}
        </Badge>
      </div>

      <div className="mb-3 md:mb-4 h-2 md:h-2.5 overflow-hidden rounded-full bg-border/50">
        <div
          className={cn("h-full rounded-full transition-all duration-300 shadow-lg", levelStyles[level])}
          style={{ width: `${fill}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-1.5 md:gap-2 text-xs">
        <Badge variant="success" className="text-xs">Available: {stock.availableStock.toLocaleString()}</Badge>
        <Badge variant="warning" className="text-xs">Reserved: {stock.reservedStock.toLocaleString()}</Badge>
        <Badge variant="secondary" className="text-xs">Total: {stock.totalStock.toLocaleString()}</Badge>
      </div>
    </div>
  );
}
