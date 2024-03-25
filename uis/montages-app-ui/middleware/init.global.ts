import { usePurchase } from '../store/purchase';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) {
    // Init shopping session

    const tokenCookie = useCookie('_token');
    const { purchaseSession, sessionToken } = await useNuxtApp()
      .$trpcAPI()
      .getPurchaseSession({});

    const Purchase = usePurchase();
    Purchase.initPurchaseSession(purchaseSession);

    tokenCookie.value = sessionToken;

    //* Run inits asynchronously
  }
});
