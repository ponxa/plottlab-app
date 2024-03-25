import type { TRPCOutput } from '../plugins/trpc-api';
import { useMontages } from './montages';
import axios from 'axios';

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
  getters: {
    isFileSelected: (state) =>
      state.purchase.preCart.imagesForMontage.length > 0,
    isMontageGenerated: (state) =>
      state.purchase.preCart.generatedMontages.montagesUrls.length > 0,
  },
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

    async addToPreCart(files: File[]) {
      const eventFiles = Array.from(files) as File[];

      eventFiles.forEach(async (image) => {
        const filename = image?.name;
        const contentType = image?.type;
        const s3Uploadurl = await useNuxtApp().$trpcAPI().getShortLifeUrl({
          filename,
          contentType,
        });

        await axios.put(s3Uploadurl, image, {
          headers: {
            'Content-Type': contentType,
          },
        });

        const s3Url = s3Uploadurl.split('?')[0];
        const purchase = await useNuxtApp().$trpcAPI().addToPreCart(s3Url);
        this.purchase = purchase;
      });
    },
    async removeImg(imageId: string) {
      const purchase = await useNuxtApp().$trpcAPI().removeImg({ imageId });

      this.purchase = purchase;
    },
    async addOrRemoveImg(imageId: string, copies: number) {
      const purchase = await useNuxtApp()
        .$trpcAPI()
        .updateImgCopies({ imageId, copies });

      this.purchase = purchase;
    },
    async updateGeneratedMontages(montages) {
      const purchase = await useNuxtApp()
        .$trpcAPI()
        .updateGeneratedMontages(montages);

      this.purchase = purchase;
    },
  },
});
