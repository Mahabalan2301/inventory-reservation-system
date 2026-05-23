import { prisma } from "@/lib/prisma";
import { ReservationStatus, Prisma } from "@prisma/client";
import type { CreateReservationInput } from "@/lib/validations/reservation";
import { InsufficientStockError, InventoryNotFoundError } from "./errors";

const RESERVATION_MINUTES = 10;

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
