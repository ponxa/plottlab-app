import * as PurchaseSession from '@plottlab/backend/core/purchase/api';

import { makeTRPCHandler, t } from '../factory';
import { z } from 'zod';

import { purchaseSessionSchema } from '@plottlab/backend/core/purchase/types/purchase-session';

const schema = purchaseSessionSchema.pick({
  customer: true,
});

const procedure = t.procedure.input(schema).mutation(async ({ input, ctx }) => {
  // const { sessionId, updatedAt, cart } = input;
  const { customer } = input;

  try {
    await PurchaseSession.updateCustomers(
      ctx.purchaseSession.sessionId,
      customer
    );
  } catch (error) {}
});
export const { handler, router } = makeTRPCHandler(procedure);
