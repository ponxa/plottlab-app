<script setup>
import { usePurchase } from '../store/purchase';
import { asCurrency } from '../lib/utils';
const Purchase = usePurchase(); // import the store
async function getPaymentLink() {
  const { paymentLink } = await useNuxtApp()
    .$trpcAPI()
    .geyPaymentLink(Purchase.purchase);
  window.location.href = paymentLink;
}

import { ref } from 'vue';

const form = ref({
  company: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
});

const errors = ref({
  company: null,
  firstName: null,
  lastName: null,
  email: null,
  phone: null,
});

function validateForm() {
  let isValid = true;

  if (!form.value.company) {
    errors.value.company = 'Company name is required';
    isValid = false;
  }

  if (!form.value.firstName) {
    errors.value.firstName = 'First name is required';
    isValid = false;
  }

  if (!form.value.lastName) {
    errors.value.lastName = 'Last name is required';
    isValid = false;
  }

  if (!form.value.email) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Email is invalid';
    isValid = false;
  }

  if (!form.value.phone) {
    errors.value.phone = 'Phone number is required';
    isValid = false;
  }

  return isValid;
}

async function handleFormSubmit() {
  if (validateForm()) {
    await getPaymentLink();
  }
}
</script>

<template>
  <h1>Checkout</h1>
  <p>Por favor, completa tus datos para continuar con el pago.</p>
  <article>
    <form @submit.prevent="handleFormSubmit">
      <fieldset class="grid">
        <input
          v-model="form.company"
          name="company"
          placeholder="Nombre Empresa"
          aria-label="Nombre Empresa"
          autocomplete=""
        />
        <p v-if="errors.company">{{ errors.company }}</p>
      </fieldset>
      <small><strong>* Nombre y Apellido De Persona Que Retira</strong></small>
      <fieldset class="grid">
        <input
          v-model="form.firstName"
          name="first-name"
          placeholder="Nombre"
          aria-label="Nombre"
          autocomplete=""
        />
        <p v-if="errors.firstName">{{ errors.firstName }}</p>
        <input
          v-model="form.lastName"
          type="last-name"
          name="Apellido"
          placeholder="Apellido"
          aria-label="Apellido"
          autocomplete=""
        />
        <p v-if="errors.lastName">{{ errors.lastName }}</p>
      </fieldset>
      <fieldset class="grid">
        <input
          v-model="form.email"
          name="email"
          placeholder="E-mail"
          aria-label="E-mail"
          autocomplete=""
        />
        <p v-if="errors.email">{{ errors.email }}</p>
        <input
          v-model="form.phone"
          name="phone"
          placeholder="Telefono"
          aria-label="Telefono"
          autocomplete=""
        />
        <p v-if="errors.phone">{{ errors.phone }}</p>
      </fieldset>
      <button type="submit">
        Pagar
        <strong>{{
          asCurrency(Purchase.purchase.preCart.generatedMontages.totalPrice)
        }}</strong>
      </button>
    </form>
  </article>
</template>
