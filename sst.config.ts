import { SSTConfig } from 'sst';

import { PlottMontagesStack } from './stacks/montages';
import { PlottsPurchaseBffStack } from './stacks/purchase-bff';
import { PlottsAssetsStack } from './stacks/assets';
import { PlottsUploadsStack } from './stacks/uploads';
import { PlottPurchaseStack } from './stacks/purchase';
import { PlottlabCheckoutStack } from './stacks/checkout';
import { PlottsOrdersStack } from './stacks/orders';

export default {
  config(input) {
    const PROFILE: Record<string, string> = {
      default: 'my-plottlab',
      test: 'plottlab-test',
      prod: 'plottlab-prod',
    };

    console.log(PROFILE[input.stage || 'default']);

    return {
      name: 'mixlab',
      region: 'sa-east-1',
      profile: PROFILE[input.stage || 'default'],
    };
  },

  stacks(app) {
    // Stack shared domains first
    app.setDefaultFunctionProps({
      runtime: 'nodejs18.x',
      memorySize: 512,
      nodejs: {
        esbuild: {
          bundle: true,
          external: ['sharp'],
          format: 'esm',
        },
      },
    });

    app
      .stack(PlottMontagesStack)
      .stack(PlottsUploadsStack)
      .stack(PlottsAssetsStack)
      .stack(PlottPurchaseStack)
      .stack(PlottsOrdersStack)
      .stack(PlottlabCheckoutStack)
      .stack(PlottsPurchaseBffStack);
  },
} satisfies SSTConfig;
