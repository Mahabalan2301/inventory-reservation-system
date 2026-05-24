"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorAlert } from "@/components/ErrorAlert";
import { ProductsGridSkeleton } from "@/components/LoadingSkeleton";
import { SearchFilters } from "@/components/SearchFilters";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsPage() {
  const { products, error, isLoading, isValidating, mutate } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | "all">(
    "all",
  );
  const [stockFilter, setStockFilter] = useState("all");

  const warehouses = useMemo(
    () =>
      Array.from(
        new Set(
          products.flatMap((p) => p.warehouses.map((w) => w.warehouseName)),
        ),
      ),
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (selectedWarehouse !== "all") {
        const hasWarehouse = product.warehouses.some(
          (w) => w.warehouseName === selectedWarehouse,
        );
        if (!hasWarehouse) return false;
      }

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
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 md:mb-10"
        >
          <h1 className="mb-2 text-2xl font-semibold text-foreground md:text-3xl">
            Products
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Manage and reserve inventory across all warehouses
          </p>
        </motion.div>

        <div className="mb-6">
          {isValidating && !isLoading && (
            <span className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Updating…
            </span>
          )}

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
        </div>

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

        {!isLoading &&
          !error &&
          products.length > 0 &&
          filteredProducts.length === 0 && (
            <EmptyState
              title="No products match your filters"
              description="Try adjusting your search or filters."
            />
          )}

        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
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
