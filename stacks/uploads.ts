import type { StackContext } from 'sst/constructs';
import { Bucket } from 'sst/constructs';

import * as cdk from 'aws-cdk-lib';
import { BlockPublicAccess, BucketAccessControl } from 'aws-cdk-lib/aws-s3';

export function PlottsUploadsStack({ stack, app }: StackContext) {
  //* Resources
  const shortLivedUploadsBucket = new Bucket(stack, 'shortLifeUploadBucket', {
    cors: [
      {
        allowedHeaders: ['*'],
        allowedMethods: ['PUT'],
        allowedOrigins: ['*'],
      },
    ],
    cdk: {
      bucket: {
        publicReadAccess: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
        accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,

        //! Delete uploads after 30 minutes. This is a short-lived uploads bucket!!!
        lifecycleRules: [{ expiration: cdk.Duration.days(1) }],
      },
    },
  });

  const exposed = {
    bindings: {
      shortLivedUploadsBucket,
    },
  };

  return exposed;
}
