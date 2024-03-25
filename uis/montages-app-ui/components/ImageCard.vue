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
});

// this function round to 1 decimal place
const round = (num: number) => Math.round(num * 10) / 10;
</script>

<template>
  <article>
    <div class="image">
      <img :src="image" alt="image" />
    </div>
    <RemoveOrAddImgPill :copies="copies" :imageId="imageId" />
    <small>
      {{ round(dimsInPx.width) }}px x {{ round(dimsInPx.height) }}px <br />
      {{ round(dimsInCms.width) }}cm x {{ round(dimsInCms.height) }}cm
    </small>
  </article>
</template>

<style lang="scss" scoped></style>
