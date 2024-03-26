<script setup>
// You can add your Vue 3 Composition API logic here
</script>

<template>
  <article class="flex-container">
    <img src="../assets/imgs/chayane-chiquito.webp" alt="chayane chiquito" />
    <div class="thank-you">
      <h1>Gracias!</h1>
      <p>
        Gracias por tu compra , te lo agradesemos mucho el equipo de Plottlab
        👾✨🎉🎊
      </p>
    </div>
  </article>
</template>

<style scoped>
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.thank-you {
  text-align: center;
  margin-top: 50px;
  border-left: 3px solid #333;
}

.thank-you h1 {
  font-size: 2em;
  color: #333;
}

.thank-you p {
  font-size: 1.2em;
  color: #666;
}
</style>
