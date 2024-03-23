import sharp from '../esm-sharp/index.mjs';
import fetch from 'node-fetch';

function sharpAutoRotated(buffer: Buffer) {
  const options = { limitInputPixels: false };
  return sharp(buffer, options).rotate();
}

export function isDataUrl(s: string): boolean {
  const regex =
    /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
  return !!s.match(regex);
}
function arrayBufferToBuffer(arrBuffer: ArrayBuffer): Buffer {
  return Buffer.from(new Uint8Array(arrBuffer));
}
async function getImageBufferFromUrl(imageUrl: string): Promise<Buffer> {
  const response = await fetch(imageUrl);
  const buffer = arrayBufferToBuffer(await response.arrayBuffer());
  return buffer;
}

function getImageBufferFromDataUrl(imageDataUrl: string): Buffer {
  const body = imageDataUrl.split(';base64,')[1];
  if (!body) throw new Error('dataUrl is undefined');

  const buffer = Buffer.from(body, 'base64');
  return buffer;
}

export async function getImageBufferFromAnyUrl(url: string): Promise<Buffer> {
  const buffer = isDataUrl(url)
    ? getImageBufferFromDataUrl(url)
    : await getImageBufferFromUrl(url);
  return buffer;
}

function dataUrlFromBuffer(buffer: Buffer, contentType: string): string {
  return `data:${contentType};base64,${buffer.toString('base64')}`;
}

export async function dataUrlFromUrl(url: string): Promise<string> {
  // Download image and serialize into dataUrl
  const response = await fetch(url);
  const buffer = arrayBufferToBuffer(await response.arrayBuffer());
  const contentType = response.headers.get('content-type');

  if (!contentType) throw new Error('Invalid content-type');

  return dataUrlFromBuffer(buffer, contentType);
}

export async function makeThumbnail(
  imgUrl: string,
  format: 'jpeg' | 'png',
  maxDim: number = 1000
) {
  const imgBuffer = await getImageBufferFromAnyUrl(imgUrl);

  const [imgWidth, imgHeight] = await getDimsFromBuffer(imgBuffer);

  let thumbBuffer: Buffer;
  if (imgWidth > maxDim || imgHeight > maxDim) {
    thumbBuffer = await sharpAutoRotated(imgBuffer)
      .resize(imgWidth > imgHeight ? { width: maxDim } : { height: maxDim })
      .toBuffer();
  } else {
    thumbBuffer = imgBuffer;
  }

  thumbBuffer = await sharpAutoRotated(thumbBuffer)
    .toFormat(format, { quality: 70 })
    .toBuffer();

  return dataUrlFromBuffer(thumbBuffer, `image/${format}`);
}

async function getDimsFromBuffer(buffer: Buffer): Promise<[number, number]> {
  const options = { limitInputPixels: false };
  const metadata = await sharp(buffer, options).metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  const orientation = metadata.orientation ?? 0;

  // EXIF Orientation is absolutely absurd: https://sirv.com/help/articles/rotate-photos-to-be-upright/
  // Values greater than 5 are rotated in a way equivalent to 90 degrees
  return orientation >= 5 ? [height, width] : [width, height];
}

export async function getDimsFromAnyUrl(
  url: string
): Promise<[number, number]> {
  return await getImageBufferFromAnyUrl(url).then((imgBuffer) =>
    getDimsFromBuffer(imgBuffer)
  );
}
