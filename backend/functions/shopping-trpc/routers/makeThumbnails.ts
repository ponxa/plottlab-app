import * as Assets from '@plottlab/backend/core/assets/api';
import { makeTRPCHandler, t } from '../factory';
import { z } from 'zod';

const schema = z.string();

const procedure = t.procedure.input(schema).mutation(async ({ input, ctx }) => {
  const singleImageUrl = await Assets.makeThumbnail(input);

  return singleImageUrl;
});
export const { handler, router } = makeTRPCHandler(procedure);
