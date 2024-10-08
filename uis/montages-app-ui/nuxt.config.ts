// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['@picocss/pico/css/pico.css', '@/assets/css/main.css'],
  devtools: { enabled: false },

  modules: ['@pinia/nuxt'],
});
