<template>
    <!-- Save and cancel button group -->
    <div class="2xl:px-64 xl:px-48 lg:px-36 md:px-24 sm:px-16 px-12 pt-32 flex flex flex-col items-center gap-y-2">
        <div class="flex flex-row justify-between gap-4 w-1/2">
            <Button color="success" width="match-parent" size="lg" @click.prevent="save">Save</Button>
            <Button color="danger" width="match-parent" size="lg" @click.prevent="navigateTo(`/groups/new`)">Cancel</Button>
        </div>
        <!-- Error message when creating group -->
        <i v-if="createGroupError" class="text-red-500 text-sm">{{ createGroupError }}</i>
    </div>
    <!-- Main screen which shows every user -->
    <main
        class="grid 2xl:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 2xl:gap-y-16 xl:gap-y-16 md:gap-y-12 gap-y-8 pt-16">
        <User v-for="user in users" :user="user" :selected="membersArray.includes(user.id)"
            @click="() => changeMemberState(user)"></User>
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

// Fetch all users
const { users } = await $fetch("/api/users");
// Error handling if fetching users failed
if (!users) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load users! Try again...",
        fatal: true,
    })
}
// Cut the current user from the list where you can select all users. Cause you dont want to select yourself
users.forEach(user => {
    if (user.id === currentUser.value.id) {
        const index = users.indexOf(user);
        users.splice(index, 1);
    }
});

// members array
const membersArray = ref([currentUser.value.id]);

// If a user is clicked, change its state and mark it green
const changeMemberState = (user) => {
    if (membersArray.value.includes(user.id)) {
        const index = membersArray.value.indexOf(user.id);
        membersArray.value.splice(index, 1);
    } else {
        membersArray.value.push(user.id);
    }
}

// Load the temporary variable and navigate back to groups/new if it is empty
const tmp = useState("tmpNewGroup");
if (!tmp.value) {
    navigateTo("groups/new")
}

// Form data
const data = reactive({
    name: tmp.value.name,
    description: tmp.value.description,
    members: membersArray.value,
    admin: currentUser.value.id,
})

// Create group error
const createGroupError = ref();

/**
 * # save
 * Creates a group. If there is no error, then navigate back to /groups. If there is an error then print the error
 */
const save = async () => {
    const { res, err } = await $fetch(`/api/groups/`, {
        method: "post",
        body: data,
    });
    if (!err) {
        createGroupError.value = "";
        navigateTo(`/groups`)
    } else {
        createGroupError.value = "Failed to create group! Try again...";
    }
    tmp.value = {}
}

</script>