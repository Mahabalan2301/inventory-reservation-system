"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Shield } from "lucide-react";
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
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="hero-banner mb-8 overflow-hidden rounded-lg p-6 md:mb-10 md:p-10"
        >
          <Badge variant="default" className="mb-4">
            <Shield className="mr-1.5 h-3.5 w-3.5" />
            Enterprise inventory
          </Badge>
          <h1 className="mb-3 max-w-2xl text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
            Reserve inventory across warehouses
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Real-time stock reservations with concurrency protection. Prevent
            overselling across all warehouse locations.
          </p>
        </motion.section>

        {!isLoading && !error && products.length > 0 && (
          <InventorySummary
            products={products}
            activeReservations={activeReservations}
          />
        )}

        <div className="mb-6 mt-8 md:mb-8 md:mt-10">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground md:text-2xl">
                Products
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage and reserve inventory across all warehouses
              </p>
            </div>
            {isValidating && !isLoading && (
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
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
