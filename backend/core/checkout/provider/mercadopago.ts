import { Config } from 'sst/node/config';
import { Api } from 'sst/node/api';
import { v4 as uuid } from 'uuid';
// Step 1: Import the parts of the module you want to use
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

import { SnapShot } from '../types/snapshot';
const PLOTTLAB_MERCADOPAGO_APP_ACCESS_TOKEN =
  Config.PLOTTLAB_MERCADOPAGO_APP_ACCESS_TOKEN;

// Step 2: Initialize the client object
const client = new MercadoPagoConfig({
  accessToken: PLOTTLAB_MERCADOPAGO_APP_ACCESS_TOKEN,
  options: { timeout: 5000, idempotencyKey: 'abc' },
});

// Step 3: Initialize the API object
const payment = new Payment(client);

const preference = new Preference(client);

function buildItems(
  cart: SnapShot['cart']
): Parameters<typeof preference.create>[0]['body']['items'] {
  const cartsTotal = cart
    .map((shop) => Math.max(shop.TotalPrice, 0))
    .reduce((sum, curr) => sum + curr, 0);

  const itemId = uuid();

  return [
    {
      id: itemId,
      title: 'Total productos',
      quantity: 1,
      currency_id: 'CLP',
      unit_price: Math.floor(cartsTotal),
    },
  ];
}

function buildPreference(
  snapshot: SnapShot,
  { externalReference, successUrl }
): Parameters<typeof preference.create>[0] {
  return {
    body: {
      items: buildItems(snapshot.cart),
      //   shipments: buildShipments(snapshot.shops),
      payer: { email: 'gonzalo.uson@usach.cl' },
      external_reference: externalReference,
      back_urls: {
        success: successUrl,
      },
      auto_return: 'approved',
      notification_url: `${Api.CheckoutApi.url}/hooks/mercadopago?source_news=ipn`,
      marketplace_fee: 0,
    },
  };
}

// Step 6: Make the request
export async function createPaymentLink(snapshot: SnapShot) {
  const buildedPreferences = buildPreference(snapshot, {
    externalReference: snapshot.sessionId,
    successUrl: `localhost:3000/success`,
  });
  const response = await preference.create(buildedPreferences);
  console.log(response);

  return response.init_point;
}

export async function getPayment(paymentId: number) {
  return await payment.get({ id: paymentId });
}
