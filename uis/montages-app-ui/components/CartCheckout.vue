<script setup>
const cartItems = ref([]);
</script>

<template>
  <div class="cart">
    <h2>Your Cart</h2>
    <div v-for="item in cartItems" :key="item.id" class="cart-item">
      <img :src="item.image" :alt="item.name" />
      <p>{{ item.name }}</p>
    </div>
  </div>
</template>

<style scoped>
.cart {
  width: 300px;
  border: 1px solid #ccc;
  padding: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.cart-item img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
</style>
