<script lang="ts" setup>
defineProps({
  image: {
    type: String,
  },
  copies: {
    type: Number,
    default: 1,
  },
  imageId: {
    type: String,
  },
  dimsInPx: {
    type: Object,
    // default: () => ({width: 0, height: 0}),
  },
  dimsInCms: {
    type: Object,
    // default: () => ({width: 0, height: 0}),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

// this function round to 1 decimal place
const round = (num: number) => Math.round(num * 10) / 10;
</script>

<template>
  <article class="custom-article">
    <div class="image">
      <div class="image-loader" v-if="isLoading"></div>
      <img :src="image" alt="image" v-else />
    </div>

    <RemoveOrAddImgPill :copies="copies" :imageId="imageId" v-if="!isLoading" />
    <small v-if="!isLoading">
      {{ round(dimsInPx.width) }}px x {{ round(dimsInPx.height) }}px <br />
      {{ round(dimsInCms.width) }}cm x {{ round(dimsInCms.height) }}cm
    </small>
  </article>
</template>

<style scoped>
.custom-article {
  height: 250px;
  overflow: hidden;
  position: relative;
}

.image-loader {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0; /* Background color of skeleton */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.image-loader::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.5),
    transparent
  );
  animation: loading 1.5s infinite;
}

@keyframes loading {
  100% {
    left: 100%;
  }
}
</style>
