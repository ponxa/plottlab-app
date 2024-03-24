import { z } from 'zod';

import { PlotterMontagesSchema } from '@plottlab/backend/core/assets/types/montages';

export const purchaseSessionSchema = z.object({
  sessionId: z.string(),
  preCart: z.object({
    imagesForMontage: z
      .object({
        rawSizeUrl: z.string(),
        versionsCount: z.number(),
      })
      .array(),
    thumbnailImagesForMontage: z
      .object({
        thumbnailUrl: z.string(),
        versionsCount: z.number(),
      })
      .array(),
    status: z.enum(['pending', 'completed']),
  }),
  cart: z
    .array(
      z.object({
        montages: PlotterMontagesSchema,
        TotalMeters: z.number(),
        TotalPrice: z.number(),
      })
    )
    .optional(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  expiresAt: z.string(),
  completedAt: z.string().optional(),
  shipping: z.object({}).optional(),
  customer: z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      phone: z.string(),
    })
    .optional(),
  status: z.enum(['active', 'completed', 'expired']),
});

export type PurchaseSession = z.infer<typeof purchaseSessionSchema>;
