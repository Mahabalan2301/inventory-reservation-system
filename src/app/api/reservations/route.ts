import { NextResponse } from "next/server";
import { createReservation } from "@/lib/reservations/service";
import { createReservationSchema } from "@/lib/validations/reservation";
import { jsonError } from "@/lib/api-errors";
import {
  InsufficientStockError,
  InventoryNotFoundError,
} from "@/lib/reservations/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = createReservationSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(400, "Invalid request body");
    }

    const reservation = await createReservation(parsed.data);

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    if (error instanceof InsufficientStockError) {
      return jsonError(409, "Not enough stock available");
    }

    if (error instanceof InventoryNotFoundError) {
      return jsonError(404, "Inventory not found");
    }

    console.error("[POST /api/reservations]", error);
    return jsonError(500, "Failed to create reservation");
  }
}
