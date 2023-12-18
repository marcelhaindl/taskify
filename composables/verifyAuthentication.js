// Function that verifies the authentication by getting the value of the "token" cookie and fetching a request on the verify api
export default async function () {
    const token = useCookie("token");
    return await $fetch("/api/auth/verify", {
        method: "post",
        body: token.value,
    });
}