import { NextResponse } from "next/server";
import { createReservation } from "@/lib/reservations/service";
import { createReservationSchema } from "@/lib/validations/reservation";
import { jsonError } from "@/lib/api-errors";
import {
  InsufficientStockError,
  InventoryNotFoundError,
} from "@/lib/reservations/errors";
import {
  cacheIdempotentResponse,
  getIdempotentResponse,
} from "@/lib/idempotency/service";
import { isRedisConfigured } from "@/lib/redis";

export async function POST(request: Request) {
  try {
    const idempotencyKey = request.headers
      .get("Idempotency-Key")
      ?.trim();

    if (idempotencyKey && isRedisConfigured()) {
      const cached = await getIdempotentResponse(idempotencyKey);
      if (cached) {
        return Response.json(cached.body, {
          status: cached.status,
        });
      }
    }

    const body = await request.json();

    const parsed = createReservationSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(400, "Invalid request body");
    }

    const reservation = await createReservation(parsed.data);

    const responseBody = { reservation };

    if (idempotencyKey && isRedisConfigured()) {
      await cacheIdempotentResponse(idempotencyKey, {
        status: 201,
        body: responseBody,
      });
    }

    return NextResponse.json(responseBody, { status: 201 });
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
