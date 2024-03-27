import * as Orders from '@plottlab/backend/core/orders/api';

import { makeTRPCHandler, t } from '../factory';
import { z } from 'zod';

const schema = z.unknown();

const procedure = t.procedure.input(schema).mutation(async ({ input, ctx }) => {
  return await Orders.getAllOrders();
});
export const { handler, router } = makeTRPCHandler(procedure);
