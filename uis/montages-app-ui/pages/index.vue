<script lang="ts" setup>
import { ref } from 'vue';
import type { TRPCOutput } from '../plugins/trpc-api';
import axios from 'axios';

import { pixelsToMeters } from '../lib/utils';

import { useMontages } from '~/store/montages';

import { usePurchase } from '~/store/purchase';
import type { Purchase } from '~/store/purchase';

type Montages = TRPCOutput<'createMontages'>;
type Images = TRPCOutput<'makeThumbnails'>;
const Purchase = usePurchase();
const Montages = useMontages();

const images = ref<Images[]>([]);

const loading = ref(false);

const handleFiles = async (event: HTMLInputElement) => {
  //* load images into s3 bucket and return s3 url

  if (!event.files) return;
  if (event.files.length === 0) return;

  await Purchase.addToPreCart(event.files);
};

const discardImage = (index: number) => {
  images.value.splice(index, 1);
};

function flattenArray(imageObjects) {
  const flattenedArray: string[] = [];
  console.log('imageObjects', imageObjects);

  // Iterate through each object in the array
  imageObjects.forEach((obj) => {
    // Add copies of imgUrl based on the 'copies' property
    for (let i = 0; i < obj.copies; i++) {
      flattenedArray.push(obj.rawSizeUrl);
    }
  });

  return flattenedArray;
}

const makePlottable = async () => {
  loading.value = true;
  const images = flattenArray(Purchase.purchase.preCart.imagesForMontage);
  const pollingUrl = await useNuxtApp()
    .$trpcAPI()
    .makeMontage({ images: images });

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
</script>

<template>
  <article class="page-container">
    <div class="container">
      <h1 class="title">Plottlab Montages Creator</h1>
      <p class="description">
        Welcome to Plottlab Montages Creator. This application allows you to
        upload your images and create beautiful montages. Once your montage is
        ready, you can have it plotted and delivered to your doorstep. Start
        creating your unique montage now!
      </p>

      <input
        type="file"
        multiple
        @change="(event: Event)=>handleFiles(event.target as HTMLInputElement)"
        accept="images/*"
      />
      <div class="grid">
        <ImageCard
          v-for="(image, index) in Purchase.purchase.preCart
            .thumbnailImagesForMontage"
          :key="index"
          class="image-container"
          :image="image.thumbnailUrl"
          :copies="image.copies"
          :imageId="image.id"
          :dimsInPx="image.dimsInPx"
          :dimsInCms="image.dimsInCms"
        />
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

/* .remove-button {
  position: absolute;
  top: 0;
  right: 0;
} */

.plott-button {
  margin-top: 1rem;
}
</style>
