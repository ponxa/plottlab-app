import * as PurchaseSession from './models/purchase-session';

export const getOrCreate = PurchaseSession.getOrCreate;

export const updatePurchaseSession = PurchaseSession.update;

export const updateCart = PurchaseSession.updateCart;

export const updateCustomers = PurchaseSession.updateCustomer;

export const updatePreCart = PurchaseSession.updatePreCart;

export const removeImg = PurchaseSession.removeImgFromPrecart;

export const updateImgCopies = PurchaseSession.updateImgCopies;

export const generatedMontages = PurchaseSession.updateGeneratedMontages;

export const removeGeneratedMontages = PurchaseSession.removeGeneratedMontages;
