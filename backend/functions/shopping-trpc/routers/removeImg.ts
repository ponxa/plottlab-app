import * as PurchaseSession from '@plottlab/backend/core/purchase/api';

import { makeTRPCHandler, t } from '../factory';
import { string, z } from 'zod';

import { purchaseSessionSchema } from '@plottlab/backend/core/purchase/types/purchase-session';

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
