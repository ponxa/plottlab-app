import { v4 as uuid } from 'uuid';

import { makeClient } from '@plottlab/dynamodb';
import { Table } from 'sst/node/table';

import {
  PurchaseSession,
  purchaseSessionSchema,
} from '../types/purchase-session';

//* Indexes
// Indexes
const indexes = {
  primary: {
    pk: 'sessionId',
  },
} as const;

//* Client
const tableName = Table.PurchaseTable.tableName;

export const db = makeClient(tableName, indexes, purchaseSessionSchema.parse);

export const create = async (sessionId: string) => {
  const userId = uuid();
  const session: PurchaseSession = {
    sessionId: uuid(),
    userId, //? <-- This is the user id
    cart: [],
    preCart: {
      imagesForMontage: [],
      thumbnailImagesForMontage: [],
      status: 'pending',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days
    status: 'active',
  };

  return await db.create(session);
};

export const update = async (session: PurchaseSession) => {
  return await db.putUpdate(session);
};

export const getOrCreate = async (sessionId: string) => {
  try {
    return await db.get(sessionId);
  } catch (error) {
    return await create(sessionId);
  }
};

export const updateCart = async (
  sessionId: string,
  cart: PurchaseSession['cart']
) => {
  const session = await db.get(sessionId);

  session.cart.push(...cart); // Spread the cart items into the session.cart array
  session.updatedAt = new Date().toISOString();
  return await update(session);
};

export const updatePreCart = async (
  sessionId: string,
  preCart: PurchaseSession['preCart']
) => {
  const session = await db.get(sessionId);

  //   imagesForMontage: [
  //     {
  //       rawSizeUrl: 'https://my-plottlab-mixlab-plottm-plottmontagesbucketa2061-9cx6xnsib5ut.s3.sa-east-1.amazonaws.com/plotts/rawSizes/01e32b54-54ca-4972-a9c2-5e1169c9f9bd.jpeg',
  //       versionsCount: 1
  //     }
  //   ],
  //   thumbnailImagesForMontage: [
  //     {
  //       thumbnailUrl: 'https://my-plottlab-mixlab-plottm-plottmontagesbucketa2061-9cx6xnsib5ut.s3.sa-east-1.amazonaws.com/plotts/thumbnails/3a52884d-714c-42b5-b747-fea72d633651.jpeg',
  //       versionsCount: 1
  //     }
  //   ],
  //   status: 'pending'
  // }

  session.preCart = {
    imagesForMontage: session.preCart.imagesForMontage.concat(
      preCart.imagesForMontage
    ),
    thumbnailImagesForMontage: session.preCart.thumbnailImagesForMontage.concat(
      preCart.thumbnailImagesForMontage
    ),
    status: preCart.status,
  };

  session.updatedAt = new Date().toISOString();
  // debuggin log

  return await update(session);
};

export const updateCustomer = async (
  sessionId: string,
  customer: PurchaseSession['customer']
) => {
  const session = await db.get(sessionId);
  session.customer = customer;
  session.updatedAt = new Date().toISOString();
  return await update(session);
};
