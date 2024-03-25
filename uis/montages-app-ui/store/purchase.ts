import type { TRPCOutput } from '../plugins/trpc-api';
import { useMontages } from './montages';

export type Purchase = TRPCOutput<'getPurchaseSession'>;

export const usePurchase = defineStore('purchase', {
  state: (): Purchase => ({
    purchase: {
      sessionId: '',
      userId: '',
      preCart: {
        imagesForMontage: [],
        thumbnailImagesForMontage: [],
        status: 'pending',
      },
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

      this.purchase = purchase;
    },

    async addToPreCart(image: string) {
      const purchase = await useNuxtApp().$trpcAPI().addToPreCart(image);

      this.purchase = purchase;
    },
    async removeImg(imageId: string) {
      try {
        const purchase = await useNuxtApp().$trpcAPI().removeImg({ imageId });
        console.log('purchase', purchase);

        this.purchase = purchase;
      } catch (error) {
        console.log('error', error);
      }
    },
    async addOrRemoveImg(imageId: string, copies: number) {
      try {
        const purchase = await useNuxtApp()
          .$trpcAPI()
          .updateImgCopies({ imageId, copies });
        console.log('purchase', purchase);

        this.purchase = purchase;
      } catch (error) {
        console.log('error', error);
      }
    },
  },
});
