"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Package,
  TrendingUp,
  Clock,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types";

type InventorySummaryProps = {
  products: Product[];
  activeReservations: number;
};

export function InventorySummary({
  products,
  activeReservations,
}: InventorySummaryProps) {
  // Calculate metrics
  const totalProducts = products.length;
  
  const { availableUnits, reservedUnits } = products.reduce(
    (acc, product) => {
      product.warehouses.forEach((warehouse) => {
        acc.availableUnits += warehouse.availableStock;
        acc.reservedUnits += warehouse.reservedStock;
      });
      return acc;
    },
    { availableUnits: 0, reservedUnits: 0 }
  );

  const uniqueWarehouses = products.reduce((acc, product) => {
    product.warehouses.forEach((w) => acc.add(w.warehouseName));
    return acc;
  }, new Set<string>());

  const metrics = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      label: "Warehouses",
      value: uniqueWarehouses.size,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/20",
    },
    {
      label: "Total Stock",
      value: availableUnits + reservedUnits,
      icon: ShoppingCart,
      color: "text-warning",
      bgColor: "bg-warning/20",
    },
    {
      label: "Reservations",
      value: activeReservations,
      icon: Clock,
      color: "text-success",
      bgColor: "bg-success/20",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div key={index} variants={itemVariants}>
            <Card className="overflow-hidden border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5">
              <CardContent className="p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="label-text text-secondary-text mb-3">
                      {metric.label}
                    </p>
                    <p className="text-4xl font-bold text-foreground">
                      {metric.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`icon-circle ${metric.bgColor} flex-shrink-0`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
