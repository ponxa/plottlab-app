import { Table, StackContext, Config } from 'sst/constructs';

export function PlottPurchaseStack({ stack, app }: StackContext) {
  const purchaseTable = new Table(stack, 'PurchaseTable', {
    fields: {
      sessionId: 'string',
    },
    primaryIndex: {
      partitionKey: 'sessionId',
    },
  });

  const PLOTTLAB_SESSION_JWT_SECRET = new Config.Secret(
    stack,
    'PLOTTLAB_SESSION_JWT_SECRET'
  );

  // const PRICE_PER_METER = new Config.Parameter(stack, 'PRICE_PER_METER', {
  //   value: '5000',
  // });

  stack.setDefaultFunctionProps({
    environment: {
      TABLE_NAME: purchaseTable.tableName,
    },
  });

  const exposed = {
    bindings: {
      purchaseTable,
      PLOTTLAB_SESSION_JWT_SECRET,
    },
  };
  return exposed;
}
