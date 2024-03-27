import { makeClient } from '@plottlab/dynamodb';
import { Table } from 'sst/node/table';

import { Orders, ordersSchema } from '../types/orders';

//* Indexes
// Indexes
const indexes = {
  primary: {
    pk: 'snapId',
  },
} as const;

//* Client
const tableName = Table.OrdersTable.tableName;

export const db = makeClient(tableName, indexes, ordersSchema.parse);

//* Functions

export async function createOrder(order: Orders) {
  return await db.create(order);
}
