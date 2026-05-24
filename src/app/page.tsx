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

      <main className="px-4 md:px-6 py-6 md:py-8 max-w-7xl">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12 overflow-hidden rounded-[36px] border border-border gradient-hero p-6 md:p-12 lg:p-16 relative"
        >
          <div className="relative z-10">
            <Badge className="mb-4 md:mb-6 bg-primary/20 border border-primary/40 text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Enterprise-grade inventory
            </Badge>
            <h1 className="max-w-3xl text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-3 md:mb-4">
              Reserve inventory across warehouses
            </h1>
            <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
              Prevent overselling with real-time stock reservations. Protect your warehouse operations with concurrency protection across all locations.
            </p>
          </div>
        </motion.section>

        {/* Stats Section */}
        {!isLoading && !error && products.length > 0 && (
          <InventorySummary
            products={products}
            activeReservations={activeReservations}
          />
        )}

        {/* Products Section Header */}
        <div className="mb-6 md:mb-8 mt-8 md:mt-12">
          <div className="flex items-center justify-between gap-4 mb-6 flex-col md:flex-row">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Products</h2>
              <p className="text-sm md:text-base text-secondary-text mt-1 md:mt-2">
                Manage and reserve inventory across all warehouses
              </p>
            </div>
            {isValidating && !isLoading && (
              <span className="flex items-center gap-2 text-sm text-primary">
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

        {/* Content */}
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
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-16">
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
