<script lang="ts" setup>
import { asCurrency } from '../lib/utils';
import { usePurchase } from '../store/purchase';
import { asDayMonthDate, pixelsToMeters } from '../lib/utils';
import { mdiChevronDoubleLeft } from '@mdi/js';

const Purchase = usePurchase();

const calculateDeliveryDate = () => {
  const today = new Date();
  const deliveryDate = new Date();
  deliveryDate.setDate(
    today.getDate() + Purchase.purchase.preCart.generatedMontages.pickUpDays
  );
  return asDayMonthDate(deliveryDate);
};

const rountToTwoDecimals = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

const router = useRouter();
const backToGallery = async () => {
  const userConfirmation = window.confirm(
    '¿Estás seguro de que quieres regresar? El montaje generado será eliminado.'
  );
  if (userConfirmation) {
    await Purchase.removeGenerateMontages();
    router.push('/');
  }
};
</script>
<template>
  <div class="header-custom">
    <header>
      <h1>Galeria De Montages Generados</h1>
      <p>Aquí están los montajes que has creado.</p>
    </header>
    <button class="back-button" @click="backToGallery">
      <MdiIcon :icon="mdiChevronDoubleLeft" /> Volver
    </button>
  </div>

  <article class="gallery">
    <div
      v-for="(image, index) in Purchase.purchase.preCart.generatedMontages
        .thumbnailsUrls"
      :key="index"
      class="image-container"
    >
      <img :src="image.url" alt="Montage Image" />
      <div>
        <small>
          Largo en metro del montaje:
          <strong
            >{{
              rountToTwoDecimals(pixelsToMeters(image.realDimensions.height))
            }}m</strong
          >
        </small>
      </div>
    </div>

    <!-- Total price of montage showed in a view , how many meter of montage have you generated and in how many days can you pick it up -->

    <div class="description">
      <p>
        Precio total:
        <strong class="strong-custom">{{
          asCurrency(Purchase.purchase.preCart.generatedMontages.totalPrice)
        }}</strong>
        <br />
        <small class="small-custom">
          (*Precio por metro:
          <strong>{{
            asCurrency(
              Purchase.purchase.preCart.generatedMontages.pricePerMeter
            )
          }}</strong
          >)
        </small>
      </p>
      <p>
        Metros totales:
        <strong
          >{{
            Purchase.purchase.preCart.generatedMontages.totalMeters
          }}m</strong
        >
      </p>
      <p>
        Paga ahora y retira el
        <strong>{{ calculateDeliveryDate() }}</strong>
      </p>
    </div>
  </article>
  <div class="center">
    <button @click="$router.push('/checkout')">
      Agendar impresión por
      <strong>{{
        asCurrency(Purchase.purchase.preCart.generatedMontages.totalPrice)
      }}</strong>
    </button>
  </div>
</template>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.gallery {
  display: flex;
  overflow-x: auto;
  justify-content: space-between;
}
.strong-custom {
  color: red;
}

.image-container {
  flex: 0 0 auto;
  margin-right: 10px; /* Space between images */
}

.image-container img {
  max-width: 500px; /* Adjust as needed */
  object-fit: cover;
  border: 0.5px solid #000;
}

.description {
  margin-top: 1rem;
  border-left: 3px solid #000;
  padding-left: 1rem;
}
.small-custom {
  margin: 0;
  font-weight: 400;
}

.header-custom {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.back-button {
  height: max-content;
}
</style>
