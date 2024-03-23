import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';

import * as SnapShot from '@plottlab/backend/core/checkout/api';

async function paymentTopicHandler(paymentIdParam: string | undefined) {
  const paymentId = parseInt(paymentIdParam ?? '');
  if (isNaN(paymentId)) return { statusCode: 400 };

  const { external_reference: draftId, status: paymentStatus } =
    await SnapShot.getPayment(paymentId);

  if (!draftId || !paymentStatus) return { statusCode: 400 };

  if (paymentStatus === 'approved') await SnapShot.markSnapShotAsPaid(draftId);

  // TODO: Handle other statuses. Right now all statuses return 200
  return { statusCode: 200 };
}

async function ipnHandler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const params = event.queryStringParameters ?? {};

  switch (params.topic) {
    case 'payment':
      return await paymentTopicHandler(params.id);
    case 'merchant_order':
      // Not necessary so far, contains similar information to "payments", so only payments is handled currently
      return { statusCode: 200 };
    case 'chargebacks':
      // Not implemented. Might use for notifications to know if some payment has been cancelled
      return { statusCode: 200 };
  }

  return { statusCode: 400 };
}

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const body = JSON.parse(event.body ?? '{}');

  if (body.hasOwnProperty('resource') && body.hasOwnProperty('topic'))
    return await ipnHandler(event);

  return { statusCode: 400 };
}
