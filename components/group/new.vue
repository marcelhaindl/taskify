<template>
    <!-- New Group -->
    <div @click="navigateTo('/groups/new')" class="cursor-pointer text-zinc-900 bg-zinc-50 rounded">
        <!-- Add Icon -->
        <div class="flex justify-center items-center h-64 bg-zinc-300">
            <IconAdd class="text-zinc-500" width="72px" height="72px"></IconAdd>
        </div>
        <!-- Text and description for adding new group -->
        <div class="flex flex-col px-6 pt-4 pb-6 gap-4">
            <h2>New Group</h2>
            <div>
                <p class="text-zinc-600 clamp-line-2 break-word">Create a new group and invite others to collaborate on
                    group tasks!</p>
            </div>
        </div>
    </div>
</template>