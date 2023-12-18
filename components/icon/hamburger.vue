<template>
    <!-- SVG Icon HAMBURGER -->
    <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 24 24">
        <path fill="currentColor" d="M3 18v-2h18v2H3Zm0-5v-2h18v2H3Zm0-5V6h18v2H3Z"></path>
    </svg>
</template>
  
<script setup>
// Properties
defineProps({
    width: {
        typeof: String,
        default: "24px",
    },
    height: {
        typeof: String,
        default: "24px",
    },
})
</script>