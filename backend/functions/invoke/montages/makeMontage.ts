import { APIGatewayProxyResultV2 } from 'aws-lambda';

import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { Function } from 'sst/node/function';

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { Bucket } from 'sst/node/bucket';

import { z } from 'zod';

const lambda = new LambdaClient({});
const s3 = new S3Client({});

async function invokeClient(functionName: string, eventBody: object) {
  const invokeCommand = new InvokeCommand({
    FunctionName: functionName,
    Payload: Buffer.from(JSON.stringify({ body: eventBody })),
  });

  const response = await lambda.send(invokeCommand);

  const payloadDecoded = new TextDecoder().decode(response.Payload);

  const payload = JSON.parse(payloadDecoded) as Payload;

  if (typeof payload.body !== 'string') throw new Error('No body on payload');
  return JSON.parse(payload.body) as unknown;
}

async function putObject(bucket: string, key: string, body: string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
  });

  return await s3.send(command);
}

async function listObjects(bucket: string, prefix: string) {
  const command = new ListObjectsCommand({
    Bucket: bucket,
    Delimiter: '/',
    Prefix: prefix,
  });

  return await s3.send(command);
}
async function deleteObject(bucket: string, key: string) {
  const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });

  return await s3.send(command);
}

const schema = z.object({
  creationDate: z.string(),

  images: z.array(z.string()),
  widthInCm: z.number(),
});

type LambdaInvokeEvent = { body: unknown };

//*
//* Handler
//*

export async function handler(
  event: LambdaInvokeEvent
): Promise<APIGatewayProxyResultV2> {
  console.log('Event:', event);
  const body = schema.parse(event.body);

  const { creationDate, images, widthInCm } = body;

  // Fetch orders in itemEnhanced status (those where at least one item has been enhanced)

  // Create array of relevant image data for montage
  // Keep only items in itemEnhanced status (that has a croppedEnhancedFileUrl)
  const allImgs = images.map((img: string) => ({
    url: img,
    qty: 1,
    shape: undefined,
    mean_rgb: undefined,
  }));

  // Get images dimensions
  await Promise.all(
    allImgs.map(async (img) => {
      const { width, height, mean_rgb } = (await invokeClient(
        Function.GetImageDimensionsWithLabelFromUrlV3.functionName,
        {
          url: img.url,
        }
      )) as DimResponseType;
      img.shape = [width, height];
      img.mean_rgb = mean_rgb;
    })
  );

  const widthInPx = (widthInCm / 2.54) * 150;
  const fitableImgs = allImgs.filter(
    (img) => img.shape && (img.shape[0] < widthInPx || img.shape[1] < widthInPx)
  );

  // Get montages urls
  const { montageUrls } = (await invokeClient(
    Function.MakeSheetsFromImagesV3.functionName,
    {
      imgs: fitableImgs,
      creation_date: creationDate,
      strip_width_in_cm: widthInCm,
    }
  )) as MakeSheetsType;

  // Upload done.json
  await putObject(
    Bucket.PlottMontages.bucketName,
    `${creationDate}/done.json`,
    JSON.stringify({
      montageUrls,
    })
  );

  // Delete single images
  const { Contents } = await listObjects(
    Bucket.PlottMontages.bucketName,
    `${creationDate}/singles/`
  );
  if (!Contents) throw new Error('Dont exists Content related for this s3');

  await Promise.all(
    Contents.map(async ({ Key }) => {
      if (Key) await deleteObject(Bucket.PlottMontages.bucketName, Key);
    })
  );

  return { statusCode: 200, body: JSON.stringify({ montageUrls }) };
}

type MakeSheetsType = {
  montageUrls: string[];
};

type DimResponseType = {
  width: number;
  height: number;
  mean_rgb: number;
};

type ImgPackingType = {
  // Strip packing and sheet rendering
  url?: string;
  qty: number;

  // Order and information management
  order_id: string;
  order_id_short: string;
  item_id: string;
  item_title: string;
  shipping_comune?: string;
  shape?: [number, number];
  mean_rgb?: number;
};

type Payload = { body: string | undefined; statusCode: number | undefined };
