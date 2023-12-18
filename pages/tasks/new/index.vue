<template>
    <main
        class="w-full h-screen flex flex-row justify-center 2xl:gap-36 xl:gap-24 lg:gap-16 md:gap-12 sm:gap-12 gap-12 items-center text-zinc-50">
        <div class="w-full max-w-md flex flex-col gap-16">
            <form @submit.prevent="onSubmit">
                <h1 class="mb-12 text-zinc-50">New Task</h1>
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
                    <Button color="danger" class="w-full" size="lg" @click="navigateTo(`/tasks/upcoming`)">Cancel</Button>
                    <Button color="success" class="w-full" size="lg" type="submit">Create</Button>
                </div>
                <i v-if="createErrorMessage" class="text-red-500 text-sm">{{ createErrorMessage }}</i>
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

// Fetch groups where the user is part of
const { groups } = await $fetch(`/api/groups/getGroupsByUserID/${user.id}`);

// Error handling if loading groups failed
if (!groups) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load groups! Try again..."
    })
}

// Form data
const data = reactive({
    title: "",
    description: "",
    dueDate: new Date(Date.now()),
    groupID: null,
    creatorID: currentUser.value.id,
});

// Create error message
const createErrorMessage = ref();

/**
 * # onSubmit
 * Creates a task. If there is an error, navigate to the tasks/upcoming page, else print an error.
 */
const onSubmit = async () => {
    const { res, err } = await $fetch(`/api/tasks`, {
        method: "post",
        body: data,
    });
    if (!err) {
        createErrorMessage.value = "";
        navigateTo(`/tasks/upcoming`);
    } else {
        createErrorMessage.value = "Failed to create new task! Try again..."
    }
}

</script>