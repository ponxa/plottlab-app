import * as PurchaseSession from '@plottlab/backend/core/purchase/api';

import { makeTRPCHandler, t } from '../factory';

const procedure = t.procedure.mutation(async ({ ctx }) => {
  return await PurchaseSession.removeGeneratedMontages(
    ctx.purchaseSession.sessionId
  );
});
export const { handler, router } = makeTRPCHandler(procedure);
