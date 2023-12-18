<template>
    <!-- Task Item - onclick = navigate to task.id -->
    <div @click="navigateTo(`/tasks/${task.id}`)" :class="{'border-red-400': overdue && !task.completed, 'hover:border-red-500': overdue && !task.completed}"
        class="cursor-pointer bg-zinc-50 hover:bg-zinc-100 rounded text-zinc-900 px-6 pt-8 pb-6 border-t-8 border-blue-400 hover:border-blue-500 flex flex-col gap-4">
        <!-- due date -->
        <p v-if="overdue && !task.completed" class="text-red-600">{{ dueDate }} ({{ daysOverDue }})</p>
        <p v-else class="text-zinc-500">{{ dueDate }}</p>
        <!-- Title and creator -->
        <div class="flex flex-col gap-1">
            <!-- Title -->
            <div>
                <h2 class="line-clamp-2">{{ task.title }}</h2>
            </div>
            <!-- Creator and group -->
            <p v-if="userInsideGroup" class="text-zinc-500 text-sm">by {{ task.creatorName }} <span v-if="task.groupName">({{ task.groupName }})</span></p>
            <p v-else class="text-red-500 text-sm">by unknown <span class="text-zinc-400" v-if="task.groupName">({{ task.groupName }})</span></p>
        </div>
        <!-- Description -->
        <div>
            <p class="text-zinc-600 break-word line-clamp-3">{{ task.description }}</p>
        </div>
        <!-- Mark completed and undo button group -->
        <div class="flex h-full justify-end items-end mt-2">
            <Button v-if=task.completed color="secondary" @click.prevent="undo">Undo</Button>
            <Button v-else color="success" @click.prevent="mark">Mark Completed</Button>
        </div>
    </div>
</template>

<script setup>
// Properties
const props = defineProps({
    task: {
        typeof: Object,
        default: {},
    },
    undo: {
        default: () => { }
    },
    mark: {
        default: () => { }
    }
});

// Date Formatting
const date = computed(() => {
    return new Date(props.task.due_date);
});
const dueDate = computed(() => {
    return date.value.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
})

// Calculate the amount of days which a task is overdue
const daysOverDue = computed(() => {
    const difference = Date.now() - date.value.getTime();
    const differenceInDays = Math.floor(difference / (1000 * 3600 * 24));
    if (differenceInDays === 0) return "Today"
    else if (differenceInDays === 1) return "Yesterday"
    else if (differenceInDays >= 2) return differenceInDays + " days ago"
})

// Calculate wheter a task is overdue or not
const overdue = computed(() => {
    const difference = Date.now() - date.value.getTime();
    const differenceInDays = Math.floor(difference / (1000 * 3600 * 24));
    if (differenceInDays >= 0) { return true; }
})

// Fetches the user
const { user } = await $fetch(`/api/users/${props.task.creator_id}`);
// Error handling if loading user failed 
if (!user) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load user! Try again...",
        fatal: true,
    })
}
props.task.creatorName = `${user.first_name} ${user.last_name}`;

const userInsideGroup = ref(true);

// Loading group
const { group } = await $fetch(`/api/groups/${props.task.group_id}`);
// Error handling when failed loading group
if (!group) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load group! Try again...",
        fatal: true,
    })
}

// If a group ID exists, print the group on the group item
if (props.task.group_id) {
    props.task.groupName = `${group.name}`;
    if(group.members.includes(props.task.creator_id)) userInsideGroup.value = true;
    else userInsideGroup.value = false;
}

</script>