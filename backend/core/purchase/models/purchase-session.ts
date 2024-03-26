import { v4 as uuid } from 'uuid';

import { makeClient } from '@plottlab/dynamodb';
import { Table } from 'sst/node/table';

import {
  PurchaseSession,
  purchaseSessionSchema,
  PlotterMontages,
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
      generatedMontages: {
        montagesUrls: [],
        thumbnailsUrls: [],
        totalPrice: 0,
        totalMeters: 0,
        pricePerMeter: 5000,
        pickUpDays: 2,
      },
    },
    customer: {
      companyName: undefined,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      phone: undefined,
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
    generatedMontages: session.preCart.generatedMontages,
  };

  session.updatedAt = new Date().toISOString();
  // debuggin log

  return await update(session);
};

export const updateCustomer = async (
  sessionId: string,
  customer: PurchaseSession['customer']
) => {
  console.log('customer backend model', customer);
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

export const updateGeneratedMontages = async (
  sessionId: string,
  generatedMontages: PlotterMontages
) => {
  const session = await db.get(sessionId);

  const pixelsToMeters = (pixels: number, dpi: number) => {
    return (pixels / dpi) * 0.0254;
  };
  const roundToCentecima = (meters: number) => {
    return Math.round(meters * 100) / 100;
  };
  const totalPrice =
    generatedMontages.thumbnailsUrls
      .map((i) => pixelsToMeters(i.realDimensions.height, 150))
      .reduce((a, b) => a + b) *
    session.preCart.generatedMontages.pricePerMeter;

  session.preCart.generatedMontages = {
    ...generatedMontages,
    totalPrice: Math.ceil(totalPrice / 100) * 100,
    totalMeters: roundToCentecima(
      generatedMontages.thumbnailsUrls
        .map((i) => pixelsToMeters(i.realDimensions.height, 150))
        .reduce((a, b) => a + b)
    ),

    pricePerMeter: session.preCart.generatedMontages.pricePerMeter,
    pickUpDays: session.preCart.generatedMontages.pickUpDays,
  };

  return await update(session);
};

export const removeGeneratedMontages = async (sessionId: string) => {
  const session = await db.get(sessionId);

  session.preCart.generatedMontages = {
    montagesUrls: [],
    thumbnailsUrls: [],
    totalPrice: 0,
    totalMeters: 0,
    pricePerMeter: 5000,
    pickUpDays: 2,
  };

  return await update(session);
};
