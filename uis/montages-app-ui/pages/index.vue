<script lang="ts" setup>
import { ref } from 'vue';
import type { TRPCOutput } from '../plugins/trpc-api';
import axios from 'axios';

import { pixelsToMeters } from '../lib/utils';

import { useMontages } from '~/store/montages';

import { usePurchase } from '~/store/purchase';
import type { Purchase } from '~/store/purchase';

type Montages = TRPCOutput<'createMontages'>;
const Purchase = usePurchase();
const Montages = useMontages();

const images = ref<string[]>([]);

const loading = ref(false);

const handleFiles = async (event: HTMLInputElement) => {
  //* load images into s3 bucket and return s3 url

  if (!event.files) return;
  if (event.files.length === 0) return;

  const eventFiles = Array.from(event.files) as File[];

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

    images.value.push(s3Url);
  });
};

const discardImage = (index: number) => {
  images.value.splice(index, 1);
};

const makePlottable = async () => {
  loading.value = true;

  const pollingUrl = await useNuxtApp()
    .$trpcAPI()
    .makeMontage({ images: images.value });

  const s3MontagesUrls = await pollMontageUrls(pollingUrl);
  const { montageUrls } = await Montages.saveMontages(s3MontagesUrls);

  montages.value = montageUrls.thumbnailsUrls;
  loading.value = false;
};

const montages = ref<Montages['montageUrls']['thumbnailsUrls']>([]);

async function pollMontageUrls(pollingUrl: string) {
  async function pollingLoop() {
    let response;
    try {
      response = await axios.get(pollingUrl);
      return response.data;
    } catch (error) {
      if (error.isAxiosError) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return await pollingLoop();
      } else throw error;
    }
  }
  const { montageUrls } = await pollingLoop();
  return montageUrls;
}

const router = useRouter();

async function addToCart() {
  const totalMeter = montages.value.reduce((acc, montage) => {
    return acc + pixelsToMeters(montage.realDimensions.height);
  }, 0);
  const totalPrice = totalMeter * 5000;

  await Purchase.addToCart(totalMeter, totalPrice);
  router.push('/checkout');
}
console.log('purchase', usePurchase().purchase);
</script>

<template>
  <article class="page-container">
    <div class="container">
      <h1>Welcome!</h1>
      <input
        type="file"
        multiple
        @change="(event: Event)=>handleFiles(event.target as HTMLInputElement)"
        accept="images/*"
      />
      <div class="grid">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="image-container"
        >
          <img :src="image" :alt="'Image ' + index" class="image" />
          <button @click="discardImage(index)" class="remove-button">x</button>
        </div>
      </div>
    </div>
    <button @click="makePlottable" class="plott-button" v-if="!loading">
      Create Plott
    </button>
    <progress v-else />
  </article>

  <MontagesGallery v-if="montages.length > 0" :montagesThumnails="montages" />
  <div class="center">
    <button v-if="montages.length > 0" @click="addToCart()">Comprar</button>
  </div>
</template>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.container {
  padding: 1em;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1em;
}

.image-container {
  position: relative;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-button {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  border-radius: 50%;
  background-color: var(--pico-primary);
  width: 1.2rem;
  height: 1.2rem;
  color: #fff;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0rem;
  padding: 0 0 0.2rem 0;
  font-weight: 600;
}

.plott-button {
  margin-top: 1rem;
}
</style>
