import type { StackContext } from 'sst/constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Bucket, Function } from 'sst/constructs';

export function PlottMontagesStack({ stack, app }: StackContext) {
  //* Resources
  const montagesBucket = new Bucket(stack, 'PlottMontages', {
    cors: [
      {
        allowedHeaders: ['*'],
        allowedMethods: ['GET'],
        allowedOrigins: ['*'],
      },
    ],
    cdk: {
      bucket: {
        publicReadAccess: true,
      },
    },
  });

  // const montagesLayer = new lambda.LayerVersion(stack, 'PlottLayer', {
  //   code: lambda.Code.fromAsset('backend/layers/montages'),
  // });

  stack.setDefaultFunctionProps({
    bind: [montagesBucket],
  });

  // * lambda functions
  const applyEffectsToImageFromUrl = new Function(
    stack,
    'ApplyEffectsToImageFromUrlV3',
    {
      handler:
        'backend/functions/invoke/montages/applyEffectsToImageFromUrl.handler',
      runtime: 'python3.10',
      memorySize: 2048,
      timeout: 20,
      layers: [
        'arn:aws:lambda:sa-east-1:770693421928:layer:Klayers-p310-Pillow:6',
        'arn:aws:lambda:sa-east-1:770693421928:layer:Klayers-p310-numpy:8',
      ],
      environment: {
        MONTAGES_BUCKET_NAME: montagesBucket.bucketName,
      },
    }
  );

  const getImageDimensionsWithLabelFromUrl = new Function(
    stack,
    'GetImageDimensionsWithLabelFromUrlV3',
    {
      handler:
        'backend/functions/invoke/montages/getImageDimensionsWithLabelFromUrl.handler',
      runtime: 'python3.10',
      layers: [
        'arn:aws:lambda:sa-east-1:770693421928:layer:Klayers-p310-Pillow:6',
        'arn:aws:lambda:sa-east-1:770693421928:layer:Klayers-p310-numpy:8',
      ],
    }
  );

  const makeSheetFromRects = new Function(stack, 'MakeSheetFromRectsV3', {
    handler: 'backend/functions/invoke/montages/makeSheetFromRects.handler',
    runtime: 'python3.10',
    timeout: 60,
    memorySize: 3008,
    layers: [
      'arn:aws:lambda:sa-east-1:770693421928:layer:Klayers-p310-Pillow:6',
      'arn:aws:lambda:sa-east-1:770693421928:layer:Klayers-p310-numpy:8',
    ],
    environment: {
      APPLY_EFFECTS_TO_IMAGE_URL_NAME: applyEffectsToImageFromUrl.functionName,
      MONTAGES_BUCKET_NAME: montagesBucket.bucketName,
    },
    bind: [applyEffectsToImageFromUrl],
  });

  const makeSheetsFromImages = new Function(stack, 'MakeSheetsFromImagesV3', {
    handler: 'backend/functions/invoke/montages/makeSheetsFromImages.handler',
    runtime: 'python3.10',
    timeout: 60,
    layers: [
      'arn:aws:lambda:sa-east-1:770693421928:layer:Klayers-p310-Pillow:6',
      'arn:aws:lambda:sa-east-1:770693421928:layer:Klayers-p310-numpy:8',
    ],
    environment: {
      MAKE_SHEET_FROM_RECT_NAME: makeSheetFromRects.functionName,
    },
    bind: [makeSheetFromRects],
  });

  const makeMontage = new Function(stack, 'MakePlott', {
    handler: 'backend/functions/invoke/montages/makeMontage.handler',
    timeout: 60,
    bind: [getImageDimensionsWithLabelFromUrl, makeSheetsFromImages],
  });

  const exposed = {
    bindings: {
      montagesBucket,
      makeMontage,
    },
  };

  return exposed;
}
