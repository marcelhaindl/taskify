<template>
    <main
        class="w-full h-screen flex flex-row justify-center 2xl:gap-36 xl:gap-24 lg:gap-16 md:gap-12 sm:gap-12 gap-12 items-center text-zinc-50">
        <div class="w-full max-w-md flex flex-col gap-16">
            <form @submit.prevent="onSubmit">
                <div>
                    <h1 class="mb-12 text-zinc-50">Edit Group</h1>
                    <!-- Name input -->
                    <div class="mb-4">
                        <label class="block text-zinc-400 text-sm font-bold mb-2" for="Name">
                            Name
                        </label>
                        <input v-model="data.name"
                            class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-700 bg-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
                            id="name" type="text" placeholder="Name" required>
                    </div>
                    <!-- Description input -->
                    <div class="mb-6">
                        <label class="block text-zinc-400 text-sm font-bold mb-2" for="description">
                            Description
                        </label>
                        <textarea v-model="data.description"
                            class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-700 bg-zinc-50 leading-tight focus:outline-none focus:shadow-outline max-h-36"
                            id="description" type="text" placeholder="Description" required></textarea>
                    </div>
                </div>
                <!-- Edit members button -->
                <Button color="secondary" width="match-parent" size="lg" @click="navigateTo(`/groups/edit/${group.id}/members`)">Edit Members ({{ amountOfMembers }})</Button>
                <!-- Cancel and save button group -->
                <div class="flex flex-row w-full gap-2 justify-between mt-12">
                    <Button color="danger" width="match-parent" size="lg"
                        @click="navigateTo(`/groups/${group.id}`)">Cancel</Button>
                    <Button color="success" width="match-parent" size="lg" type="submit">Save</Button>
                </div>
                <!-- Error message -->
                <i v-if="editGroupError" class="text-red-500 text-sm">{{ editGroupError }}</i>
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

// Get group out of ID
const route = useRoute();
const { group } = await $fetch(`/api/groups/${route.params.id}`)
// Error handling if getting group failed
if (!group) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load group! Try again...",
        fatal: true,
    })
}

// If the current user tries to access this page but is not the admin, it gets redirected back
if(group.admin !== currentUser.value.id) navigateTo(`groups/${group.id}`)

// temporary variable
const tmpEditGroup = useState("tmpEditGroup");

// Form data
const data = reactive({
    name: group.name,
    description: group.description,
    members: tmpEditGroup.value ? tmpEditGroup.value : group.members,
});

// Calculates the amount of members
const amountOfMembers = computed(() => {
    return tmpEditGroup.value ? tmpEditGroup.value.length : group.members.length;
});

// Edit Error
const editGroupError = ref();

/**
 * # onSubmit
 * Updates the group. If there is an error, throw the error message. If there is no error, then navigate back to the page where the user can view the group.
 */
const onSubmit = async () => {
    const {res, err} = await $fetch(`/api/groups/${group.id}`, {
        method: "put",
        body: data,
    });
    if (!err) {
        editGroupError.value = "";
        navigateTo(`/groups/${group.id}`);
    } else {
        editGroupError.value = "Failed to edit group! Try again..."
    }
}
</script>