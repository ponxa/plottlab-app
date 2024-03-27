import { StackContext } from 'sst/constructs';
import { use } from 'sst/constructs';

import { PlottlabCheckoutStack } from './checkout';

export function PlottLabTopicsStack({ stack, app }: StackContext) {
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

  const { snapShotPaidTopic } = use(PlottlabCheckoutStack).bindings;
  snapShotPaidTopic.addSubscribers(stack, {
    createOrder: {
      function: {
        handler: 'backend/functions/topics/SNAP_ORDER_PAID/createOrder.handler',
      },
    },
  });
}
