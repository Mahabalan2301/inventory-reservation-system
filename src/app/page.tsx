"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorAlert } from "@/components/ErrorAlert";
import { ProductsGridSkeleton } from "@/components/LoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import { InventorySummary } from "@/components/InventorySummary";
import { SearchFilters } from "@/components/SearchFilters";
import { useProducts } from "@/hooks/useProducts";
import { useReservations } from "@/hooks/useReservations";

export default function HomePage() {
  const { products, error, isLoading, isValidating, mutate } = useProducts();
  const { activeReservations } = useReservations();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | "all">(
    "all"
  );
  const [stockFilter, setStockFilter] = useState("all");

  // Extract unique warehouse names
  const warehouses = useMemo(
    () =>
      Array.from(
        new Set(products.flatMap((p) => p.warehouses.map((w) => w.warehouseName)))
      ),
    [products]
  );

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Warehouse filter
      if (selectedWarehouse !== "all") {
        const hasWarehouse = product.warehouses.some(
          (w) => w.warehouseName === selectedWarehouse
        );
        if (!hasWarehouse) return false;
      }

      // Stock filter
      if (stockFilter !== "all") {
        const hasStockMatch = product.warehouses.some((w) => {
          if (stockFilter === "in-stock") {
            return w.availableStock > 0;
          }
          if (stockFilter === "low-stock") {
            return w.totalStock > 0 && w.availableStock / w.totalStock <= 0.25;
          }
          return true;
        });
        if (!hasStockMatch) return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedWarehouse, stockFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-hero mb-10 mt-6 overflow-hidden rounded-3xl border border-border p-8 sm:p-12"
        >
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="mr-1 h-3 w-3" />
            Enterprise-grade inventory
          </Badge>
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Real-time Multi-Warehouse Inventory
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Reserve products safely with concurrency protection across every
            warehouse location.
          </p>
        </motion.section>

        {!isLoading && !error && products.length > 0 && (
          <InventorySummary
            products={products}
            activeReservations={activeReservations}
          />
        )}

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Product catalog</h2>
            <p className="text-sm text-muted-foreground">
              Live stock refreshes every 10 seconds
            </p>
          </div>
          {isValidating && !isLoading && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Updating…
            </span>
          )}
        </div>

        {!isLoading && !error && products.length > 0 && (
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedWarehouse={selectedWarehouse}
            onWarehouseChange={setSelectedWarehouse}
            stockFilter={stockFilter}
            onStockFilterChange={setStockFilter}
            warehouses={warehouses}
          />
        )}

        {isLoading && <ProductsGridSkeleton />}

        {error && !isLoading && (
          <ErrorAlert
            message={
              error instanceof Error
                ? error.message
                : "Failed to load products"
            }
          />
        )}

        {!isLoading && !error && products.length === 0 && (
          <EmptyState
            title="No products yet"
            description="Seed your database or add products to see the catalog."
          />
        )}

        {!isLoading && !error && products.length > 0 && filteredProducts.length === 0 && (
          <EmptyState
            title="No products match your filters"
            description="Try adjusting your search or filters."
          />
        )}

        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onReserved={() => mutate()}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
