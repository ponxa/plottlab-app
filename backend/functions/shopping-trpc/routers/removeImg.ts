import * as PurchaseSession from '@plottlab/backend/core/purchase/api';

import { makeTRPCHandler, t } from '../factory';
import { z } from 'zod';

const schema = z.object({
  imageId: z.string(),
});

const procedure = t.procedure.input(schema).mutation(async ({ input, ctx }) => {
  const { imageId } = input;

  return await PurchaseSession.removeImg(
    ctx.purchaseSession.sessionId,
    imageId
  );
});
export const { handler, router } = makeTRPCHandler(procedure);
