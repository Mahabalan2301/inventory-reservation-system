import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {

    try {

        const warehouses = await prisma.warehouse.findMany();

        return Response.json(warehouses);

    } catch (error) {

        console.error(error);

        return Response.json(
            {
                message:"Failed to fetch warehouses"
            },
            {
                status:500
            }
        );

    }

}