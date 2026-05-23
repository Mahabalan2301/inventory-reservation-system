import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api-errors";
import { ensureReservationActive } from "@/lib/reservations/expire";
import { ReservationNotFoundError } from "@/lib/reservations/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await ensureReservationActive(id);

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        product: true,
        warehouse: true,
      },
    });

    if (!reservation) {
      throw new ReservationNotFoundError();
    }

    return NextResponse.json({ reservation });
  } catch (error) {
    if (error instanceof ReservationNotFoundError) {
      return jsonError(404, error.message);
    }

    console.error("[GET /api/reservations/[id]]", error);
    return jsonError(500, "Failed to load reservation");
  }
}
