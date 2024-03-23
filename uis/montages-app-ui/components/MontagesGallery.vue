<script lang="ts" setup>
import { asCurrency, pixelsToMeters } from '../lib/utils';
import type { Montages } from '../store/montages';

const props = defineProps({
  montagesThumnails: {
    type: Array,
    default: [],
  },
});

const { montagesThumnails } = toRefs(props);

const parsedMontages = computed(() => {
  return montagesThumnails.value.map((montage) => ({
    src: montage.url,
    alt: `montage thumbnail image`,
    price: asCurrency(pixelsToMeters(montage.realDimensions.height) * PRICE),
    largeInMeters: Math.ceil(pixelsToMeters(montage.realDimensions.height)),
  }));
});

const PRICE = 5000;
</script>
<template>
  <article class="gallery">
    <div
      v-for="(image, index) in parsedMontages"
      :key="index"
      class="image-container"
    >
      <img :src="image.src" :alt="image.alt" />
      <div>
        <small>
          {{ image.largeInMeters }}m
          <br />
          {{ image.price }}
        </small>
      </div>
    </div>
  </article>
</template>

<style scoped>
small {
  font-weight: bold;
}
.gallery {
  display: flex;
  overflow-x: auto;
}

.image-container {
  flex: 0 0 auto;
  margin-right: 10px; /* Space between images */
}

.image-container img {
  max-height: 300px; /* Adjust as needed */
  object-fit: cover;
  border: 0.5px solid #000;
}
</style>
