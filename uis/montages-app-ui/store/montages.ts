import type { TRPCOutput } from '../plugins/trpc-api';
import type { Purchase } from './purchase';

export type Montages = TRPCOutput<'createMontages'>['montageUrls'];
export type preCart = Purchase['preCart'];

interface MontagesState {
  montages: Montages;
}

export const useMontages = defineStore('montages', {
  state: (): MontagesState => ({
    montages: {
      createdAt: '',
      id: '',
      montagesUrls: [],
      thumbnailsUrls: [],
    },
  }),
  actions: {
    async saveMontages(images: string[]) {
      const montages = await useNuxtApp().$trpcAPI().createMontages(images);
      this.montages = montages.montageUrls;

      return montages;
    },

    async MakeMontages(strings: stringÑ[]) {
      console.log('preCart', preCart);
      try {
        const montages = await useNuxtApp().$trpcAPI().makeMontage({ images });
        return montages;

        console.log('images', images);
      } catch (error) {
        console.log('error', error);
      }
    },
  },
});
