import { t } from '../factory';
import * as getAllOrders from '../routers/getAllOrders';
// this object is not actually used - we just use it to combine the two servers
const combinedRouter = t.router({
  getAllOrders: getAllOrders.router,

  // ...otherRouters
});

export type CombinedRouter = typeof combinedRouter;
