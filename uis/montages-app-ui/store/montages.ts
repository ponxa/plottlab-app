import type { TRPCOutput } from '../plugins/trpc-api';

export type Montages = TRPCOutput<'createMontages'>['montageUrls'];

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

    async MakeMontages(images: string[]) {
      const montages = await useNuxtApp().$trpcAPI().makeMontage({ images });
      return montages;
    },
  },
});
