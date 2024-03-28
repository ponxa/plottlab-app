<script lang="ts" setup>
import { ref } from 'vue';
import type { TRPCOutput } from '../plugins/trpc-api';
import axios from 'axios';

import { useMontages } from '~/store/montages';

import { usePurchase } from '~/store/purchase';
import type { Purchase } from '~/store/purchase';

type Montages = TRPCOutput<'createMontages'>;

const Purchase = usePurchase();
const Montages = useMontages();

const loading = ref(false);

const handleFiles = async (event: HTMLInputElement) => {
  //* load images into s3 bucket and return s3 url

  if (!event.files) return;
  if (event.files.length === 0) return;

  const files = Array.from(event.files) as File[];

  await Purchase.addToPreCart(files);
};

function flattenArray(imageObjects) {
  const flattenedArray: string[] = [];

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

  loading.value = false;
  await Purchase.updateGeneratedMontages(montageUrls);
};

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
</script>

<template>
  <article class="page-container" v-if="!Purchase.isMontageGenerated">
    <div class="container">
      <h1 class="title">Agenda tus impresiones 😊</h1>
      <p class="description">
        Selecciona tus archivos a imprimir y define cantidad de copias. Presiona
        el botón de cotizar para calcular el precio total.
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
          :isLoading="image.isLoading"
        />
      </div>
    </div>
    <button
      @click="makePlottable"
      class="plott-button"
      v-if="!loading"
      :disabled="!Purchase.isFileSelected"
    >
      Cotizar
    </button>
    <div v-else>
      <p>Optimizando ubicación de imágenes, generando montaje final</p>
      <progress />
    </div>
  </article>

  <MontagesGallery v-if="Purchase.isMontageGenerated" />
</template>

<style scoped>
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
.plott-button {
  margin-top: 1rem;
}
</style>
