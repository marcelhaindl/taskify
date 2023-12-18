<template>
    <main
        class="grid 2xl:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 2xl:gap-y-16 xl:gap-y-16 md:gap-y-12 gap-y-8">
        <!-- For every user, print the user -->
        <User v-for="user in users" :user="user" :selected="false" :admin="user.id === group.admin"></User>
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

// Fetch the group
const route = useRoute();
const { group } = await $fetch(`/api/groups/${route.params.id}`)
// Error handling if fetching group failed
if (!group) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load group! Try again...",
        fatal: true,
    })
}

// Members array
const membersArray = ref([]);
membersArray.value = group.members;
const users = ref([]);

// For each members array, load the user
membersArray.value.forEach(async memberID => {
    const { user } = await $fetch(`/api/users/${memberID}`);
    // Error handling if loading user failed
    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: "Failed to load user! Try again...",
            fatal: true,
        })
    }
    // Push the user to the users array
    users.value.push(user);
});

</script>