import { makeClient } from '@plottlab/backend/functions/shopping-trpc/client/ui-v2';

function makeHeaders() {
  // Init headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Get session token and append to headers
  const tokenCookie = useCookie('_token');
  const sessionToken = tokenCookie.value ?? undefined;
  if (sessionToken !== undefined) {
    headers.Authorization = `Bearer ${sessionToken}`;
  }

  return headers;
}

export default defineNuxtPlugin(async () => {
  const apiUrl = 'https://2ojhwcma9e.execute-api.sa-east-1.amazonaws.com/trpc';
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
