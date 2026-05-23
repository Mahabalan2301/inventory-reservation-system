import { NextResponse } from "next/server";
import { releaseReservation } from "@/lib/reservations/service";
import { jsonError } from "@/lib/api-errors";
import { ReservationConflictError } from "@/lib/reservations/errors";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const reservation = await releaseReservation(id);

    return NextResponse.json({ reservation });
  } catch (error) {
    if (error instanceof ReservationConflictError) {
      return jsonError(409, error.message);
    }

    console.error("[POST /api/reservations/[id]/release]", error);
    return jsonError(500, "Failed to release reservation");
  }
}
