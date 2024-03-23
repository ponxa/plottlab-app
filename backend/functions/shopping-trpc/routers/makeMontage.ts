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

async function pollMontageUrls(pollingUrl: string) {
  async function pollingLoop() {
    let response;
    try {
      response = await axios.get(pollingUrl);
      return response.data;
    } catch (error) {
      if (error.isAxiosError) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return await pollingLoop();
      } else throw error;
    }
  }
  const { montageUrls } = await pollingLoop();
  return montageUrls;
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

    // Poll for the montages
    // const montageUrls = await pollMontageUrls(pollingUrl);

    return pollingUrl;

    // // Store the montages in the database
    // try {
    //   return await Assets.savePlotts(montageUrls);
    // } catch (error) {
    //   console.error('Error saving montages to database', error);
    //   throw new Error('Error saving montages to database');
    // }
  });

export const { handler, router } = makeTRPCHandler(procedure);
