"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Countdown } from "@/components/Countdown";
import { ReservationDetails } from "@/components/ReservationDetails";
import { ErrorAlert } from "@/components/ErrorAlert";
import { CheckoutSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useReservation } from "@/hooks/useReservation";
import { api } from "@/services/api";
import { useProducts } from "@/hooks/useProducts";

export default function CheckoutPage() {
  const params = useParams<{ reservationId: string }>();
  const router = useRouter();
  const reservationId = params.reservationId;

  const { reservation, error, isLoading, mutate } =
    useReservation(reservationId);
  const { mutate: refreshProducts } = useProducts();

  const [expiredLocally, setExpiredLocally] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const isExpired =
    expiredLocally ||
    reservation?.status === "RELEASED" ||
    (reservation?.status === "PENDING" &&
      new Date(reservation.expiresAt).getTime() <= Date.now());

  const isPending = reservation?.status === "PENDING" && !isExpired;
  const buttonsDisabled =
    !isPending || confirming || releasing || confirmed;

  const handleExpire = useCallback(() => {
    setExpiredLocally(true);
    void mutate();
  }, [mutate]);

  const handleConfirm = async () => {
    if (buttonsDisabled) return;
    setConfirming(true);
    try {
      await api.confirmReservation(reservationId);
      setConfirmed(true);
      toast.success("Purchase confirmed");
      await mutate();
      await refreshProducts();
      // Redirect to catalog after a short delay to show success message
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      const error = err as Error & { status?: number };
      if (error.status === 410) {
        toast.error("Reservation expired");
        setExpiredLocally(true);
      } else if (error.status === 409) {
        toast.error("Reservation conflict");
      } else {
        toast.error(error.message || "Failed to confirm purchase");
      }
    } finally {
      setConfirming(false);
    }
  };

  const handleRelease = async () => {
    if (buttonsDisabled) return;
    setReleasing(true);
    try {
      await api.releaseReservation(reservationId);
      toast.success("Reservation released");
      await refreshProducts();
      router.push("/");
    } catch (err) {
      const error = err as Error & { status?: number };
      if (error.status === 409) {
        toast.error(error.message || "Reservation conflict");
      } else {
        toast.error(error.message || "Failed to release reservation");
      }
    } finally {
      setReleasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-lg px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to catalog
        </Link>

        {isLoading && <CheckoutSkeleton />}

        {error && !isLoading && (
          <ErrorAlert
            title="Reservation unavailable"
            message={
              error instanceof Error
                ? error.message
                : "Could not load reservation"
            }
          />
        )}

        {reservation && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ReservationDetails reservation={reservation} />

            <Card>
              <CardContent className="py-8">
                <Countdown
                  expiresAt={reservation.expiresAt}
                  onExpire={handleExpire}
                />
              </CardContent>
            </Card>

            {confirmed && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2 rounded-2xl border border-success/30 bg-success/10 py-4 text-success"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Purchase confirmed</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                variant="success"
                className="w-full"
                disabled={buttonsDisabled}
                onClick={handleConfirm}
              >
                {confirming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Confirm Purchase
              </Button>

              <Button
                variant="outline"
                className="w-full"
                disabled={buttonsDisabled}
                onClick={handleRelease}
              >
                {releasing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Cancel Reservation
              </Button>
            </div>

            {isExpired && reservation.status === "PENDING" && (
              <p className="text-center text-sm text-muted-foreground">
                This hold has expired. Stock may have been released automatically.
              </p>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
