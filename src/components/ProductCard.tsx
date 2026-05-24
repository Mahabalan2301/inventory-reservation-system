"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { productImages } from "@/lib/productImages";
import { WarehouseStock } from "@/components/WarehouseStock";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";
import type { Product, WarehouseStock as WarehouseStockType } from "@/types";

type ProductCardProps = {
  product: Product;
  index: number;
  onReserved?: () => void;
};

export function ProductCard({ product, index, onReserved }: ProductCardProps) {
  const router = useRouter();
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<WarehouseStockType | null>(product.warehouses[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const maxQty = selectedWarehouse?.availableStock ?? 0;
  const totalStock = selectedWarehouse?.totalStock ?? 0;
  const stockPercentage = totalStock > 0 ? (maxQty / totalStock) * 100 : 0;

  const handleReserve = async () => {
    if (!selectedWarehouse) {
      toast.error("Select a warehouse");
      return;
    }

    if (quantity < 1 || quantity > maxQty) {
      toast.error("Invalid quantity for available stock");
      return;
    }

    setLoading(true);
    try {
      const { reservation } = await api.createReservation({
        productId: product.id,
        warehouseId: selectedWarehouse.warehouseId,
        quantity,
      });

      toast.success("Reservation created", {
        description: "Redirecting to checkout…",
      });

      onReserved?.();
      router.push(`/checkout/${reservation.id}`);
    } catch (err) {
      const error = err as Error & { status?: number };
      if (error.status === 409) {
        toast.error("Not enough stock available");
      } else if (error.status === 404) {
        toast.error("Inventory not found");
      } else {
        toast.error(error.message || "Failed to create reservation");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStockBadgeColor = () => {
    if (maxQty === 0) return "badge-muted";
    if (stockPercentage > 50) return "badge-success";
    if (stockPercentage > 20) return "badge-warning";
    return "badge-muted";
  };

  const getStockLabel = () => {
    if (maxQty === 0) return "Out of Stock";
    if (stockPercentage > 50) return "In Stock";
    return "Low Stock";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Card className="card-interactive overflow-hidden flex flex-col h-full">
        {/* Product Image */}
        <div className="relative h-40 md:h-56 w-full overflow-hidden bg-gradient-to-br from-primary-dark/30 via-primary/20 to-accent/10">
          <Image
            src={
              productImages[product.name]
              ??
              "/placeholder.jpg"
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-card-highlight pointer-events-none" />
          
          {/* Stock Badge */}
          <div className={`absolute top-4 left-4 badge-pill ${getStockBadgeColor()}`}>
            {getStockLabel()}
          </div>
        </div>

        <CardContent className="flex flex-col flex-1 p-4 md:p-8">
          {/* Product Info */}
          <div className="mb-4 md:mb-6">
            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-2 line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <span className="label-text text-xs md:text-sm text-secondary-text">{product.sku}</span>
              <span className="text-lg md:text-2xl font-bold text-primary">
                Rs. {product.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Warehouses Section */}
          <div className="mb-4 md:mb-6 flex-1">
            <p className="label-text text-xs md:text-sm text-secondary-text mb-2 md:mb-3">
              Select Warehouse
            </p>
            {product.warehouses.length === 0 ? (
              <p className="text-xs md:text-sm text-secondary-text">No warehouse stock</p>
            ) : (
              <div className="space-y-2">
                {product.warehouses.map((wh) => (
                  <button
                    key={wh.warehouseId}
                    type="button"
                    onClick={() => {
                      setSelectedWarehouse(wh);
                      setQuantity(1);
                    }}
                    className={`w-full transition-all duration-200 p-2 md:p-4 rounded-xl border text-left ${
                      selectedWarehouse?.warehouseId === wh.warehouseId
                        ? "border-primary/60 bg-primary/10"
                        : "border-border hover:border-primary/40 bg-secondary-bg/30 hover:bg-primary/5"
                    }`}
                  >
                    <WarehouseStock stock={wh} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-4 md:mb-6">
            <p className="label-text text-xs md:text-sm text-secondary-text mb-2 md:mb-3">
              Quantity
            </p>
            <div className="flex items-center gap-2 md:gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 md:h-10 md:w-10"
                disabled={quantity <= 1 || loading}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <Input
                type="number"
                min={1}
                max={maxQty || 1}
                value={quantity}
                disabled={loading || maxQty === 0}
                onChange={(e) => {
                  const val = Number.parseInt(e.target.value, 10);
                  if (!Number.isNaN(val)) {
                    setQuantity(Math.min(Math.max(1, val), maxQty || 1));
                  }
                }}
                className="text-center flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 md:h-10 md:w-10"
                disabled={quantity >= maxQty || loading || maxQty === 0}
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              >
                <Plus className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>

          {/* Reserve Button */}
          <Button
            size="lg"
            className="w-full premium-shadow text-sm md:text-base h-9 md:h-11"
            disabled={loading || maxQty === 0 || !selectedWarehouse}
            onClick={handleReserve}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                Reserving...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                Reserve Now
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
