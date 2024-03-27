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
  company: Purchase.purchase.customer.companyName || '',
  firstName: Purchase.purchase.customer.firstName || '',
  lastName: Purchase.purchase.customer.lastName || '',
  email: Purchase.purchase.customer.email || '',
  phone: Purchase.purchase.customer.phone || '',
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
    errors.value.company = 'Nombre de la empresa es requerido';
    isValid = false;
  }

  if (!form.value.firstName) {
    errors.value.firstName = 'Nombre es requerido';
    isValid = false;
  }

  if (!form.value.lastName) {
    errors.value.lastName = 'Apellido es requerido';
    isValid = false;
  }

  if (!form.value.email) {
    errors.value.email = 'Email es requerido';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Email is invalid';
    isValid = false;
  }

  if (!form.value.phone) {
    errors.value.phone = 'Número de teléfono es requerido';
    isValid = false;
  }

  return isValid;
}

const loading = ref(false);
async function handleFormSubmit() {
  if (validateForm()) {
    loading.value = true;
    await Purchase.updateCustomer({
      companyName: form.value.company,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      phone: form.value.phone,
    });

    await getPaymentLink();
    loading.value = false;
  }
}
</script>

<template>
  <h1>Checkout</h1>
  <p>Por favor, completa tus datos para continuar con el pago.</p>
  <article>
    <form @submit.prevent="handleFormSubmit">
      <fieldset class="grid">
        <div class="input-container">
          <input
            v-model="form.company"
            name="company"
            placeholder="Nombre Empresa"
            aria-label="Nombre Empresa"
            autocomplete=""
          />
          <small class="invalid-text" v-if="errors.company"
            >*{{ errors.company }}</small
          >
        </div>
      </fieldset>
      <small><strong>* Nombre y Apellido De Persona Que Retira</strong></small>
      <fieldset class="grid">
        <div class="input-container">
          <input
            v-model="form.firstName"
            name="first-name"
            placeholder="Nombre"
            aria-label="Nombre"
            autocomplete=""
          />
          <small class="invalid-text" v-if="errors.firstName"
            >*{{ errors.firstName }}</small
          >
        </div>
        <div class="input-container">
          <input
            v-model="form.lastName"
            type="last-name"
            name="Apellido"
            placeholder="Apellido"
            aria-label="Apellido"
            autocomplete=""
          />
          <small class="invalid-text" v-if="errors.lastName"
            >*{{ errors.lastName }}</small
          >
        </div>
      </fieldset>
      <fieldset class="grid">
        <div class="input-container">
          <input
            v-model="form.email"
            name="email"
            placeholder="E-mail"
            aria-label="E-mail"
            autocomplete=""
          />
          <small class="invalid-text" v-if="errors.email"
            >*{{ errors.email }}</small
          >
        </div>

        <div class="input-container">
          <input
            v-model="form.phone"
            name="phone"
            placeholder="Telefono"
            aria-label="Telefono"
            autocomplete=""
          />
          <small class="invalid-text" v-if="errors.phone"
            >*{{ errors.phone }}</small
          >
        </div>
      </fieldset>
      <button type="submit" :disabled="!validateForm">
        Pagar
        <i :aria-busy="loading" v-if="loading"></i>
        <strong v-else>{{
          asCurrency(Purchase.purchase.preCart.generatedMontages.totalPrice)
        }}</strong>
      </button>
    </form>
  </article>
</template>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
}

.invalid-text {
  color: rgb(255, 64, 0);
}
</style>
