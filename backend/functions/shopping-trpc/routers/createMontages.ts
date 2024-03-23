import * as Assets from '@plottlab/backend/core/assets/api';
import { makeTRPCHandler, t } from '../factory';
import { z } from 'zod';

const schema = z.array(z.string());

const procedure = t.procedure.input(schema).mutation(async ({ input, ctx }) => {
  const montageUrls = await Assets.savePlotts(input);

  return { montageUrls };
});
export const { handler, router } = makeTRPCHandler(procedure);
