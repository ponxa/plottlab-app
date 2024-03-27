import { z } from 'zod';
import { purchaseSessionSchema } from '../../purchase/types/purchase-session';

export const ordersSchema = z.object({
  orderId: z.string(),
  snapId: z.string(),
  snapCreatedAt: z.string(),
  preCart: purchaseSessionSchema.pick({
    preCart: true,
  }),
  status: z.enum(['paid', 'completed', 'picked']),
});

export type Orders = z.infer<typeof ordersSchema>;
