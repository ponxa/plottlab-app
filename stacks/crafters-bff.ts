import { StackContext, Api, use } from 'sst/constructs';
import { PlottsAssetsStack } from './assets';
import { PlottsUploadsStack } from './uploads';
import { PlottMontagesStack } from './montages';
import { PlottPurchaseStack } from './purchase';
import { PlottlabCheckoutStack } from './checkout';

export function PlottsCraftersBffStack({ stack, app }: StackContext) {
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
  const craftersApi = new Api(this, 'PlottsCraftersBff', {
    routes: {
      'POST /trpc/getAllOrders/{proxy+}': {
        function: {
          handler:
            'backend/functions/crafters-trpc/routers/getAllOrders.handler',
          timeout: 30,
        },
      },
    },
  });
  // Show the API endpoint in output
  stack.addOutputs({
    TRPCEndpoint: craftersApi.url,
  });

  return {
    shoppingApiTRPCEndpoint: `${craftersApi.url}/trpc`,
  };
}
