<template>
    <!-- Creates a task item with an add icon inside -->
    <div class="cursor-pointer bg-zinc-50 hover:bg-zinc-100 rounded text-zinc-900 px-6 pt-8 pb-6 border-t-8 border-zinc-400 hover:border-zinc-500 flex justify-center items-center" @click="navigateTo('/tasks/new')">
        <IconAdd class="text-zinc-500" width="72px" height="72px"></IconAdd>
    </div>
</template>