<template>
    <div :class="color">
        <!-- User Image -->
        <img src="/images/default_profile.png" width="60" height="60" class="rounded-full" alt="profile" />
        <!-- Name and email -->
        <div class="flex flex-col gap-1">
            <h2>{{ user.first_name }} {{ user.last_name }} <span v-if="admin">(A)</span></h2>
            <p :class="`text-zinc-500`">{{ user.email }}</p>
        </div>
    </div>
</template>

<script setup>

// Properties
const props = defineProps({
    user: {
        typeof: Object,
        default: {},
    },
    selected: {
        typeof: Boolean,
        default: false,
    },
    admin: {
        typof: Boolean,
        default: false,
    }
});

// Calculates the color depending on whether the user is selected or not
const color = computed(() => {
    if (!props.selected) return `cursor-pointer bg-zinc-50 hover:bg-zinc-100 rounded text-zinc-900 px-6 pt-8 pb-6 border-t-8 border-zinc-400 hover:border-zinc-500 flex flex-row gap-4`
    else return `cursor-pointer bg-green-50 hover:bg-green-100 rounded text-zinc-900 px-6 pt-8 pb-6 border-t-8 border-green-400 hover:border-green-500 flex flex-row gap-4`
})

</script>