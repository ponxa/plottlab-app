import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function saveImageToS3(
  bucket: string,
  dir: string,
  filename: string,
  contentDataUrl: string
): Promise<string> {
  const contentType = contentDataUrl.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)?.[0]; //  this is non-null operator !
  const extension = contentDataUrl.match(/[^:/]\w+(?=;|,)/)?.[0]; //also is posible use /[^:/]\w+(?=;|,)/.exec?[0] ?? ''
  if (!contentType || !extension) {
    throw new Error('Data url missing contentType or extension');
  }

  const body = contentDataUrl.replace(/^data:image\/\w+;base64,/, '');

  const buffer = Buffer.from(body, 'base64');

  return await saveBufferToS3(
    bucket,
    `${dir}/${filename}.${extension}`,
    buffer,
    contentType
  );
}

export async function saveBufferToS3(
  bucket: string,
  key: string,
  base64Buffer: Buffer,
  contentType: string
): Promise<string> {
  const client = new S3Client({});

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: base64Buffer,
    ContentType: contentType,
  });
  await client.send(command);

  const { url } = client.config.endpointProvider({
    Bucket: bucket,
    Region: await client.config.region(),
  });
  return `${url.protocol}//${url.hostname}/${key}`;
}
