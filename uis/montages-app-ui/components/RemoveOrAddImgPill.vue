<script lang="ts" setup>
import { mdiMinus, mdiPlus, mdiTrashCan } from '@mdi/js';

import { usePurchase } from '~/store/purchase';

const Purchase = usePurchase();

const props = defineProps({
  copies: {
    type: Number,
    default: 1,
  },
  imageId: {
    type: String,
  },
});

const { copies } = toRefs(props);

const loading = ref(false);

const removeImg = async (imageId: string) => {
  loading.value = true;
  console.log(imageId);
  await Purchase.removeImg(imageId);
  loading.value = false;
};
let imgCounter = ref(copies.value);
const addImg = async (imageId: string) => {
  loading.value = true;
  imgCounter.value++;
  await Purchase.addOrRemoveImg(imageId, imgCounter.value);
  loading.value = false;
};
const restImg = async (imageId: string) => {
  loading.value = true;
  imgCounter.value--;
  await Purchase.addOrRemoveImg(imageId, imgCounter.value);
  loading.value = false;
};
</script>
<template>
  <div class="pill">
    <button>
      <MdiIcon
        v-if="copies === 1"
        :icon="mdiTrashCan"
        style="fill: #000"
        @click="removeImg(imageId)"
      />
      <MdiIcon
        :icon="mdiMinus"
        style="fill: #000"
        @click="restImg(imageId)"
        v-else
      />
    </button>

    <small v-if="!loading">{{ copies }}</small>
    <i v-else :aria-busy="loading" />
    <button>
      <MdiIcon :icon="mdiPlus" style="fill: #000" @click="addImg(imageId)" />
    </button>

    <!-- <button @click="removeImg">
  
    </button> -->
    <!-- <button @click="addImg">
    </button>
    <button @click="deleteImg">

    </button> -->
  </div>
</template>

<style scoped>
.pill {
  /* Add your styles here */
  border: 3px solid #ccc;
  border-radius: 2rem;
  display: flex;
  justify-content: space-around;
  border-radius: 2rem;
  align-items: center;
  margin-top: 0.5rem;
}

button {
  margin: 0;
  padding: 0;
  border: none;
  background: none;
}
button:focus {
  border: none;
  outline: none;
  box-shadow: none;
}
</style>
