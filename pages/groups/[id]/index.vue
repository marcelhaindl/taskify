<template>
    <main
        class="w-full h-screen flex flex-row justify-center 2xl:gap-36 xl:gap-24 lg:gap-16 md:gap-12 sm:gap-12 gap-12 items-center text-zinc-50">
        <div class="w-full max-w-md flex flex-col gap-16">
            <div class="flex flex-col gap-8">
                <!-- Show group name -->
                <h1>{{ group.name }} <span class="font-normal text-zinc-400">({{ amountOfMembers }})</span></h1>
                <!-- Description -->
                <div>
                    <p class="text-zinc-300 break-words">{{ group.description }}</p>
                </div>
            </div>
            <!-- Button Group -->
            <div class="flex flex-col gap-2">
                <!-- View Members button -->
                <Button color="secondary" width="match-parent" size="lg"
                    @click="navigateTo(`/groups/${group.id}/members`)">View Members</Button>
                <!-- Edit and delete button group -->
                <div v-if="isAdmin" class="flex flex-row w-full gap-2 justify-between">
                    <Button color="primary" width="match-parent" size="lg"
                        @click.prevent="navigateTo(`/groups/edit/${group.id}`)">Edit</Button>
                    <Button color="danger" width="match-parent" size="lg" @click.prevent="onDelete">Delete</Button>
                </div>
                <!-- Error message -->
                <i v-if="deleteGroupError" class="text-red-500 text-sm">{{ deleteGroupError }}</i>
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

// Get group out of ID
const route = useRoute();
const { group } = await $fetch(`/api/groups/${route.params.id}`);
// Error handling if loading group failed
if (!group) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load group! Try again...",
        fatal: true,
    })
}

// Calculates the amount of the members
const amountOfMembers = computed(() => {
    return group.members.length;
});

// Calculates if the user is admin
const isAdmin = computed(() => {
    return group.admin === currentUser.value.id
})

// Error message
const deleteGroupError = ref();

/**
 * # onDelete
 * Asks again for confirmation if the user is really sure if it wants to delete the group. 
 * If confirmed, it deletes the group and throws an error if an error happened. 
 * Else, navigate back to groups page
 */
const onDelete = async () => {
    const confirmed = confirm("When deleting this group, all tasks relating to this group will also be deleted! Do you want to continue?")
    if (confirmed) {
        const { res, err } = await $fetch(`/api/groups/${group.id}`, {
            method: "delete",
        });
        if (!err) {
            deleteGroupError.value = "";
            navigateTo("/groups")
        } else {
            deleteGroupError.value = "Failed to delete group! Try again..."
        }
    }
}
</script>