import { z } from 'zod';
import type { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Config } from 'sst/node/config';
import * as PurchaseSession from '@plottlab/backend/core/purchase/api';

import jwt from 'jsonwebtoken';

const PLOTTLAB_SESSION_JWT_SECRET = Config.PLOTTLAB_SESSION_JWT_SECRET;
const jwtPayloadSchema = z.object({
  purchaseSessionId: z.string().optional(),
});

function parseSessionId(headers: APIGatewayProxyEventV2['headers']) {
  // get JWT Token from header

  const authHeader = headers.authorization || undefined;
  if (!authHeader) return undefined;

  if (!authHeader.startsWith('Bearer ')) throw new Error('Invalid JWT Token');

  const sessionToken = authHeader.replace('Bearer ', '');

  // Decode if present
  try {
    const payload = jwtPayloadSchema.parse(
      jwt.verify(sessionToken, PLOTTLAB_SESSION_JWT_SECRET)
    );

    return payload.purchaseSessionId;
  } catch (error) {
    throw new Error('Invalid JWT Token');
  }
}

function parseRequestData(event: APIGatewayProxyEventV2) {
  return {
    userAgent: event.requestContext.http.userAgent,
    sourceIp: event.requestContext.http.sourceIp,
    rawPath: event.rawPath,
    rawQueryString: event.rawQueryString,
  };
}

export async function createContext({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) {
  const requestData = parseRequestData(event);
  const purchaseId = parseSessionId(event.headers);

  try {
    const purchaseSession = await PurchaseSession.getOrCreate(purchaseId);
    return { purchaseSession, requestData };
  } catch (error) {}
}

export type PurchaseContext = Awaited<ReturnType<typeof createContext>>;
