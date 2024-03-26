import * as PurchaseSession from '@plottlab/backend/core/purchase/api';

import { makeTRPCHandler, t } from '../factory';
import { z } from 'zod';

const schema = z.object({
  imageId: z.string(),
  copies: z.number(),
});

const procedure = t.procedure.input(schema).mutation(async ({ input, ctx }) => {
  const { imageId } = input;

  return await PurchaseSession.updateImgCopies(
    ctx.purchaseSession.sessionId,
    imageId,
    input.copies
  );
});
export const { handler, router } = makeTRPCHandler(procedure);
