import * as PurchaseSession from '@plottlab/backend/core/purchase/api';

import { makeTRPCHandler, t } from '../factory';
import { z } from 'zod';

import { purchaseSessionSchema } from '@plottlab/backend/core/purchase/types/purchase-session';

const schema = purchaseSessionSchema.pick({
  cart: true,
});

const procedure = t.procedure.input(schema).mutation(async ({ input, ctx }) => {
  const { cart } = input;

  return await PurchaseSession.updateCart(ctx.purchaseSession.sessionId, cart);
});
export const { handler, router } = makeTRPCHandler(procedure);
