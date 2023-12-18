<template>
    <!-- SVG Icon ADD -->
    <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 24 24">
        <path fill="currentColor" d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6h-2Z" font-size="72"></path>
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
});
</script>