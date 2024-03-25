import * as Assets from '@plottlab/backend/core/assets/api';
import * as Purchase from '@plottlab/backend/core/purchase/api';
import type { PurchaseSession } from '@plottlab/backend/core/purchase/types/purchase-session';
import { makeTRPCHandler, t } from '../factory';
import { z } from 'zod';

import { v4 as uuid } from 'uuid';

const schema = z.string();

const procedure = t.procedure.input(schema).mutation(async ({ input, ctx }) => {
  const { rawSizeImage, thumbnailUrl } = await Assets.makeThumbnail(input);
  const { sessionId } = ctx.purchaseSession;

  const imageId = uuid();

  let preCart: PurchaseSession['preCart'] = {
    imagesForMontage: [
      {
        rawSizeUrl: rawSizeImage.rawSizeUrl,
        copies: 1,
        id: imageId,
      },
    ],
    thumbnailImagesForMontage: [
      {
        thumbnailUrl: thumbnailUrl,
        copies: 1,
        id: imageId,
      },
    ],
    status: 'pending',
  };

  return await Purchase.updatePreCart(sessionId, preCart);
});

export const { handler, router } = makeTRPCHandler(procedure);
