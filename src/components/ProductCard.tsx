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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card className="card-interactive flex h-full flex-col overflow-hidden">
        <div className="relative h-40 w-full overflow-hidden bg-secondary-bg md:h-48">
          <Image
            src={productImages[product.name] ?? "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3d2f5c]/20 to-transparent" />
          <div
            className={`absolute left-3 top-3 badge-pill ${getStockBadgeColor()}`}
          >
            {getStockLabel()}
          </div>
        </div>

        <CardContent className="flex flex-1 flex-col p-4 md:p-5">
          <div className="mb-4">
            <h3 className="mb-1 line-clamp-2 text-base font-semibold text-foreground md:text-lg">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                {product.sku}
              </span>
              <span className="text-base font-semibold text-foreground md:text-lg">
                Rs. {product.price.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mb-4 flex-1">
            <p className="label-text mb-2">Warehouse</p>
            {product.warehouses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No warehouse stock</p>
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
                    className={`w-full rounded-md border p-2 text-left transition-colors md:p-3 ${
                      selectedWarehouse?.warehouseId === wh.warehouseId
                        ? "border-primary bg-primary/5"
                        : "border-border bg-secondary-bg/30 hover:border-primary/40"
                    }`}
                  >
                    <WarehouseStock stock={wh} compact />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <p className="label-text mb-2">Quantity</p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9"
                disabled={quantity <= 1 || loading}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
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
                className="text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9"
                disabled={quantity >= maxQty || loading || maxQty === 0}
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={loading || maxQty === 0 || !selectedWarehouse}
            onClick={handleReserve}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Reserving…
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Reserve
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
