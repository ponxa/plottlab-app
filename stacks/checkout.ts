import { StackContext, Table, Config, Api, Topic } from 'sst/constructs';

export function PlottlabCheckoutStack({ stack, app }: StackContext) {
  //* Table
  const snapshotTable = new Table(stack, 'SnapshotTable', {
    fields: {
      snapId: 'string',
    },
    primaryIndex: { partitionKey: 'snapId' },
  });

  //*Secrets Mercadopago
  const mercadopagoSecrets = new Config.Secret(
    stack,
    'PLOTTLAB_MERCADOPAGO_APP_ACCESS_TOKEN'
  );

  const snapShopPaidTopic = new Topic(stack, 'SNAP_ORDER_PAID');

  const checkoutApi = new Api(stack, 'CheckoutApi');

  const exposed = {
    bindings: {
      snapshotTable,
      mercadopagoSecrets,
      checkoutApi,
      snapShopPaidTopic,
    },
  };

  //* Functions
  stack.setDefaultFunctionProps({
    bind: [
      // Own bindings
      ...Object.values(exposed.bindings),
    ],
  });

  snapShopPaidTopic.addSubscribers(stack, {
    createOrders: {
      function: {
        handler: 'backend/functions/topics/SNAP_ORDER_PAID/createOrder.handler',
        bind: [snapShopPaidTopic],
      },
    },
  });

  checkoutApi.addRoutes(stack, {
    'POST   /hooks/mercadopago': {
      function: {
        handler: 'backend/functions/hooks/checkout/mercadopago.handler',
        timeout: 10,
        bind: [snapShopPaidTopic],
      },
    },
  });

  // Show the API endpoint in output
  stack.addOutputs({
    ApiEndpoint: checkoutApi.url,
  });

  return exposed;
}
