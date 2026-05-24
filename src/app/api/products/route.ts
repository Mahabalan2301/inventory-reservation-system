import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api-errors";

const productPrices: Record<string, string> = {
  "Nike Shoes": "8990",
  "iPhone 16": "159900",
  "Mac Book": "199900",
  "Sony Headphones": "14990",
  "Gaming Keyboard": "6990",
};

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      include: {
        stocks: {
          include: { warehouse: true },
        },
      },
    });

    const payload = products.map((product) => ({
      id: product.id,
      name: product.name,
      sku: `SKU-${product.id.slice(0, 8).toUpperCase()}`,
      price: productPrices[product.name] || "9999",
      image: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(product.name)}`,
      warehouses: product.stocks.map((stock) => ({
        warehouseId: stock.warehouseId,
        warehouseName: stock.warehouse.name,
        location: stock.warehouse.city,
        totalStock: stock.totalUnits,
        availableStock: stock.totalUnits - stock.reservedUnits,
        reservedStock: stock.reservedUnits,
      })),
    }));

    return NextResponse.json({ products: payload });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return jsonError(500, "Failed to load products");
  }
}
