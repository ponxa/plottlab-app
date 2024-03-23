// New TRPC client
import { makeClient as makeClientV1, endpoints } from './ui';

type Client = ReturnType<typeof makeClientV1>;

type Routers = {
  [R in keyof Client]: Client[R] & { name: R };
};
type RoutersInputs = {
  [R in Routers[keyof Routers] as R['name']]: Parameters<R['']['mutate']>[0];
};
type RoutersOutputs = {
  [R in Routers[keyof Routers] as R['name']]: Awaited<
    ReturnType<R['']['mutate']>
  >;
};

export function makeClient(apiUrl: string, headers?: Record<string, string>) {
  let $headers = { ...headers };
  let $client = makeClientV1(apiUrl, $headers);

  function resetClient() {
    $client = makeClientV1(apiUrl, $headers);
  }

  const endpointFns = Object.fromEntries(
    endpoints.map((endpoint) => [
      endpoint,
      async (...args: unknown[]) => await $client[endpoint][''].mutate(args[0]), //! Allowing for now
    ])
  ) as unknown as EndpointFunctions;

  return {
    ...endpointFns,
    $appendHeaders(headers?: Record<string, string>) {
      $headers = { ...$headers, ...headers };
      resetClient();
    },
    $removeHeaders(headers: string[]) {
      headers.forEach((header) => delete $headers[header]);
      resetClient();
    },
    $clearHeaders() {
      $headers = {};
      resetClient();
    },
  };
}

type EndpointFunctions = {
  [Key in keyof RoutersInputs]: (
    ...args: RoutersInputs[Key] extends void | undefined
      ? []
      : [params: RoutersInputs[Key]]
  ) => Promise<RoutersOutputs[Key]>;
};
