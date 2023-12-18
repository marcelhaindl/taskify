// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ["nuxt-icon", '@vite-pwa/nuxt'],
  nitro: {
    preset: "node-server",
  },
  pwa: {
    manifest: {
      name: "Taskify Production App",
      short_name: "Taskify",
      description: "Taskify is a production task management app.",
      theme_color: "#111827",
      display: "fullscreen",
      prefer_related_applications: true,
      lang: "en",
      start_url: "../",
    }
  }
})
