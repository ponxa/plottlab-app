import * as PurchaseSession from '@plottlab/backend/core/purchase/api';

import { makeTRPCHandler, t } from '../factory';
import { z } from 'zod';

import { purchaseSessionSchema } from '@plottlab/backend/core/purchase/types/purchase-session';

const schema = z.unknown();

const procedure = t.procedure.input(schema).mutation(async ({ input, ctx }) => {
  // const { sessionId, updatedAt, cart } = input;

  console.log('input', input);

  return await PurchaseSession.updateCustomers(
    ctx.purchaseSession.sessionId,
    input
  );
});
export const { handler, router } = makeTRPCHandler(procedure);
