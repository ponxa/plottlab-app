import * as Assets from '@plottlab/backend/core/assets/api';
import * as Purchase from '@plottlab/backend/core/purchase/api';
import type { PurchaseSession } from '@plottlab/backend/core/purchase/types/purchase-session';
import { makeTRPCHandler, t } from '../factory';
import { z } from 'zod';

const schema = z.string();

const procedure = t.procedure.input(schema).mutation(async ({ input, ctx }) => {
  const { rawSizeImage, thumbnailUrl } = await Assets.makeThumbnail(input);
  const { sessionId } = ctx.purchaseSession;

  let preCart: PurchaseSession['preCart'] = {
    imagesForMontage: [
      {
        rawSizeUrl: rawSizeImage.rawSizeUrl,
        versionsCount: 1,
      },
    ],
    thumbnailImagesForMontage: [
      {
        thumbnailUrl: thumbnailUrl,
        versionsCount: 1,
      },
    ],
    status: 'pending',
  };

  return await Purchase.updatePreCart(sessionId, preCart);
});

export const { handler, router } = makeTRPCHandler(procedure);
