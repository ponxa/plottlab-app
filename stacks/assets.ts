import type { StackContext } from 'sst/constructs';
import { Bucket, Table } from 'sst/constructs';

import * as lambda from 'aws-cdk-lib/aws-lambda';
import { BlockPublicAccess, BucketAccessControl } from 'aws-cdk-lib/aws-s3';

export function PlottsAssetsStack({ stack, app }: StackContext) {
  // configuration of bucket
  const assetsBucket = new Bucket(stack, 'PlottsAssets', {
    cdk: {
      bucket: {
        publicReadAccess: true,
        blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
        accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      },
    },
  });

  const sharpLayer = new lambda.LayerVersion(stack, 'SharpLayerV2', {
    code: lambda.Code.fromAsset('backend/layers/sharp/package.zip'),
  });

  const plottsTable = new Table(stack, 'plotts', {
    fields: { id: 'string' },
    primaryIndex: { partitionKey: 'id' },
  });

  const exposed = {
    sharpLayer,
    bindings: {
      assetsBucket,
      plottsTable,
    },
  };

  return exposed;
}
