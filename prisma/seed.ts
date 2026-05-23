import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  // Warehouses
  const chennai = await prisma.warehouse.create({
    data: {
      name: "Chennai Warehouse",
      city: "Chennai"
    }
  });

  const bangalore = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
      city: "Bangalore"
    }
  });

  // Products
  const shoes = await prisma.product.create({
    data: {
      name: "Nike Shoes",
      description: "Sports shoes"
    }
  });

  const iphone = await prisma.product.create({
    data: {
      name: "iPhone 16",
      description: "Apple smartphone"
    }
  });

  // Inventory
  await prisma.stock.createMany({

    data:[
      {
        productId: shoes.id,
        warehouseId: chennai.id,
        totalUnits:10
      },

      {
        productId: shoes.id,
        warehouseId: bangalore.id,
        totalUnits:5
      },

      {
        productId: iphone.id,
        warehouseId: chennai.id,
        totalUnits:8
      }
    ]

  });

}

main()
.then(()=>{
 console.log("Seed data inserted");
})
.catch((e)=>{
 console.error(e);
})
.finally(async()=>{
 await prisma.$disconnect();
});