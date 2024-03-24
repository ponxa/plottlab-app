import * as PurchaseSession from '@plottlab/backend/core/purchase/api';

import { makeTRPCHandler, t } from '../factory';
import { z } from 'zod';

import * as SnapShot from '@plottlab/backend/core/checkout/api';

const schema = z.unknown();

const procedure = t.procedure.input(schema).mutation(async ({ input, ctx }) => {
  return await SnapShot.createPaymentLinkAndSaveSnapshot(input);
});
export const { handler, router } = makeTRPCHandler(procedure);
