import { makeTRPCHandler, t } from '../factory';
import { z } from 'zod';

import { Bucket } from 'sst/node/bucket';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { Function } from 'sst/node/function';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import * as Assets from '@plottlab/backend/core/assets/api';

import axios from 'axios';

const client = new LambdaClient({});

const s3Client = new S3Client({});

async function invokeClient(functionArn: string, eventBody: object) {
  const invokeCommand = new InvokeCommand({
    FunctionName: functionArn,
    Payload: Buffer.from(JSON.stringify({ body: eventBody })),
    InvocationType: 'Event',
  });

  return await client.send(invokeCommand);
}

async function signedUrl(Bucket: string, Key: string) {
  const command = new GetObjectCommand({ Bucket, Key });

  return await getSignedUrl(s3Client, command);
}

const schema = z.object({
  images: z.array(z.string()),
});
const procedure = t.procedure
  .input(schema)
  .mutation(async ({ input: { images }, ctx: {} }) => {
    const creationDate = new Date().toISOString(); // '2020-04-01T00:00:00.000Z'

    // Create a url where montages will be stored
    const pollingUrl = await signedUrl(
      Bucket.PlottMontages.bucketName,
      `${creationDate}/done.json`
    );

    // Aynchronously call core logic to create montage
    const functionName = Function.MakePlott.functionName;
    await invokeClient(functionName, {
      images,
      creationDate: creationDate,
      widthInCm: 167,
    });

    return pollingUrl;
  });

export const { handler, router } = makeTRPCHandler(procedure);
