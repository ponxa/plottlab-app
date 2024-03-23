import { makeTRPCHandler, t } from '../factory';
import { z } from 'zod';

import * as Uploads from '@plottlab/backend/core/uploads/api';

const schema = z.object({ filename: z.string(), contentType: z.string() });
const procedure = t.procedure
  .input(schema)
  .mutation(async ({ input: { filename, contentType } }) => {
    return await Uploads.getShortLivedS3PutObjectUrl(filename, contentType);
  });

export const { handler, router } = makeTRPCHandler(procedure);
