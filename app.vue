<template>
  <NuxtLayout>
    <!-- Entry Point -->
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Head
useHead({
  title: "Taskify",
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { charset: "utf-8" },
    { name: "description", content: "Taskify is a simple and easy to use production app where users are able to manage their tasks and collaborate with others on group tasks." },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#111827"}
  ]
});
</script>
