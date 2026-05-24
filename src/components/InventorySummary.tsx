"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Package,
  Warehouse,
  Boxes,
  Clock,
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
  const totalProducts = products.length;

  const { availableUnits, reservedUnits } = products.reduce(
    (acc, product) => {
      product.warehouses.forEach((warehouse) => {
        acc.availableUnits += warehouse.availableStock;
        acc.reservedUnits += warehouse.reservedStock;
      });
      return acc;
    },
    { availableUnits: 0, reservedUnits: 0 },
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
    },
    {
      label: "Warehouses",
      value: uniqueWarehouses.size,
      icon: Warehouse,
    },
    {
      label: "Total Stock",
      value: availableUnits + reservedUnits,
      icon: Boxes,
    },
    {
      label: "Active Reservations",
      value: activeReservations,
      icon: Clock,
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mb-10"
    >
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div key={index} variants={itemVariants}>
            <Card className="border-border bg-secondary-bg transition-shadow hover:shadow-md">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="label-text mb-2">{metric.label}</p>
                    <p className="text-2xl font-semibold tabular-nums text-foreground md:text-3xl">
                      {metric.value.toLocaleString()}
                    </p>
                  </div>
                  <div className="icon-circle flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary md:h-5 md:w-5" />
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
