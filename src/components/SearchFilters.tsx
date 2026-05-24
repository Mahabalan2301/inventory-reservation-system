"use client";

import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchFiltersProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedWarehouse: string | "all";
  onWarehouseChange: (value: string | "all") => void;
  stockFilter: string;
  onStockFilterChange: (value: string) => void;
  warehouses: string[];
};

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedWarehouse,
  onWarehouseChange,
  stockFilter,
  onStockFilterChange,
  warehouses,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-secondary-bg p-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or SKU…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="hidden h-4 w-4 text-muted-foreground lg:block" />
        <select
          value={selectedWarehouse}
          onChange={(e) => onWarehouseChange(e.target.value)}
          className="h-10 cursor-pointer rounded-md border border-border bg-background px-3 text-sm text-foreground transition-colors hover:bg-secondary-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All warehouses</option>
          {warehouses.map((wh) => (
            <option key={wh} value={wh}>
              {wh}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => onStockFilterChange(e.target.value)}
          className="h-10 cursor-pointer rounded-md border border-border bg-background px-3 text-sm text-foreground transition-colors hover:bg-secondary-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All stock levels</option>
          <option value="in-stock">In stock</option>
          <option value="low-stock">Low stock</option>
        </select>
      </div>
    </div>
  );
}
