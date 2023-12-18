<template>
    <main class="w-full h-screen flex flex-row justify-center 2xl:gap-36 lg:gap-24 md:gap-12 sm:gap-12 gap-8 items-center">
        <img alt="todo" src="/images/task.png" class="sm:hidden lg:block hidden xl:max-w-md lg:max-w-sm">
        <div class="w-full max-w-md">
            <form @submit.prevent="onSubmit">
                <h1 class="mb-12 text-zinc-50">Login</h1>
                <!-- Email Input -->
                <div class="mb-4">
                    <label class="block text-zinc-400 text-sm font-bold mb-2" for="email">
                        Email Address
                    </label>
                    <input v-model="data.email"
                        class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-700 bg-zinc-50 leading-tight focus:outline-none focus:shadow-outline"
                        id="email" type="email" placeholder="user@gmail.com" required>
                </div>
                <!-- Password Input -->
                <div class="mb-8">
                    <label class="block text-zinc-400 text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input v-model="data.password"
                        class="shadow appearance-none border rounded w-full py-3 px-3 text-zinc-700 bg-zinc-50 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password" type="password" placeholder="*************" required>
                    <i v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</i>
                </div>
                <!-- Login Button -->
                <div class="flex items-center justify-between">
                    <Button color="primary" width="match-parent" size="lg" type="submit">
                        Login
                    </Button>
                </div>
                <!-- Switch to register button -->
                <NuxtLink to="/register" class="text-zinc-50 mt-16 w-full flex justify-center cursor-pointer pb-8 xl:pb-0">
                    Don't have an account yet?<strong class="ml-1">Register!</strong>
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
    title: "Login",
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
    password: "",
});

// Error Message
const errorMessage = ref();

/**
 * # onSubmit
 * Fetches a token from the login function with an API call. 
 * If the token was created correctly, save a cookie with the name "token" and the conent of the token and navigate to tasks/upcoming. 
 * If the token was not set correctly, that means that the user is not logged in because email or password was incorecct so it throws an error.
 */
const onSubmit = async () => {
    const { token } = await $fetch("/api/auth", {
        method: "post",
        body: data,
    });
    if (token) {
        errorMessage.value = "";
        const cookie = useCookie("token");
        cookie.value = token;
        navigateTo("tasks/upcoming")
    } else {
        errorMessage.value = "Email or password incorret!"
    }
}

</script>