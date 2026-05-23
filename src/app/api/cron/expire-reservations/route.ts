import { NextResponse } from "next/server";
import { expireStaleReservations } from "@/lib/reservations/expire";

export async function GET() {
  try {
    const releasedCount = await expireStaleReservations();

    return NextResponse.json({
      success: true,
      releasedReservations: releasedCount,
    });
  } catch (error) {
    console.error("[CRON_EXPIRE_RESERVATIONS]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to release expired reservations",
      },
      { status: 500 },
    );
  }
}
