import { makeClient } from '@plottlab/backend/functions/crafters-trpc/client/ui-v2';

function makeHeaders() {
  // Init headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Get session token and append to headers

  return headers;
}

export default defineNuxtPlugin(async () => {
  const apiUrl = 'https://tm3unoj516.execute-api.sa-east-1.amazonaws.com/trpc';
  return {
    provide: {
      trpcAPI: () => makeClient(apiUrl, makeHeaders()),
    },
  };
});

export type ArrayElement<ArrType> =
  ArrType extends readonly (infer ElementType)[] ? ElementType : never;

type TRPCApi = ReturnType<typeof makeClient>;

export type TRPCOutput<Endpoint extends keyof TRPCApi> = Awaited<
  ReturnType<TRPCApi[Endpoint]>
>;

export type TRPCInput<Endpoint extends keyof TRPCApi> = Parameters<
  TRPCApi[Endpoint]
>[0];
