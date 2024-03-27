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
    type: Object as PropType<{ width: number; height: number }>,
    default: () => ({ width: 0, height: 0 }),
  },
  dimsInCms: {
    type: Object as PropType<{ width: number; height: number }>,
    default: () => ({ width: 0, height: 0 }),
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
    <div class="text-container">
      <small v-if="!isLoading" class="custom-small">
        {{ round(dimsInPx.width) }}px x {{ round(dimsInPx.height) }}px
      </small>
      <small v-if="!isLoading" class="custom-small">
        {{ round(dimsInCms.width) }}cm x {{ round(dimsInCms.height) }}cm
      </small>
    </div>
  </article>
</template>

<style scoped>
.custom-article {
  height: 250px;
  overflow: hidden;
  position: relative;
}
.custom-small {
  font-size: 0.6rem;
  text-align: center;
  margin: 0;
  padding: 0;
  font-weight: 600;
}
.text-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
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
