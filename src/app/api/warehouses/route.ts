import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api-errors";

export async function GET() {
  try {

    const warehouses = await prisma.warehouse.findMany({

      orderBy: {
        name: "asc",
      },

      select: {

        id: true,

        name: true,

        location: true,

        inventory: {

          select: {
            productId: true,
            totalStock: true,
            reservedStock: true,
          }

        }

      }

    });

    const payload = warehouses.map((warehouse)=>({

      id: warehouse.id,

      name: warehouse.name,

      location: warehouse.location,

      inventoryCount:
        warehouse.inventory.length,

      inventory:
        warehouse.inventory.map((item)=>({

          productId: item.productId,

          totalStock:
            item.totalStock,

          reservedStock:
            item.reservedStock,

          availableStock:
            item.totalStock -
            item.reservedStock

        }))

    }));


    return NextResponse.json({
      warehouses: payload
    });

  }

  catch(error){

    console.error(
      "[GET /api/warehouses]",
      error
    );

    return jsonError(
      500,
      "Failed to load warehouses"
    );

  }

}