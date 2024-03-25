import type { CombinedRouter } from './combined-routers';
import type { HTTPHeaders } from '@trpc/client';
import { createTRPCProxyClient, httpLink } from '@trpc/client';

export const endpoints = [
  'makeMontage',
  'getShortLifeUrl',
  'createMontages',
  'getPurchaseSession',
  'addToCart',
  'addCustomer',
  'geyPaymentLink',
  'makeThumbnails',
  'addToPreCart',
  'removeImg',
  'updateImgCopies',
  // ...otherRouters
] as const;
// const apiUrl =
//   'https://rq8qfj8pq7.execute-api.sa-east-1.amazonaws.com' + '/trpc'; // test
// const API_URL = '' + '/trpc; // dev

export function makeClient(apiUrl: string, headers?: HTTPHeaders) {
  const client = createTRPCProxyClient<CombinedRouter>({
    links: [
      (runtime) => {
        const servers = Object.fromEntries(
          endpoints.map((routeName) => [
            routeName,
            httpLink({
              url: `${apiUrl}/${routeName}/`,
              headers,
            })(runtime),
          ])
        );

        return (ctx) => {
          const { op } = ctx;

          const serverName = op.path
            .split('.')
            .shift() as string as keyof typeof servers;

          const link = servers[serverName];

          if (!link) throw new Error('Endpoint not found');

          return link({ ...ctx, op: { ...op, path: '' } });
        };
      },
    ],
    transformer: undefined,
  });

  return client;
}
