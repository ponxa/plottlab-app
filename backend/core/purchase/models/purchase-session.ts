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

export const removeImgFromPrecart = async (
  sessionId: string,
  imageId: string
) => {
  const session = await db.get(sessionId);

  session.preCart.imagesForMontage = session.preCart.imagesForMontage.filter(
    (img) => img.id !== imageId
  );
  session.preCart.thumbnailImagesForMontage =
    session.preCart.thumbnailImagesForMontage.filter(
      (img) => img.id !== imageId
    );

  session.updatedAt = new Date().toISOString();
  return await update(session);
};

export const updateImgCopies = async (
  sessionId: string,
  imageId: string,
  copies: number
) => {
  const session = await db.get(sessionId);

  const image = session.preCart.imagesForMontage.find(
    (img) => img.id === imageId
  );
  const thumbnailImage = session.preCart.thumbnailImagesForMontage.find(
    (img) => img.id === imageId
  );

  if (image && thumbnailImage) {
    image.copies = copies;
    thumbnailImage.copies = copies;
  }

  session.updatedAt = new Date().toISOString();

  return await update(session);
};
