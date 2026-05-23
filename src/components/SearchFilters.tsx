"use client";

import { Search } from "lucide-react";
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
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="relative flex-1 sm:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search product..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2 sm:gap-3">
        <select
          value={selectedWarehouse}
          onChange={(e) => onWarehouseChange(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="all">All Items</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
        </select>
      </div>
    </div>
  );
}
