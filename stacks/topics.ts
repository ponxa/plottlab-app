import { StackContext } from 'sst/constructs';
import { use } from 'sst/constructs';

import { PlottlabCheckoutStack } from './checkout';

export function PlottTopicsStack({ stack, app }: StackContext) {
  //* Environment + Permissions
  const permissions = [];

  //* Functions

  const externalBindings = Object.values({
    ...use(PlottlabCheckoutStack).bindings,
  });
  stack.setDefaultFunctionProps({
    permissions,
    bind: [...externalBindings],
  });

  const { snapShopPaidTopic } = use(PlottlabCheckoutStack).bindings;
  snapShopPaidTopic.addSubscribers(stack, {
    createOrders: {
      function: {
        handler: 'backend/functions/topics/SNAP_ORDER_PAID/createOrder.handler',
      },
    },
  });
}
