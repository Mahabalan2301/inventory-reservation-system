/**
 * Concurrent reservation test (temporary).
 *
 * Prereqs:
 *   1. npm run dev   (API on http://localhost:3000)
 *   2. npx tsx scripts/test.ts
 *
 * Setup: Stock = 1 unit
 * Expected: one request → 201, the other → 409
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const prisma = new PrismaClient();

let productId = "";
let warehouseId = "";

async function setup() {
  const product = await prisma.product.create({
    data: {
      name: "Concurrency Test Product",
      description: "temporary test fixture",
    },
  });

  const warehouse = await prisma.warehouse.create({
    data: {
      name: "Concurrency Test Warehouse",
      city: "Test",
    },
  });

  await prisma.stock.create({
    data: {
      productId: product.id,
      warehouseId: warehouse.id,
      totalUnits: 1,
      reservedUnits: 0,
    },
  });

  productId = product.id;
  warehouseId = warehouse.id;

  console.log(`Fixture ready — productId: ${productId}, warehouseId: ${warehouseId}`);
  console.log("Stock: totalUnits=1, reservedUnits=0\n");
}

async function reserve(label: string) {
  const response = await fetch(`${BASE_URL}/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId,
      warehouseId,
      quantity: 1,
    }),
  });

  const body = await response.json();
  return { label, status: response.status, body };
}

async function cleanup() {
  await prisma.reservation.deleteMany({
    where: { productId, warehouseId },
  });
  await prisma.stock.deleteMany({ where: { productId, warehouseId } });
  await prisma.product.delete({ where: { id: productId } });
  await prisma.warehouse.delete({ where: { id: warehouseId } });
}

async function main() {
  await setup();

  console.log("Firing Request A and Request B in parallel...\n");

  const [resultA, resultB] = await Promise.all([reserve("A"), reserve("B")]);

  for (const result of [resultA, resultB]) {
    console.log(
      `Request ${result.label}: ${result.status}`,
      JSON.stringify(result.body),
    );
  }

  const statuses = [resultA.status, resultB.status].sort();
  const passed = statuses[0] === 201 && statuses[1] === 409;

  console.log();

  if (passed) {
    const winner = resultA.status === 201 ? "A" : "B";
    const loser = winner === "A" ? "B" : "A";
    console.log(`PASS — Request ${winner}: 201, Request ${loser}: 409`);
  } else {
    console.error("FAIL — expected one 201 and one 409, got:", statuses);
    process.exitCode = 1;
  }

  await cleanup();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
