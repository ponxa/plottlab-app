import * as SnapShot from './models/snapshot';
import { getPayment } from './provider/mercadopago';

export { getPayment };

export const createSnapshot = SnapShot.createSnapshot;

export const createPaymentLinkAndSaveSnapshot =
  SnapShot.createPaymentLinkAndSaveSnapshot;

export const markSnapShotAsPaid = SnapShot.markSnapShotAsPaid;
