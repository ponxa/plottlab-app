import { purchaseSessionSchema } from '@plottlab/backend/core/purchase/types/purchase-session';
import { z } from 'zod';

export const snapShotSchema = purchaseSessionSchema.extend({
  snapId: z.string(),
  snapCreatedAt: z.string(),
});

export type SnapShot = z.infer<typeof snapShotSchema>;
