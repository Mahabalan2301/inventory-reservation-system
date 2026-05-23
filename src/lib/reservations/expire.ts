import { ReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Release one expired reservation
 */
export async function releaseExpiredReservation(
  reservationId: string,
): Promise<boolean> {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation || reservation.status !== ReservationStatus.PENDING) {
    return false;
  }

  if (reservation.expiresAt > new Date()) {
    return false;
  }

  await prisma.$transaction(async (tx) => {
    const current = await tx.reservation.findUnique({
      where: { id: reservationId },
    });

    if (
      !current ||
      current.status !== ReservationStatus.PENDING ||
      current.expiresAt > new Date()
    ) {
      return;
    }

    const stock = await tx.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId: current.productId,
          warehouseId: current.warehouseId,
        },
      },
    });

    if (!stock) {
      return;
    }

    /* protect against negative values */
    if (stock.reservedUnits < current.quantity) {
      throw new Error("Reserved stock underflow");
    }

    await tx.stock.update({
      where: {
        productId_warehouseId: {
          productId: current.productId,
          warehouseId: current.warehouseId,
        },
      },
      data: {
        reservedUnits: {
          decrement: current.quantity,
        },
      },
    });

    await tx.reservation.update({
      where: { id: reservationId },
      data: {
        status: ReservationStatus.RELEASED,
      },
    });
  });

  return true;
}

/**
 * Batch cleanup
 */
export async function expireStaleReservations(): Promise<number> {
  const stale = await prisma.reservation.findMany({
    where: {
      status: ReservationStatus.PENDING,
      expiresAt: { lt: new Date() },
    },
    select: { id: true },
    take: 100,
  });

  let count = 0;

  for (const { id } of stale) {
    const released = await releaseExpiredReservation(id);

    if (released) {
      count++;
    }
  }

  return count;
}

/**
 * Lazy cleanup on read
 */
export async function ensureReservationActive(
  reservationId: string,
): Promise<{ expired: boolean }> {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (
    !reservation ||
    reservation.status !== ReservationStatus.PENDING ||
    reservation.expiresAt > new Date()
  ) {
    return { expired: false };
  }

  await releaseExpiredReservation(reservationId);

  return { expired: true };
}
