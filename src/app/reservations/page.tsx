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
        setError(
          err instanceof Error ? err.message : "Failed to load reservations",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "success" as const;
      case "PENDING":
        return "warning" as const;
      default:
        return "secondary" as const;
    }
  };

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
            Reservations
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            View and track all inventory reservations
          </p>
        </motion.div>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-lg border border-border bg-secondary-bg/50"
              />
            ))}
          </div>
        )}

        {error && !loading && <ErrorAlert message={error} />}

        {!loading && !error && sortedReservations.length === 0 && (
          <EmptyState
            title="No reservations yet"
            description="Start by creating your first product reservation."
          />
        )}

        {!loading && !error && sortedReservations.length > 0 && (
          <motion.div
            className="space-y-3 pb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {sortedReservations.map((reservation, index) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-5 md:p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusVariant(reservation.status)}>
                          {reservation.status}
                        </Badge>
                        <span className="font-mono text-xs text-muted-foreground">
                          {reservation.id.slice(0, 8)}…
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(reservation.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-secondary-bg text-muted-foreground">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="label-text">Product</p>
                          <p className="text-sm font-medium text-foreground">
                            {reservation.product.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-secondary-bg text-muted-foreground">
                          <Warehouse className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="label-text">Warehouse</p>
                          <p className="text-sm font-medium text-foreground">
                            {reservation.warehouse.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {reservation.warehouse.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-secondary-bg text-muted-foreground">
                          <Hash className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="label-text">Quantity</p>
                          <p className="text-sm font-medium text-foreground">
                            {reservation.quantity} unit
                            {reservation.quantity !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Expires:{" "}
                        {new Date(reservation.expiresAt).toLocaleString()}
                      </span>
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
