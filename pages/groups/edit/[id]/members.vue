<template>
    <!-- Save and cancel button group -->
    <div class="2xl:px-64 xl:px-48 lg:px-36 md:px-24 sm:px-16 px-12 pt-32 flex justify-center">
        <div class="flex flex-row justify-between gap-4 w-1/2">
            <Button color="success" width="match-parent" size="lg" @click.prevent="save">Save</Button>
            <Button color="danger" width="match-parent" size="lg"
                @click.prevent="navigateTo(`/groups/edit/${group.id}`)">Cancel</Button>
        </div>
    </div>
    <!-- Main screen which shows all users -->
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
    if(user.id === currentUser.value.id) {
        const index = users.indexOf(user);
        users.splice(index, 1);
    }
});

// Load the group
const route = useRoute();
const { group } = await $fetch(`/api/groups/${route.params.id}`)
// Error handling if loading group failed
if (!group) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load group! Try again...",
        fatal: true,
    })
}

// If the current user tries to access this page but is not the admin, it gets redirected back
if(group.admin !== currentUser.value.id) navigateTo(`groups/${group.id}`)

// temporary variable for saving information fo the members
const tmpEditGroup = useState("tmpEditGroup");

// members array
const membersArray = ref([]);
membersArray.value = tmpEditGroup.value ? tmpEditGroup.value : group.members;

/**
 * # changeMemberState
 * If the user is clicked it marks them in green to indicate if it is in the group or not
 * @param {Object} user - user object 
 */
const changeMemberState = (user) => {
    if (membersArray.value.includes(user.id)) {
        const index = membersArray.value.indexOf(user.id);
        membersArray.value.splice(index, 1);
    } else {
        membersArray.value.push(user.id);
    }
}

/**
 * # save
 * Returns to the edit group page and hands over the temporary variable state with the members in it.
 */
const save = () => {
    tmpEditGroup.value = membersArray.value;
    navigateTo(`/groups/edit/${group.id}`)
}

</script>