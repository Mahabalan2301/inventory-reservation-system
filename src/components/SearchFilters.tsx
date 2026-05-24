"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchFiltersProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedWarehouse: string | "all";
  onWarehouseChange: (warehouse: string) => void;
  stockFilter: string;
  onStockFilterChange: (filter: string) => void;
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
    <div className="mb-6 md:mb-8 flex flex-col gap-3 md:gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative flex-1 lg:max-w-xl">
        <Search className="absolute left-3 md:left-4 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 md:pl-12 bg-secondary-bg/50 border-border hover:border-primary/30 focus:border-primary placeholder-secondary-text text-foreground rounded-2xl h-9 md:h-11 text-sm md:text-base"
        />
      </div>

      <div className="flex gap-2 md:gap-3 items-center flex-wrap">
        <Filter className="h-4 w-4 md:h-5 md:w-5 text-secondary-text hidden lg:block" />
        <select
          value={selectedWarehouse}
          onChange={(e) => onWarehouseChange(e.target.value)}
          className="rounded-2xl border border-border bg-secondary-bg/50 px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm text-foreground ring-offset-background transition-all duration-200 hover:border-primary/30 hover:bg-secondary-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer font-medium"
        >
          <option value="all">All Warehouses</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse} value={warehouse}>
              {warehouse}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => onStockFilterChange(e.target.value)}
          className="rounded-2xl border border-border bg-secondary-bg/50 px-3 md:px-4 py-1.5 md:py-2.5 text-xs md:text-sm text-foreground ring-offset-background transition-all duration-200 hover:border-primary/30 hover:bg-secondary-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer font-medium"
        >
          <option value="all">All Items</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
        </select>
      </div>
    </div>
  );
}
