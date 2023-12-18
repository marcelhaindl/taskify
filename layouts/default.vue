<template>
    <div>
        <!-- Header -->
        <nav role="main" class="fixed">
            <div class="flex flex-1 justify-start align-center">
                <!-- Title for website -->
                <h2 class="sm:hidden lg:block hidden font-pacifico font-normal text-blue-400">Taskify</h2>
                <!-- Dropdown Menu for mobile -->
                <div class="sm:block lg:hidden block relative cursor-pointer" @click="toggleDropdown">
                    <IconHamburger class="text-blue-400" width="32px" height="32px" />
                    <div v-if="isDropdownOpen" class="flex flex-col absolute top-12 bg-zinc-800 rounded p-4 pr-12 gap-y-4">
                        <NuxtLink to="/tasks/upcoming" @click="title = 'Upcoming'">Upcoming</NuxtLink>
                        <NuxtLink to="/tasks/completed" @click="title = 'Completed'">Completed</NuxtLink>
                        <NuxtLink to="/groups" @click="title = 'Groups'">Groups</NuxtLink>
                    </div>
                </div>
            </div>
            <!-- Navigation for website -->
            <div
                class="sm:hidden lg:block hidden flex flex-row justify-center items-center 2xl:gap-7 xl:gap-6 lg:gap-5 md:gap-4 sm:gap-2 gap-2">
                <NuxtLink to="/tasks/upcoming" @click="title = 'Upcoming'">Upcoming</NuxtLink>
                <NuxtLink to="/tasks/completed" @click="title = 'Completed'">Completed</NuxtLink>
                <NuxtLink to="/groups" @click="title = 'Groups'">Groups</NuxtLink>
            </div>
            <!-- Navigation indication for mobile -->
            <div class="sm:block lg:hidden block flex flex-row justify-center items-center">
                <p class="text-zinc-50 bg-zinc-800 px-3 py-1 rounded mx-2">{{ title }}</p>
            </div>
            <!-- First and Last name plus profile picture -->
            <div class="flex flex-1 profile">
                <p v-show="isLoaded" class="sm:hidden lg:block hidden">{{ firstName }} {{ lastName }}</p>
                <img @click="navigateTo(`/users/${user.id}`)" src="/images/default_profile.png" alt="profile" width="40"
                    height="40" class="rounded-full cursor-pointer" />
            </div>
        </nav>
        <!-- Display Nuxt Page -->
        <slot></slot>
    </div>
</template>

<script setup>
// is Loaded variable that waits with loading the name until mounted... else undefined
const isLoaded = ref(false);

// Authentication to get the user
const { user } = await verifyAuthentication();

// Variables for user
const firstName = ref();
const lastName = ref();

// If there is a user, save its name
onMounted(() => {
    if (user) {
        firstName.value = user.firstName;
        lastName.value = user.lastName;
        isLoaded.value = true;
    }
})

// Variable for dropdown menu opening
const isDropdownOpen = ref(false);

/**
 * # toggleDropdown
 * Toggles the dropdown menu
 */
const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

// Title of the page
const title = ref("Upcoming");

</script>

<style>
/* Profile Section in header */
.profile {
    justify-content: end;
    align-items: center;
    @apply gap-3;
}

/* Navigation bar */
nav[role='main'] {
    @apply 2xl:px-64 xl:px-48 lg:px-36 md:px-24 sm:px-16 px-12 h-24 w-full flex flex-row justify-between items-center bg-zinc-900 text-zinc-400;
}

/* Navigation Items Desktop*/
nav[role='main']>div>a {
    @apply hover:text-zinc-300 px-3 py-1 mx-2
}

/* Active Navigation Item Desktop */
nav[role='main']>div>a.router-link-active {
    @apply text-zinc-50 bg-zinc-800 px-3 py-1 rounded mx-2
}

/* Navigation Item Mobile */
nav[role='main']>div>div>div>a {
    @apply hover:text-zinc-200 px-3 py-1
}

/* Active Navigation Item Mobile */
nav[role='main']>div>div>div>a.router-link-active {
    @apply text-zinc-50 bg-zinc-700 px-3 py-1 rounded
}
</style>