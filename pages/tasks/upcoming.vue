<template>
    <main class="grid 2xl:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 2xl:gap-y-16 xl:gap-y-16 md:gap-y-12
                        gap-y-8">
        <!-- New Task if list is empty-->
        <TaskNew class="h-64" v-if=empty></TaskNew>
        <!-- New Task if list is not empty -->
        <TaskNew v-else></TaskNew>
        <!-- For every task, print a task -->
        <Task v-for="task in taskArray" :task="task" :mark="(event) => mark(event, task)"></Task>
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

// Fetch upcoming tasks
const { tasks } = await $fetch(`/api/tasks/upcoming/${currentUser.value.id}`);

// Error handling if upcoming tasks didnt load correctly
if (!tasks) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load upcoming tasks! Try again...",
        fatal: true,
    })
}
const taskArray = ref(tasks);

// Sort the tasks by its date from past to future (2 days ago -> yesterday -> today ...)
taskArray.value.sort(function (a, b) {
    return new Date(a.due_date) - new Date(b.due_date);
})

// Calculates if the taskArray is empty
const empty = computed(() => {
    if (taskArray.value.length <= 0) return true;
    else return false
})

/**
 * # mark
 * If you click the mark compléted button, it cuts the task from the task array and sets its value inside the database to completed
 * @param {Event} event - Click event to stop propagination
 * @param {Oject} task - Task that needs to be deleted
 */
const mark = (event, task) => {
    const index = taskArray.value.indexOf(task);
    taskArray.value.splice(index, 1);
    markCompleted(true, task.id);
    event.stopPropagation();
}
</script>