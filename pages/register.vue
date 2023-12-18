<template>
    <main class="w-full h-screen flex flex-row justify-center 2xl:gap-36 lg:gap-24 md:gap-12 sm:gap-12 gap-8 items-center">
        <img alt="todo" src="/images/task.png" class="sm:hidden lg:block hidden xl:max-w-md lg:max-w-sm">
        <div class="w-full max-w-md">
            <form @submit.prevent="onSubmit">
                <h1 class="mb-12 text-zinc-50">Register</h1>
                <!-- Email Input -->
                <div class="mb-4">
                    <label class="block text-zinc-400 text-sm font-bold mb-2" for="email">
                        Email Address
                    </label>
                    <input v-model="data.email"
                        class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-700 bg-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
                        id="email" type="email" placeholder="user@gmail.com" required>
                    <i v-if=errorMessage class="text-sm text-red-500">{{ errorMessage }}</i>
                </div>
                <!-- First Name Input -->
                <div class="mb-4">
                    <label class="block text-zinc-400 text-sm font-bold mb-2" for="firstName">
                        First Name
                    </label>
                    <input v-model="data.firstName"
                        class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-700 bg-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
                        id="firstName" type="text" placeholder="First Name" required>
                </div>
                <!-- Last Name Input -->
                <div class="mb-4">
                    <label class="block text-zinc-400 text-sm font-bold mb-2" for="lastName">
                        Last Name
                    </label>
                    <input v-model="data.lastName"
                        class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-700 bg-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
                        id="lastName" type="text" placeholder="Last Name" required>
                </div>
                <!-- Password Input -->
                <div class="mb-8">
                    <label class="block text-zinc-400 text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input v-model="data.password"
                        class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-700 bg-zinc-50 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password" type="password" placeholder="*************" required>
                </div>
                <!-- Register Button -->
                <div class="flex items-center justify-between">
                    <Button color="primary" width="match-parent" size="lg" type="submit">
                        Register
                    </Button>
                </div>
                <!-- Switch to login button -->
                <NuxtLink to="/" class="text-zinc-50 mt-16 w-full flex justify-center cursor-pointer pb-8 xl:pb-0">
                    Already have an account?<strong class="ml-1">Login!</strong>
                </NuxtLink>
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
} else {
    currentUser.value = { id: user.id, firstName: user.firstName, lastName: user.lastName }
    navigateTo("/tasks/upcoming");
}

// Head
useHead({
    title: "Register",
    htmlAttrs: {
        lang: 'en'
    },
    meta: [
        { charset: "utf-8" },
        { name: "description", content: "Taskify is a simple and easy to use production app where users are able to manage their tasks and collaborate with others on group tasks." },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#111827" }
    ]
});

// Layout
definePageMeta({ layout: 'login' })

// Form data
const data = reactive({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
})

// Error Message
const errorMessage = ref();

/**
 * # onSubmit
 * Creates a user with a post request. If it succeeds, it navigates back to the login page. If it does not succeed, then it throws an error message.
 */
const onSubmit = async () => {
    const { err, res } = await $fetch("/api/users", {
        method: "post",
        body: data,
    });

    if (!err) {
        navigateTo("/");
    } else {
        switch (err.code) {
            case "ER_DUP_ENTRY":
                errorMessage.value = "Email already in use!";
                break;
            default:
                errorMessage.value = "Something went wrong";
                break;
        }
    }
}
</script>