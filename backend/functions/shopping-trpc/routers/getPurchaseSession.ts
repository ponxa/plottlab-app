import * as ShoppingSession from '@plottlab/backend/core/purchase/api';
import jwt from 'jsonwebtoken';
import { makeTRPCHandler, t } from '../factory';
import { z } from 'zod';

import { Config } from 'sst/node/config';

const schema = z.unknown();

const PLOTTLAB_SESSION_JWT_SECRET = Config.PLOTTLAB_SESSION_JWT_SECRET;

const procedure = t.procedure.input(schema).mutation(async ({ input, ctx }) => {
  return {
    purchaseSession: ctx.purchaseSession,
    sessionToken: jwt.sign(
      {
        purchaseSessionId: ctx.purchaseSession.sessionId,
        updatedAt: ctx.purchaseSession.updatedAt,
      },
      PLOTTLAB_SESSION_JWT_SECRET
    ),
  };
});
export const { handler, router } = makeTRPCHandler(procedure);
