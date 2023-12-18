<template>
    <main
        class="w-full h-screen flex flex-row justify-center 2xl:gap-36 xl:gap-24 lg:gap-16 md:gap-12 sm:gap-12 gap-12 items-center text-zinc-50">
        <div class="w-full max-w-md flex flex-col gap-16">
            <form @submit.prevent="onSubmit">
                <h1 class="mb-12 text-zinc-50">Edit Task</h1>
                <!-- Title input -->
                <div class="mb-4">
                    <label class="block text-zinc-400 text-sm font-bold mb-2" for="title">
                        Title
                    </label>
                    <input v-model="data.title"
                        class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-700 bg-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
                        id="title" type="text" placeholder="Title" required>
                </div>
                <!-- Description input -->
                <div class="mb-4">
                    <label class="block text-zinc-400 text-sm font-bold mb-2" for="description">
                        Description
                    </label>
                    <textarea v-model="data.description"
                        class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-700 bg-zinc-50 leading-tight focus:outline-none focus:shadow-outline max-h-36"
                        id="description" type="text" placeholder="Description" required></textarea>
                </div>
                <!-- Due date input -->
                <div class="mb-4">
                    <label class="block text-zinc-400 text-sm font-bold mb-2" for="dueDate">
                        Due Date
                    </label>
                    <input v-model="data.dueDate"
                        class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-700 bg-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
                        id="dueDate" type="date" placeholder="Due Date" required>
                </div>
                <!-- Group input -->
                <div class="mb-8">
                    <label class="block text-zinc-400 text-sm font-bold mb-2" for="group">
                        Group
                    </label>
                    <!-- Shows an option for every group the user is in (default is ---) -->
                    <select v-model="data.groupID"
                        class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-700 bg-zinc-50 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="group" required>
                        <option :value=null>---</option>
                        <option v-for="group in groups" v-bind:value="group.id">{{ group.name }}</option>
                    </select>
                </div>
                <div class="flex flex-row w-full gap-2 justify-between">
                    <Button color="danger" class="w-full" size="lg" @click="navigateTo(`/tasks/${task.id}`)">Cancel</Button>
                    <Button color="success" class="w-full" size="lg" type="submit">Save</Button>
                </div>
                <i v-if="editErrorMessage" class="text-red-500 text-sm">{{ editErrorMessage }}</i>
            </form>
        </div>
        <img alt="todo" src="/images/task.png" class="sm:hidden lg:block hidden xl:max-w-md lg:max-w-sm">
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

// Get task out of ID
const route = useRoute();
const { task } = await $fetch(`/api/tasks/${route.params.id}`)
// Error handling if loading task failed
if (!task) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load task! Try again...",
        fatal: true,
    })
}

// Date formatting
const date = new Date(task.due_date);
const year = date.getFullYear().toString().padStart(4, '0');
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const day = date.getDate().toString().padStart(2, '0');

const formattedDate = ref();
formattedDate.value = `${year}-${month}-${day}`;

// Fetch groups where the user is part of
const { groups } = await $fetch(`/api/groups/getGroupsByUserID/${user.id}`);
// Error handling if loading groups failed
if (!groups) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load groups! Try again...",
        fatal: true,
    })
}

// Form data
const data = reactive({
    title: task.title,
    description: task.description,
    dueDate: formattedDate.value,
    groupID: task.group_id,
    completed: task.completed,
});

// Edit error message
const editErrorMessage = ref();

/**
 * # onSubmit
 * Updates a task. If there is no error, then it navigates back to the page where the user can view this task.
 * If there is an Error, it throws an error message.
 */
const onSubmit = async () => {
    const {res, err} = await $fetch(`/api/tasks/${task.id}`, {
        method: "put",
        body: data,
    });
    if (!err) {
        editErrorMessage.value = "";
        navigateTo(`/tasks/${task.id}`);
    } else {
        editErrorMessage.value = "Failed to edit user! Try again...";
    }
}
</script>