"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Package, Warehouse, Hash } from "lucide-react";
import { Header } from "@/components/Header";
import { EmptyState } from "@/components/EmptyState";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Reservation } from "@/types";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/reservations");
        if (!response.ok) {
          throw new Error("Failed to fetch reservations");
        }
        const data = await response.json();
        setReservations(data.reservations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "success";
      case "PENDING":
        return "warning";
      case "RELEASED":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "✓";
      case "PENDING":
        return "⏱";
      case "RELEASED":
        return "↻";
      default:
        return "•";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 md:px-6 py-6 md:py-8 max-w-7xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2 md:mb-3">
            Reservations
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            View all your inventory reservations
          </p>
        </motion.div>

        {/* Content */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-secondary-bg/50 border border-border animate-pulse"
              />
            ))}
          </div>
        )}

        {error && !loading && (
          <ErrorAlert message={error} />
        )}

        {!loading && !error && sortedReservations.length === 0 && (
          <EmptyState
            title="No reservations yet"
            description="Start by creating your first product reservation."
          />
        )}

        {!loading && !error && sortedReservations.length > 0 && (
          <motion.div
            className="space-y-4 pb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, staggerChildren: 0.1 }}
          >
            {sortedReservations.map((reservation, index) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <Card className="overflow-hidden hover:border-primary/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      {/* Left Content */}
                      <div className="flex-1 space-y-4">
                        {/* Status & ID */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Badge variant={getStatusColor(reservation.status)}>
                              {getStatusIcon(reservation.status)} {reservation.status}
                            </Badge>
                            <span className="text-xs text-secondary-text font-mono">
                              {reservation.id.slice(0, 8)}...
                            </span>
                          </div>
                          <span className="text-sm text-secondary-text">
                            {new Date(reservation.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Product & Warehouse Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Product */}
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary flex-shrink-0 mt-0.5">
                              <Package className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="label-text text-secondary-text">Product</p>
                              <p className="text-sm font-bold text-foreground">
                                {reservation.product.name}
                              </p>
                            </div>
                          </div>

                          {/* Warehouse */}
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent flex-shrink-0 mt-0.5">
                              <Warehouse className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="label-text text-secondary-text">Warehouse</p>
                              <p className="text-sm font-bold text-foreground">
                                {reservation.warehouse.name}
                              </p>
                              <p className="text-xs text-secondary-text">
                                {reservation.warehouse.city}
                              </p>
                            </div>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/15 text-warning flex-shrink-0 mt-0.5">
                              <Hash className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="label-text text-secondary-text">Quantity</p>
                              <p className="text-sm font-bold text-foreground">
                                {reservation.quantity} unit{reservation.quantity !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Expiry Info */}
                        <div className="flex items-center gap-2 pt-2">
                          <Clock className="h-4 w-4 text-secondary-text" />
                          <span className="text-xs text-secondary-text">
                            Expires: {new Date(reservation.expiresAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
