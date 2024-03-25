import * as PurchaseSession from '@plottlab/backend/core/purchase/api';

import { makeTRPCHandler, t } from '../factory';
import { string, z } from 'zod';

import { PlotterMontagesSchema } from '@plottlab/backend/core/assets/types/montages';

const schema = PlotterMontagesSchema;

const procedure = t.procedure.input(schema).mutation(async ({ input, ctx }) => {
  input;

  return await PurchaseSession.generatedMontages(
    ctx.purchaseSession.sessionId,
    input
  );
});
export const { handler, router } = makeTRPCHandler(procedure);
