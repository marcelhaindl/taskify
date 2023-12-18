<template>
    <!-- Button Items -->
    <button :type=type :class="['btn', colorClass(), sizeClass(), width()]">
        <!-- Prints the text of the button -->
        <slot></slot>
    </button>
</template>

<script setup>
// Properties
const props = defineProps({
    color: {
        typeof: String,
        default: 'primary'
    },
    size: {
        typeof: String,
        default: 'md'
    },
    width: {
        typeof: String,
        default: "wrap-content"
    },
    type: {
        default: "button"
    },
})

/**
 * # colorClass
 * @returns the color class of the button depending on the input
 */
const colorClass = () => {
    switch (props.color) {
        case 'primary':
            return 'bg-blue-600 text-blue-50 hover:bg-blue-700';
        case 'secondary':
            return 'bg-zinc-600 text-zinc-50 hover:bg-zinc-700';
        case 'light':
            return 'bg-zinc-50 text-zinc-900 hover:bg-zinc-100';
        case 'dark':
            return 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800';
        case 'danger':
            return 'bg-red-600 text-red-50 hover:bg-red-700';
        case 'success':
            return 'bg-green-700 text-green-50 hover:bg-green-800';
        case 'warning':
            return 'bg-yellow-600 text-yellow-50 hover:bg-yellow-700';
        case 'transparent':
            return 'bg-transparent text-zinc-900 hover:text-zinc-600';
        default:
            return 'bg-blue-600 text-blue-50 hover:bg-blue-700';
    }
}

/**
 * # sizeClass
 * @returns the size of the button depending on the input
 */
const sizeClass = () => {
    switch (props.size) {
        case 'sm':
            return 'h-8 text-xs';
        case 'md':
            return 'h-10 text-sm';
        case 'lg':
            return 'h-12 text-base';
        default:
            return 'h-10 text-sm';
    }
}

/**
 * # width
 * @return the width of the button depending on the input
 */
const width = () => {
    switch (props.width) {
        case 'wrap-content':
            return '';
        case 'match-parent':
            return 'w-full';
    }
}
</script>

<style>
/* General button style */
.btn {
    @apply px-4 rounded font-bold;
}
</style>