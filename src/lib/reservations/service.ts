import { prisma } from "@/lib/prisma";
import { ReservationStatus, Prisma } from "@prisma/client";
import type { CreateReservationInput } from "@/lib/validations/reservation";
import {
  InsufficientStockError,
  InventoryNotFoundError,
  ReservationConflictError,
  ReservationExpiredError,
  ReservationNotFoundError,
} from "./errors";

const RESERVATION_MINUTES = 10;

function assertReservedUnitsSufficient(
  reservedUnits: number,
  quantity: number,
) {
  if (reservedUnits < quantity) {
    throw new Error("Reserved stock underflow");
  }
}

export async function createReservation(input: CreateReservationInput) {
  const expiresAt = new Date(
    Date.now() + RESERVATION_MINUTES * 60 * 1000,
  );

  return prisma.$transaction(async (tx) => {
    const inventory = await tx.$queryRaw<
      Array<{
        productId: string;
        warehouseId: string;
        totalUnits: number;
        reservedUnits: number;
      }>
    >(Prisma.sql`
      SELECT
        "productId",
        "warehouseId",
        "totalUnits",
        "reservedUnits"
      FROM "Stock"
      WHERE
        "productId" = ${input.productId}
        AND "warehouseId" = ${input.warehouseId}
      FOR UPDATE
    `);

    const row = inventory[0];

    if (!row) {
      throw new InventoryNotFoundError();
    }

    const available = row.totalUnits - row.reservedUnits;

    if (available < input.quantity) {
      throw new InsufficientStockError();
    }

    await tx.stock.update({
      where: {
        productId_warehouseId: {
          productId: input.productId,
          warehouseId: input.warehouseId,
        },
      },
      data: {
        reservedUnits: {
          increment: input.quantity,
        },
      },
    });

    return tx.reservation.create({
      data: {
        productId: input.productId,
        warehouseId: input.warehouseId,
        quantity: input.quantity,
        status: ReservationStatus.PENDING,
        expiresAt,
      },
      include: {
        product: true,
        warehouse: true,
      },
    });
  });
}

export async function confirmReservation(id: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!reservation) {
    throw new Error("Reservation not found");
  }

  if (reservation.status === ReservationStatus.CONFIRMED) {
    return reservation;
  }

  if (reservation.expiresAt < new Date()) {
    throw new ReservationExpiredError();
  }

  return prisma.$transaction(async (tx) => {
    const stock = await tx.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId: reservation.productId,
          warehouseId: reservation.warehouseId,
        },
      },
    });

    if (!stock) {
      throw new InventoryNotFoundError();
    }

    assertReservedUnitsSufficient(stock.reservedUnits, reservation.quantity);

    if (stock.totalUnits < reservation.quantity) {
      throw new Error("Invalid inventory state");
    }

    await tx.stock.update({
      where: {
        productId_warehouseId: {
          productId: reservation.productId,
          warehouseId: reservation.warehouseId,
        },
      },
      data: {
        reservedUnits: {
          decrement: reservation.quantity,
        },
        totalUnits: {
          decrement: reservation.quantity,
        },
      },
    });

    return tx.reservation.update({
      where: { id },
      data: {
        status: ReservationStatus.CONFIRMED,
      },
    });
  });
}

export async function releaseReservation(id: string) {
  const existing = await prisma.reservation.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new ReservationNotFoundError();
  }

  if (existing.status === ReservationStatus.RELEASED) {
    return existing;
  }

  if (existing.status === ReservationStatus.CONFIRMED) {
    throw new ReservationConflictError("Cannot cancel a confirmed purchase");
  }

  if (existing.status !== ReservationStatus.PENDING) {
    throw new ReservationConflictError("Invalid reservation state");
  }

  return prisma.$transaction(async (tx) => {
    const stock = await tx.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId: existing.productId,
          warehouseId: existing.warehouseId,
        },
      },
    });

    if (!stock) {
      throw new InventoryNotFoundError();
    }

    assertReservedUnitsSufficient(stock.reservedUnits, existing.quantity);

    await tx.stock.update({
      where: {
        productId_warehouseId: {
          productId: existing.productId,
          warehouseId: existing.warehouseId,
        },
      },
      data: {
        reservedUnits: {
          decrement: existing.quantity,
        },
      },
    });

    return tx.reservation.update({
      where: { id },
      data: {
        status: ReservationStatus.RELEASED,
      },
    });
  });
}
