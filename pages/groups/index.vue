<template>
    <main
        class="grid 2xl:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 2xl:gap-y-16 xl:gap-y-16 md:gap-y-12 gap-y-8">
        <!-- New Group -->
        <GroupNew></GroupNew>
        <!-- For every group, print a group item -->
        <Group v-for="group in groups" :group="group"></Group>
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

// Fetch all groups
const { groups } = await $fetch("/api/groups");
// Error handling if fetching groups failed.
if (!groups) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load groups! Try again...",
        fatal: true,
    })
}

</script>