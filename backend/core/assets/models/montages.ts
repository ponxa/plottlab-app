import { makeClient } from '@plottlab/dynamodb';
import { Table } from 'sst/node/table';
import { saveImageToS3 } from '@plottlab/s3-utils';
import { Bucket } from 'sst/node/bucket';

import {
  makeThumbnail,
  getDimsFromAnyUrl,
  dataUrlFromUrl,
} from '@plottlab/image-utils';

import { v4 as uuid } from 'uuid';
import { PlotterMontagesSchema, PlotterMontages } from '../types/montages';
//* Indexes
const indexes = {
  primary: {
    pk: 'id',
  },
} as const; //? <-- Better index type inference

//* Client
const tableName = Table.plotts.tableName;
const bucketName = Bucket.PlottMontages.bucketName;
export const db = makeClient(tableName, indexes, PlotterMontagesSchema.parse);

export async function savePlottsToS3AndMakeThumbnail(
  urls: string[],
  id: string
) {
  let imagesRawSizes = await Promise.all(
    urls.map(async (url) => {
      const versionId = uuid();

      return {
        url: url,
        versionId,
      };
    })
  );
  let imagesThumbnails = await Promise.all(
    imagesRawSizes.map(async (image) => {
      const thumbnail = await makeThumbnail(image.url, 'jpeg', 1000);
      const [width, height] = await getDimsFromAnyUrl(image.url);
      const dataUrl = await dataUrlFromUrl(thumbnail);
      const thumbnailUrl = await saveImageToS3(
        bucketName,
        `plotts/thumbnails/${id}`,
        image.versionId,
        dataUrl
      );
      return {
        url: thumbnailUrl,
        versionId: image.versionId,
        realDimensions: { width, height },
      };
    })
  );

  return { imagesRawSizes, imagesThumbnails };
}

export async function create(urls: string[]) {
  const id = uuid();
  const { imagesRawSizes, imagesThumbnails } =
    await savePlottsToS3AndMakeThumbnail(urls, id);

  const item = {
    id,
    createdAt: new Date().toISOString(),
    montagesUrls: imagesRawSizes,
    thumbnailsUrls: imagesThumbnails,
  };

  return await db.create(item);
}

async function saveRawSizeToS3(url: string) {
  const versionId = uuid();
  const dataUrl = await dataUrlFromUrl(url);
  const rawSizeUrl = await saveImageToS3(
    bucketName,
    `plotts/rawSizes`,
    versionId,
    dataUrl
  );
  return { rawSizeUrl };
}

export async function makeThumbnailFromUrlAndSaveToS3(url: string) {
  const versionId = uuid();
  const thumbnailPromise = makeThumbnail(url, 'jpeg', 1000);
  const rawSizeImagePromise = saveRawSizeToS3(url);

  const [thumbnail, rawSizeImage] = await Promise.all([
    thumbnailPromise,
    rawSizeImagePromise,
  ]);

  const dataUrl = await dataUrlFromUrl(thumbnail);
  const thumbnailUrl = await saveImageToS3(
    bucketName,
    `plotts/thumbnails`,
    versionId,
    dataUrl
  );

  return {
    rawSizeImage,
    thumbnailUrl,
  };
}
