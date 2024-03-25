<script setup lang="ts">
import { toRefs } from 'vue';
const props = defineProps({
  icon: { type: String, required: true },
  size: { type: Number, default: 16 },
});

const { icon } = toRefs(props);
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    xmlns="https://www.w3.org/2000/svg"
  >
    <path :d="icon" />
  </svg>
</template>
