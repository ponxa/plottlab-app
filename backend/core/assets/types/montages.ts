import { z } from 'zod';

export const PlotterMontagesSchema = z.object({
  id: z.string(),
  montagesUrls: z.array(
    z.object({
      url: z.string(),
    })
  ),
  createdAt: z.string(),
  thumbnailsUrls: z.array(
    z.object({
      url: z.string(),

      realDimensions: z.object({
        width: z.number(),
        height: z.number(),
      }),
    })
  ),
});

export type PlotterMontages = z.infer<typeof PlotterMontagesSchema>;
