import { StackContext, Api, use } from 'sst/constructs';
import { PlottsAssetsStack } from './assets';
import { PlottsUploadsStack } from './uploads';
import { PlottMontagesStack } from './montages';
import { PlottPurchaseStack } from './purchase';
import { PlottlabCheckoutStack } from './checkout';

export function PlottsPurchaseBffStack({ stack, app }: StackContext) {
  const externalBindings = Object.values({
    ...use(PlottsAssetsStack).bindings,
    ...use(PlottsUploadsStack).bindings,
    ...use(PlottMontagesStack).bindings,
    ...use(PlottPurchaseStack).bindings,
    ...use(PlottlabCheckoutStack).bindings,
  });

  //* Functions
  stack.setDefaultFunctionProps({
    bind: externalBindings,
  });
  const shoppingApi = new Api(this, 'PlottsPurchaseBff', {
    routes: {
      'POST  /trpc/makeMontage/{proxy+}': {
        function: {
          handler:
            'backend/functions/shopping-trpc/routers/makeMontage.handler',
          timeout: 200,
          memorySize: 3008,
          // layers: [use(PlottsAssetsStack).sharpLayer],
        },
      },
      'POST  /trpc/getShortLifeUrl/{proxy+}': {
        function: {
          handler:
            'backend/functions/shopping-trpc/routers/getShortLifeUrl.handler',
          timeout: 30,
        },
      },
      'POST  /trpc/createMontages/{proxy+}': {
        function: {
          handler:
            'backend/functions/shopping-trpc/routers/createMontages.handler',
          timeout: 200,
          // memorySize: 3008,
          layers: [use(PlottsAssetsStack).sharpLayer],
        },
      },
      'POST /trpc/getPurchaseSession/{proxy+}': {
        function: {
          handler:
            'backend/functions/shopping-trpc/routers/getPurchaseSession.handler',
          timeout: 30,
        },
      },
      'POST /trpc/addToCart/{proxy+}': {
        function: {
          handler: 'backend/functions/shopping-trpc/routers/addToCart.handler',
          timeout: 30,
        },
      },
      'POST /trpc/addCustomer/{proxy+}': {
        function: {
          handler:
            'backend/functions/shopping-trpc/routers/addCustomer.handler',
          timeout: 30,
        },
      },
      'POST /trpc/geyPaymentLink/{proxy+}': {
        function: {
          handler:
            'backend/functions/shopping-trpc/routers/geyPaymentLink.handler',
          timeout: 30,
        },
      },
      'POST /trpc/makeThumbnails/{proxy+}': {
        function: {
          handler:
            'backend/functions/shopping-trpc/routers/makeThumbnails.handler',
          timeout: 30,
          layers: [use(PlottsAssetsStack).sharpLayer],
        },
      },
      'POST /trpc/addToPreCart/{proxy+}': {
        function: {
          handler:
            'backend/functions/shopping-trpc/routers/addToPreCart.handler',
          timeout: 30,
          layers: [use(PlottsAssetsStack).sharpLayer],
        },
      },

      'POST /trpc/removeImg/{proxy+}': {
        function: {
          handler: 'backend/functions/shopping-trpc/routers/removeImg.handler',
          timeout: 30,
        },
      },
      'POST /trpc/updateImgCopies/{proxy+}': {
        function: {
          handler:
            'backend/functions/shopping-trpc/routers/updateImgCopies.handler',
          timeout: 30,
        },
      },
    },
  });
  // Show the API endpoint in output
  stack.addOutputs({
    TRPCEndpoint: shoppingApi.url,
  });

  return {
    shoppingApiTRPCEndpoint: `${shoppingApi.url}/trpc`,
  };
}
