import { NextResponse } from "next/server";
import { confirmReservation } from "@/lib/reservations/service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const reservation = await confirmReservation(id);

    return NextResponse.json({ reservation });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 410 },
    );
  }
}
