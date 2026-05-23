import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api-errors";

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        city: true,
        stocks: {
          select: {
            productId: true,
            totalUnits: true,
            reservedUnits: true,
          },
        },
      },
    });

    const payload = warehouses.map((warehouse) => ({
      id: warehouse.id,
      name: warehouse.name,
      location: warehouse.city,
      inventoryCount: warehouse.stocks.length,
      inventory: warehouse.stocks.map((item) => ({
        productId: item.productId,
        totalStock: item.totalUnits,
        reservedStock: item.reservedUnits,
        availableStock: item.totalUnits - item.reservedUnits,
      })),
    }));

    return NextResponse.json({ warehouses: payload });
  } catch (error) {
    console.error("[GET /api/warehouses]", error);
    return jsonError(500, "Failed to load warehouses");
  }
}
