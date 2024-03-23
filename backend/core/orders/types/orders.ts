import { z } from 'zod';

export const ordersSchema = z.object({
  snapId: z.string(),
  snapCreatedAt: z.string(),
  cart: z.array(
    z.object({
      TotalPrice: z.number(),
      montages: z.object({
        id: z.string(),
        montagesUrls: z.array(z.string()),
        createdAt: z.string(),
        thumbnailsUrls: z.array(z.string()),
      }),
    })
  ),
});

export type Orders = z.infer<typeof ordersSchema>;
