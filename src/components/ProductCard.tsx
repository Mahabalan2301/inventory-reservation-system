"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { WarehouseStock } from "@/components/WarehouseStock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <div className="relative h-44 w-full overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            unoptimized
          />
        </div>

        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-1">{product.name}</CardTitle>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{product.sku}</span>
            <span className="font-semibold text-foreground">
              ${product.price}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Warehouses
            </p>
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
                    className={`w-full text-left transition-all ${
                      selectedWarehouse?.warehouseId === wh.warehouseId
                        ? "ring-2 ring-primary rounded-xl"
                        : ""
                    }`}
                  >
                    <WarehouseStock stock={wh} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
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
              disabled={quantity >= maxQty || loading || maxQty === 0}
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            className="w-full transition-all duration-300 hover:-translate-y-1"
            disabled={loading || maxQty === 0 || !selectedWarehouse}
            onClick={handleReserve}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Reserving...
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
