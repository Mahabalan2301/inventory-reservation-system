"use client";

import { motion } from "framer-motion";
import {
  Package,
  TrendingUp,
  Clock,
  BoxesIcon,
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

  const metrics = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Available Units",
      value: availableUnits,
      icon: TrendingUp,
      color: "bg-success/10 text-success",
    },
    {
      label: "Reserved Units",
      value: reservedUnits,
      icon: Clock,
      color: "bg-warning/10 text-warning",
    },
    {
      label: "Active Reservations",
      value: activeReservations,
      icon: BoxesIcon,
      color: "bg-purple-500/10 text-purple-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div key={index} variants={itemVariants}>
            <Card className="border-border/50 hover:border-border transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold">{metric.value}</p>
                  </div>
                  <div className={`rounded-lg p-2.5 ${metric.color}`}>
                    <Icon className="h-5 w-5" />
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
