import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api-errors";

export async function GET() {
  try {

    const products = await prisma.product.findMany({

      orderBy: {
        name: "asc",
      },

      include: {

        inventory: {

          include: {
            warehouse: true,
          },

        },

      },

    });

    const payload = products.map((product) => ({

      id: product.id,

      name: product.name,

      sku: product.sku,

      price: product.price.toString(),

      image: product.image,

      warehouses: product.inventory.map((inv) => ({

        warehouseId: inv.warehouseId,

        warehouseName: inv.warehouse.name,

        location: inv.warehouse.location,

        totalStock: inv.totalStock,

        // Compute dynamically
        availableStock:
          inv.totalStock -
          inv.reservedStock,

        reservedStock:
          inv.reservedStock,

      })),

    }));


    return NextResponse.json({
      products: payload,
    });

  } catch (error) {

    console.error("[GET /api/products]", error);

    return jsonError(
      500,
      "Failed to load products"
    );

  }

}