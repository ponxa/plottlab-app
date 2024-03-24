import { v4 as uuid } from 'uuid';

import { makeClient } from '@plottlab/dynamodb';
import { Table } from 'sst/node/table';

import { snapShotSchema } from '../types/snapshot';

import { PurchaseSession } from '@plottlab/backend/core/purchase/types/purchase-session';
import { createPaymentLink } from '../provider/mercadopago';

//* Indexes
// Indexes
const indexes = {
  primary: {
    pk: 'snapId',
  },
} as const;

//* Client
const tableName = Table.SnapshotTable.tableName;

export const db = makeClient(tableName, indexes, snapShotSchema.parse);

//* Functions

export async function createSnapshot(snap: PurchaseSession) {
  const item = {
    ...snap,
    snapId: uuid(),
    snapCreatedAt: new Date().toISOString(),
  };
  return await db.create(item);
}

export async function createPaymentLinkAndSaveSnapshot(snap: PurchaseSession) {
  const snapShot = await createSnapshot(snap);
  const paymentLink = await createPaymentLink(snapShot);
  return { ...snapShot, paymentLink };
}

export async function markSnapShotAsPaid(snapId: string) {
  const snap = await db.get({ snapId });
  if (!snap) throw new Error('Snapshot not found');

  snap.status = 'completed';
  const order = await db.putUpdate(snap);
  return order;
}
