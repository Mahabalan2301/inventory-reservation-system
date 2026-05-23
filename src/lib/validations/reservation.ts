import { z } from "zod";

export const createReservationSchema = z.object({
  productId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
