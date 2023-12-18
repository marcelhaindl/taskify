<template>
    <main
        class="w-full h-screen flex flex-row justify-center 2xl:gap-36 xl:gap-24 lg:gap-12 md:gap-12 sm:gap-12 gap-8 items-center">
        <img alt="todo" src="/images/default_profile.png" class="sm:hidden lg:block hidden xl:max-w-md lg:max-w-sm">
        <div class="w-full max-w-md">
            <form @submit.prevent="save" class="w-full">
                <h1 class="mb-12 text-zinc-50">Your Profile</h1>
                <!-- Email Input -->
                <div class="mb-4">
                    <label class="block text-zinc-400 text-sm font-bold mb-2" for="email">
                        Email Address
                    </label>
                    <input v-model="data.email" :class="{ 'text-zinc-700': !disabled }"
                        class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-400 bg-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
                        id="email" type="email" placeholder="user@gmail.com" required v-bind:disabled="disabled">
                    <i v-if=errorMessage class="text-sm text-red-500">{{ errorMessage }}</i>
                </div>
                <!-- First name input -->
                <div class="mb-4">
                    <label class="block text-zinc-400 text-sm font-bold mb-2" for="firstName">
                        First Name
                    </label>
                    <input v-model="data.firstName" :class="{ 'text-zinc-700': !disabled }"
                        class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-400 bg-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
                        id="firstName" type="text" placeholder="First Name" required v-bind:disabled="disabled">
                </div>
                <!-- Last name input -->
                <div class="mb-4">
                    <label class="block text-zinc-400 text-sm font-bold mb-2" for="lastName">
                        Last Name
                    </label>
                    <input v-model="data.lastName" :class="{ 'text-zinc-700': !disabled }"
                        class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-400 bg-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
                        id="lastName" type="text" placeholder="Last Name" required v-bind:disabled="disabled">
                </div>
                <!-- Password input -->
                <div class="mb-8">
                    <label class="block text-zinc-400 text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input v-model="data.password" :class="{ 'text-zinc-700': !disabled }"
                        class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-400 bg-zinc-50 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password" type="password" placeholder="Password" v-bind:disabled="disabled">
                </div>
                <!-- Button Group -->
                <div class="flex flex-col gap-2">
                    <!-- Edit and logout button group (if not editable) -->
                    <div v-if=disabled class="flex items-center justify-between gap-2">
                        <Button color="primary" width="match-parent" size="lg" @click.prevent="edit">Edit</Button>
                        <Button color="danger" width="match-parent" size="lg" @click.prevent="logout">Logout</Button>
                    </div>
                    <!-- Cancel and save button group (if editable)-->
                    <div v-else class="flex items-center justify-between gap-2">
                        <Button color="danger" width="match-parent" size="lg" @click.prevent="cancel">Cancel</Button>
                        <Button color="success" width="match-parent" size="lg" type="submit">Save</Button>
                    </div>
                    <!-- Delete user button (if not editable) -->
                    <Button v-if=disabled color="secondary" width="match-parent" size="lg"
                        @click.prevent="deleteUser">Delete</Button>
                    <i v-if=deleteError class="text-sm text-red-500">{{ deleteError }}</i>
                </div>
            </form>
        </div>
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


// Get user out of ID
const route = useRoute();
const res = await $fetch(`/api/users/${route.params.id}`)

// Error handling if user is not loaded correctly
if (!res.user) {
    throw createError({
        statusCode: 404,
        statusMessage: "Failed to load user! Try again...",
        fatal: true,
    })
}
const resUser = res.user;

// Form data
const data = reactive({
    email: resUser.email,
    firstName: resUser.first_name,
    lastName: resUser.last_name,
    password: "",
})

// disabled variable for edit mode
const disabled = ref(true);

/**
 * # edit
 * Enables edit mode
 */
const edit = () => {
    disabled.value = false;
}
/**
 * # logout
 * Deletes the token cookie with the jwt and log the user out by redirecting it to the home "/" page
 */
const logout = () => {
    // Delete cookie
    const cookie = useCookie("token");
    cookie.value = null
    navigateTo("/");
}
/**
 * # cancel
 * Cancels the edit mode and sets the values of the form to the previous data
 */
const cancel = () => {
    disabled.value = true;
    data.email = resUser.email;
    data.firstName = resUser.first_name;
    data.lastName = resUser.last_name;
    data.password = "";
}

// Error Message
const errorMessage = ref();

/**
 * # save
 * Updates the user with the user ID and the form data.
 * If there is no error then it disables the edit mode again and resets the password.
 * If there is an error, it throws an error message.
 */
const save = async () => {
    const res = await $fetch(`/api/users/${user.id}`, {
        method: "put",
        body: data,
    });
    if (!res.err) {
        disabled.value = true;
        data.password = "";
        errorMessage.value = "";
    } else {
        switch (res.err.code) {
            case "ER_DUP_ENTRY":
                errorMessage.value = "Email already in use!";
                break;
            default:
                errorMessage.value = "Something went wrong";
                break;
        }
    }
}

const deleteError = ref();

const deleteUser = async () => {
    const confirmed = confirm("Are you really sure you want to delete your user?");
    if (confirmed) {
        const res = await $fetch(`/api/users/${user.id}`, {
            method: "delete",
        });
        if (!res.err) {
            deleteError.value = "";
            const cookie = useCookie("token");
            cookie.value = null
            navigateTo("/");
        } else {
            deleteError.value = "Failed to delete user! Try again..."
        }
    }
}

</script>