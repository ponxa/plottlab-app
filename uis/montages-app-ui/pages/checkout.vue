<script setup>
import { usePurchase } from '../store/purchase';
const Purchase = usePurchase(); // import the store
async function getPaymentLink() {
  const { paymentLink } = await useNuxtApp()
    .$trpcAPI()
    .geyPaymentLink(Purchase.purchase);
  window.location.href = paymentLink;
}
</script>

<template>
  <h1>Checkout</h1>
  <article>
    <form>
      <fieldset class="grid">
        <input
          name="first-name"
          placeholder="Nombre"
          aria-label="Nombre"
          autocomplete=""
        />
        <input
          type="last-name"
          name="Apellido"
          placeholder="Apellido"
          aria-label="Apellido"
          autocomplete=""
        />
      </fieldset>
      <fieldset class="grid">
        <input
          name="street"
          placeholder="Calle"
          aria-label="Calle"
          autocomplete=""
        />
        <input
          type="street-number"
          name="N° de calle"
          placeholder="N° de calle"
          aria-label="N° de calle"
          autocomplete=""
        />
      </fieldset>
      <fieldset class="grid">
        <input
          name="phone"
          placeholder="Telefono"
          aria-label="Telefono"
          autocomplete=""
        />
        <input
          type="Comuna"
          name="Comuna"
          placeholder="Comuna"
          aria-label="Comuna"
          autocomplete=""
        />
      </fieldset>
    </form>
  </article>
  <button @click="getPaymentLink">Ir a pagar</button>
</template>
