import { initTRPC, AnyProcedure } from '@trpc/server';
import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import { createContext, PurchaseContext } from './middleware';

export const t = initTRPC.context<PurchaseContext>().create();

export function makeTRPCHandler<ProcedureT extends AnyProcedure>(
  procedure: ProcedureT
) {
  const router = t.router({
    '': procedure,
  });

  return {
    router,
    handler: awsLambdaRequestHandler({ router, createContext }),
  };
}
