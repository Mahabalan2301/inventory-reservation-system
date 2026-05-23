import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {

  try {

    const products = await prisma.product.findMany({

      include: {

        stocks: {
          include: {
            warehouse: true
          }
        }

      }

    });

    const formattedProducts = products.map((product)=>({

      id: product.id,

      name: product.name,

      description: product.description,

      warehouses: product.stocks.map((stock)=>({

        warehouseId: stock.warehouse.id,

        warehouseName: stock.warehouse.name,

        availableStock:
          stock.totalUnits - stock.reservedUnits

      }))

    }));


    return Response.json(formattedProducts);

  }

  catch(error){

    console.error(error);

    return Response.json(
      {
        message:"Failed to fetch products"
      },
      {
        status:500
      }
    );

  }

}