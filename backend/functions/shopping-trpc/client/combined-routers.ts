import { t } from '../factory';

import * as makeMontage from '../routers/makeMontage';
import * as shortLifeUrl from '../routers/getShortLifeUrl';
import * as createMontages from '../routers/createMontages';
import * as getPurchaseSession from '../routers/getPurchaseSession';
import * as addToCart from '../routers/addToCart';
import * as addCustomer from '../routers/addCustomer';
import * as geyPaymentLink from '../routers/geyPaymentLink';

import * as addToPreCart from '../routers/addToPreCart';
import * as removeImg from '../routers/removeImg';
import * as updateImgCopies from '../routers/updateImgCopies';
import * as updateGeneratedMontages from '../routers/updateGeneratedMontages';
import * as removeGeneratedMontages from '../routers/removeGeneratedMontages';

// this object is not actually used - we just use it to combine the two servers
const combinedRouter = t.router({
  makeMontage: makeMontage.router,
  getShortLifeUrl: shortLifeUrl.router,
  createMontages: createMontages.router,
  getPurchaseSession: getPurchaseSession.router,
  addToCart: addToCart.router,
  addCustomer: addCustomer.router,
  geyPaymentLink: geyPaymentLink.router,

  addToPreCart: addToPreCart.router,
  removeImg: removeImg.router,
  updateImgCopies: updateImgCopies.router,
  updateGeneratedMontages: updateGeneratedMontages.router,
  removeGeneratedMontages: removeGeneratedMontages.router,
  // ...otherRouters
});

export type CombinedRouter = typeof combinedRouter;
