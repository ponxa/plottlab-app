import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { Bucket } from 'sst/node/bucket';

export async function getShortLivedS3PutObjectUrl(
  filename: string,
  contentType: string
): Promise<string> {
  const client = new S3Client({});

  const command = new PutObjectCommand({
    Bucket: Bucket.shortLifeUploadBucket.bucketName,
    Key: `${new Date().toISOString()}/${filename}`,
    ContentType: contentType,
  });

  return await getSignedUrl(client, command);
}
