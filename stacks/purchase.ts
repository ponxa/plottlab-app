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
