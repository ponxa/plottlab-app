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
});
</script>

<template>
  <article>
    <div class="image">
      <img :src="image" alt="image" />
    </div>
    <RemoveOrAddImgPill :copies="copies" :imageId="imageId" />
  </article>
</template>

<style lang="scss" scoped></style>
