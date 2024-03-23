import { StackContext, Table } from 'sst/constructs';

export function PlottsOrdersStack({ stack, app }: StackContext) {
  const ordersTable = new Table(stack, 'OrdersTable', {
    fields: {
      orderId: 'string',
    },
    primaryIndex: { partitionKey: 'orderId' },
  });
  const exponsed = {
    bindings: {
      ordersTable,
    },
  };
  return exponsed;
}
