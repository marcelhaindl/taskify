<template>
    <!-- Main screen if the completed tasks are not empty -->
    <main v-if="!empty"
        class="grid 2xl:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 2xl:gap-y-16 xl:gap-y-16 md:gap-y-12 gap-y-8">
        <!-- For each task, print task -->
        <Task v-for="task in taskArray" :task="task" :undo="(event) => undo(event, task)"></Task>
    </main>
    <!-- Main screen if the completed tasks are empty -->
    <main v-else class="flex justify-center items-center text-zinc-50 h-screen">
        <p>Currently no completed tasks!</p>
    </main>
</template>

<script setup>
// Authentication
const { user, verified } = await verifyAuthentication();
const currentUser = useState("currentUser");
if (!verified) {
    currentUser.value = {};
    navigateTo("/");

} else {
    currentUser.value = { id: user.id, firstName: user.firstName, lastName: user.lastName }
}

// Fetch completed tasks
const { tasks } = await $fetch(`/api/tasks/completed/${currentUser.value.id}`);

// Error handling if it failed to load completed tasks
if(!tasks) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load completed tasks! Try again...",
        fatal: true,
    })
}
const taskArray = ref(tasks);

// Sort taskArray from future to past (today -> yesterday -> 2 days ago)
taskArray.value.sort(function (a, b) {
    return new Date(b.due_date) - new Date(a.due_date);
});

// Calculates if the task array is empty
const empty = computed(() => {
    if (taskArray.value.length <= 0) {
        return true;
    } else {
        return false;
    }
})

/**
 * # undo
 * Cuts the task from task array and undo's the completion
 * @param {Event} event - Click event to stop propagination
 * @param {Object} task - Task that you want to delete
 */
const undo = (event, task) => {
    const index = taskArray.value.indexOf(task);
    if (index > -1) taskArray.value.splice(index, 1)
    markCompleted(false, task.id);
    event.stopPropagation();
}
</script>