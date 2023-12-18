<template>
    <!-- Group Item -->
    <div class="cursor-pointer text-zinc-900 bg-zinc-50 rounded" @click="navigateTo(`/groups/${group.id}`)">
        <img  alt="placeholder" class="bg-zinc-300 h-64 w-full object-cover" src="/images/group.jpg">
        <div class="flex flex-col px-6 pt-4 pb-6 gap-4">
            <!-- Name of the group -->
            <h2>{{ group.name }} <span class="font-normal text-zinc-500">({{ amountOfMembers }})</span></h2>
            <!-- Group description -->
            <div>
                <p class="text-zinc-600 break-word line-clamp-2">{{ group.description }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
// Properties
const props = defineProps({
    group: {
        typeof: Object,
        default: {},
    },
});

// Calculates the amount of members of the group
const amountOfMembers = computed(() => {
    return props.group.members.length;
})
</script>