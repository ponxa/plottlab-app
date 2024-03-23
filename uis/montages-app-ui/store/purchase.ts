import type { TRPCOutput } from '../plugins/trpc-api';
import { useMontages } from './montages';

export type Purchase = TRPCOutput<'getPurchaseSession'>;

export const usePurchase = defineStore('purchase', {
  state: (): Purchase => ({
    purchase: {
      sessionId: '',
      userId: '',
      cart: [
        {
          montages: {
            id: '',
            montagesUrls: [],
            createdAt: '',
            thumbnailsUrls: [],
          },
          pricePerMeter: 0,
          TotalMeters: 0,
          TotalPrice: 0,
        },
      ],
      createdAt: '',
      updatedAt: '',
      expiresAt: '',
      status: '',
    },
  }),
  actions: {
    initPurchaseSession(purchase: Purchase) {
      this.purchase = purchase;
    },
    async addToCart(TotalMeters: number, TotalPrice: number) {
      const Montages = useMontages();
      const montages = Montages.montages;

      const purchase = await useNuxtApp()
        .$trpcAPI()
        .addToCart({
          cart: [{ montages, TotalMeters, TotalPrice }],
        });
      console.log('purchase', purchase);
      this.purchase = purchase;
    },
  },
});
