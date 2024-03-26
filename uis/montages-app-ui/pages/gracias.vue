<script setup>
import { usePurchase } from '../store/purchase';
import { asDayMonthDate } from '../lib/utils';
const Purchase = usePurchase(); // import the store

const calculateDeliveryDate = () => {
  const today = new Date();
  const deliveryDate = new Date();
  deliveryDate.setDate(
    today.getDate() + Purchase.purchase.preCart.generatedMontages.pickUpDays
  );
  return asDayMonthDate(deliveryDate);
};
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
      <p>
        Porfavor retirar su pedido a partir de el
        <strong>{{ calculateDeliveryDate() }}</strong>
        🚛🚚
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
