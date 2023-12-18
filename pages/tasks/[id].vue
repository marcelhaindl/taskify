<template>
    <main
        class="w-full h-screen flex flex-row justify-center 2xl:gap-36 xl:gap-24 lg:gap-16 md:gap-12 sm:gap-12 gap-12 items-center text-zinc-50">
        <div class="w-full max-w-md flex flex-col gap-16">
            <div class="flex flex-col gap-8">
                <div class="flex flex-col gap-5">
                    <!-- due date -->
                    <p class="text-zinc-400 text-lg">{{ dueDate }}</p>
                    <!-- task title and creator and group name-->
                    <div class="flex flex-col gap-1.5">
                        <h1>{{ task.title }}</h1>
                        <p class="text-zinc-500">by {{ creatorName }} <span v-if="groupName">({{ groupName }})</span>
                        </p>
                    </div>
                </div>
                <!-- task description -->
                <div>
                    <p class="text-zinc-300 break-words">{{ task.description }}</p>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <!-- Error if deletion went wrong -->
                <i v-if="deleteError" class="text-red-500 text-sm">{{ deleteError }}</i>
                <!-- Button group edit and delete -->
                <div class="flex flex-row w-full gap-2 justify-between">
                    <Button v-if=!task.completed color="primary" width="match-parent" size="lg"
                        @click.prevent="navigateTo(`/tasks/edit/${task.id}`)">Edit</Button>
                    <Button color="danger" width="match-parent" size="lg" @click.prevent="onDelete">Delete</Button>
                </div>
                <!-- Button group Mark and Undo -->
                <div class="flex justify-end items-end w-full">
                    <Button v-if=task.completed color="secondary" width="match-parent" size="lg"
                        @click.prevent="undo">Undo</Button>
                    <Button v-else color="success" width="match-parent" size="lg" @click.prevent="mark">Mark
                        Completed</Button>
                </div>
                <!-- Error if marking went wrong -->
                <i v-if="markError" class="text-red-500 text-sm">{{ markError }}</i>
            </div>
        </div>
        <img alt="todo" src="/images/task.png" class="sm:hidden lg:block hidden xl:max-w-md lg:max-w-sm">
    </main>
</template>


<script setup>
// Authentication
const res = await verifyAuthentication();
const currentUser = useState("currentUser");
if (!res.verified) {
    currentUser.value = {};
    navigateTo("/");
} else {
    currentUser.value = { id: res.user.id, firstName: res.user.firstName, lastName: res.user.lastName }
}


// Get task out of ID
const route = useRoute();
const { task } = await $fetch(`/api/tasks/${route.params.id}`)
// Error handling if loading task failed
if (!task) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load task! Try again..."
    })
}

// Variables
const creatorName = ref();
const groupName = ref();
const dueDate = ref();

// Date Formatting
const date = new Date(task.due_date);
dueDate.value = date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

// Get and set creator
const { user } = await $fetch(`/api/users/${task.creator_id}`);
if (!user) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load task-creator! Try again...",
        fatal: true,
    })
}
creatorName.value = user.first_name + " " + user.last_name;

// Get and set group
if (task.group_id) {
    const { group } = await $fetch(`/api/groups/${task.group_id}`);
    if (!group) {
        throw createError({
            statusCode: 404,
            statusMessage: "Failed to load task-group! Try again...",
            fatal: true,
        })
    }
    groupName.value = group.name;
}

// Delete Error
const deleteError = ref();

/**
 * # onDelete
 * Asks again for confirmation for deletion.
 * If the user confirms the confirmation dialogue, it deletes the task. If there was no error then it navigates back to the previous page.
 * If there was an error then it prints the error message.
 */
const onDelete = async () => {
    const confirmed = confirm("Do you really want to delete this task?");
    if (confirmed) {
        const wasCompleted = task.completed;
        const res = await $fetch(`/api/tasks/${task.id}`, {
            method: "delete",
        });
        if (!res.err) {
            deleteError.value = ""
            if (wasCompleted) {
                navigateTo("/tasks/completed");
            } else {
                navigateTo("/tasks/upcoming");
            }
        } else {
            deleteError.value = "Failed to delete the task! Try again..."
        }
    }
}

// Mark Error
const markError = ref();

/**
 * # mark
 * Marks the task as completed and returns to previous page if it succeeds. Else it throws an error!
 */
const mark = async () => {
    const { res, err } = await markCompleted(true, task.id);
    if (err) {
        markError.value = "Failed to mark task! Try again...";
    } else {
        markError.value = "";
        navigateTo("/tasks/upcoming");
    }
}

/**
 * # undo
 * Marks the task as not completed and returns to previous page if it succeeds. Else it throws an error!
 */
const undo = async () => {
    const { res, err } = await markCompleted(false, task.id);
    if (err) {
        markError.value = "Failed to undo task! Try again...";
    } else {
        markError.value = "";
        navigateTo("/tasks/completed")
    }
}
</script>