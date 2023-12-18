<template>
    <main
        class="w-full h-screen flex flex-row justify-center 2xl:gap-36 xl:gap-24 lg:gap-16 md:gap-12 sm:gap-12 gap-12 items-center text-zinc-50">
        <div class="w-full max-w-md flex flex-col gap-16">
            <form @submit.prevent="next">
                <div>
                    <h1 class="mb-12 text-zinc-50">New Group</h1>
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
                <!-- Cancel and next button group -->
                <div class="flex flex-row w-full gap-2 justify-between mt-12">
                    <Button color="danger" width="match-parent" size="lg"
                        @click.prevent="navigateTo(`/groups`)">Cancel</Button>
                    <Button color="success" width="match-parent" size="lg" type="submit">Next</Button>
                </div>
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

// Load the tmpNewGroup temporary variable and load it in case the user goes back from the members screen
const tmp = useState("tmpNewGroup");
const data = reactive({
    name: tmp.value ? tmp.value.name : "",
    description: tmp.value ? tmp.value.description : "",
});

/**
 * # next
 * Save the form data into the temporary variable and navigate to the members screen to select users
 */
const next = () => {
    tmp.value = {
        name: data.name,
        description: data.description,
    }
    navigateTo("/groups/new/member")
}

</script>